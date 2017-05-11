// Express and MongoDB imports
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const compression = require('compression');
const csrf = require('csurf');

console.log('Connecting to MongoDB (required)');
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'localhost');

const User = require('./models/user');
const Item = require('./models/item');
const Order = require('./models/order');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express['static'](__dirname + '/static'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  secret: process.env.SESSION || 'wieojvowj92e90jjsjs',
  resave: false,
  saveUninitialized: false
}));

const csrfProtection = csrf({ cookie: true });

/* for use in testing only */
function passThrough(req, res, next) {
  if (typeof global.it === 'function') {
    if (req.method === 'POST') {
      next();
    } else {
      return csrfProtection(req, res, next);
    }
  } else {
    throw 'passThrough happening in production';
  }
}

const middleware = ((typeof global.it === 'function') ? passThrough : csrfProtection);

// user registration and management
require('./login')(app, middleware);

app.get('/', middleware, (req, res) => {
  res.render('index', {
    user: req.user
  });
});

app.get('/dump', middleware, (req, res) => {
  User.find({ test: true }).remove((err) => {
    Item.find({ test: true }).remove((err) => {
    });
  });
  res.send('dumping test data...');
});

app.get('/farmers', middleware, (req, res) => {
  User.find({ manager: false, customer: false })
    .skip(req.body.page * 10)
    .limit(10)
    .exec((err, farmers) => {

    if (err) {
      throw err;
    }
    if (!farmers.length) {
      User.generateFarmers(10);
      return res.send('generated test farmers...');
    }

    res.render('farmers', {
      user: req.user,
      csrfToken: req.csrfToken(),
      farmers: farmers
    });
  });
});

app.get('/farmers/:username', middleware, (req, res) => {
  User.findOne({ user_id: req.params.username }, (err, farmer) => {
    if (err) {
      throw err;
    }
    if (!farmer) {
      return res.json({ error: 'no farmer with this ID' });
    }
    
    Item.find({ 'farmer.uid': req.params.username }, (err, items) => {
      if (err) {
        throw err;
      }
    
      res.render('farmer', {
        user: req.user,
        csrfToken: req.csrfToken(),
        farmer: farmer,
        items: items
      });
    });
  });
});

app.get('/store', middleware, (req, res) => {
  Item.find({}).limit(10).exec((err, items) => {
    if (err) {
      throw err;
    }
    if (!items.length) {
      User.find({ manager: false, customer: false }, (err, farmers) => {
        if (err) {
          throw err;
        }
        if (!farmers.length) {
          return;
        }

        var sampleItems = [
          { word: 'apples', img: '/img/apple.png' },
          { word: 'peas', img: '/img/peas.png' },
          { word: 'carrots', img: '/img/carrot.png' },
          { word: 'oranges', img: '/img/orange.png' },
          { word: 'bags of rice', img: '/img/rice.png' }
        ];
        for (var i = 0; i < 10; i++) {
          var farmer = farmers[Math.floor( Math.random() * farmers.length )];
          var q = Math.ceil(Math.random() * 10);
          var cost = (100 + Math.random() * 600).toFixed(2);
          var baseItem = sampleItems[Math.floor(Math.random() * sampleItems.length)];
          var x = new Item({
            thing: baseItem.word,
            img: baseItem.img,
            farmer: {
              uid: farmer.user_id,
              name: farmer.name
            },
            admin: farmer.admin || 'Test',
            quantity: q,
            sold: Math.round(Math.random() * q),
            test: true,
            cost: cost
          });
          x.save((err) => {});
        }
      });
      return res.send('generated test items...');
    }

    res.render('store', {
      user: req.user,
      csrfToken: req.csrfToken(),
      items: items
    });
  });
});

app.get('/cart', middleware, (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  Order.find({ completed: false, 'customer.id': req.user._id }, (err, openOrders) => {
    if (err) {
      throw err;
    }
    
    res.render('cart', {
      orders: openOrders,
      user: req.user
    });
  });
});

// individual item page
app.get('/item/:item_id', middleware, (req, res) => {
  Item.findById(req.params.item_id, (err, item) => {
    if (err) {
      throw err;
    }
    if (!item) {
      return res.json({ error: 'item does not exist' });
    }
    
    function showItem(openOrders, closedOrders) {
      res.render('item', {
        user: req.user,
        csrfToken: req.csrfToken(),
        item: item,
        openOrders: openOrders,
        closedOrders: closedOrders
      });
    }
    
    if (req.user) {
      // determine if this user has previous orders
      Order.find({ 'customer.id': req.user._id, 'item.id': req.params.item_id }).sort('-time').exec((err, prevOrders) => {
        if (err) {
          throw err;
        }
        var openOrders = [];
        var closedOrders = [];
        for (var i = 0; i < prevOrders.length; i++) {
          if (prevOrders[i].completed) {
            // previously purchased this item from this farmer before
            closedOrders.push(prevOrders[i]);
          } else {
            openOrders.push(prevOrders[i]);
          }
          if (openOrders.length && closedOrders.length) {
            // really don't need more than one-most-recent open/closed order
            break;
          }
        }
        
        showItem(openOrders, closedOrders);
      });
    } else {
      showItem();
    }
  });
});

app.post('/item/:item_id/buy', middleware, (req, res) => {
  Item.findById(req.params.item_id, (err, item) => {
    if (err) {
      throw err;
    }
    if (!item) {
      return res.json({ error: 'item does not exist' });
    }

    var q = 1 * req.body.quantity;
    if (q <= 0 || isNaN(q) || (Math.round(q) !== q)) {
      return res.json({ error: 'did not understand quantity' });
    }
    if (q > item.quantity - item.sold) {
      return res.json({ error: 'you tried to buy more than are currently available' });
    }

    var unitCost = (item.cost * 1).toFixed(2) * 1;
    var total = (unitCost * q).toFixed(2);
    
    var buyer = req.user || {
      name: 'TEST',
      _id: 'TEST'
    };

    var o = new Order({
      customer: {
        name: buyer.name,
        id: buyer._id
      },
      item: {
        name: item.thing,
        id: item._id,
        img: item.img
      },
      quantity: q,
      farmer: item.farmer.name,
      time: new Date(),
      total: total,
      completed: false,
      test: (!req.user || req.user.test || item.test)
    });
    o.save((err) => {
      if (err) {
        throw err;
      }
      item.sold += q;
      item.save((err) => {
        if (err) {
          throw err;
        }
        res.redirect('/store?sold=' + o._id);
      });
    });
  });
});

app.get('/orders', middleware, (req, res) => {
  Order.find({}).limit(10).exec((err, orders) => {
    if (err) {
      throw err;
    }
    res.json(orders);
  });
});

app.listen(process.env.PORT || 8080, () => {
  console.log('app is running on PORT ' + (process.env.PORT || 8080));
});

module.exports = app;
