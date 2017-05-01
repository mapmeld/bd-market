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
  /*
  User.find({ test: true }).remove((err) => {
    Item.find({ test: true }).remove((err) => {
    });
  });
  */

  res.render('index', {
    user: req.user
  });
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

        var sampleItems = ['apples', 'peas', 'carrots', 'oranges', 'bags of rice'];
        for (var i = 0; i < 10; i++) {
          var farmer = farmers[Math.floor( Math.random() * farmers.length )];
          var q = Math.ceil(Math.random() * 10);
          var cost = ((100 + Math.random() * 600) / 100).toFixed(2);
          var x = new Item({
            thing: sampleItems[Math.floor(Math.random() * sampleItems.length)],
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

// individual item page
app.get('/item/:item_id', middleware, (req, res) => {
  Item.findById(req.params.item_id, (err, item) => {
    if (err) {
      throw err;
    }
    if (!item) {
      return res.json({ error: 'item does not exist' });
    }

    res.render('item', {
      user: req.user,
      csrfToken: req.csrfToken(),
      item: item
    });
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

    item.sold += q;
    item.save((err) => {
      if (err) {
        throw err;
      }
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
          id: item._id
        },
        quantity: q,
        farmer: item.farmer.name,
        time: new Date(),
        total: total,
        test: (!req.user || req.user.test || item.test)
      });
      o.save((err) => {
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
  console.log('app is running');
});

module.exports = app;
