const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');

var len = 128;
var iterations = 12000;

function userSetup(app, middleware) {
  // Passport module setup
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(
    (username, password, done) => {
      User.findOne({ user_id: username }, function (err, user) {
        // valid login/user check
        if (err) { return done(err); }
        if (!user) { return done(null, false); }

        // correct password check
        var hash = crypto.pbkdf2Sync(password, user.salt, iterations, len, 'sha256');
        hash = hash.toString('base64');
        if (hash !== user.passwordhash) {
          return done(null, false);
        }

        // success!
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  // user registration form
  app.get('/register', middleware, (req, res) => {
    res.render('register', {
      user: req.user,
      csrfToken: req.csrfToken()
    });
  });

  // user login form
  app.get('/login', middleware, (req, res) => {
    res.render('login', {
      csrfToken: req.csrfToken()
    });
  });

  app.post('/login', middleware, (req, res) => {
    res.redirect('/store');
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/?loggedout');
  });

  // respond to user POST
  app.post('/register', middleware, (req, res) => {
    User.findOne({ user_id: req.body.user_id }, (err, matchUser) => {
      if (err) {
        throw err;
      }
      if (matchUser) {
        return res.json({ error: 'User already exists' });
      }

      // store password securely
      crypto.randomBytes(len, (err, salt) => {
        if (err) {
          throw err;
        }

        salt = salt.toString('base64');
        var hash = crypto.pbkdf2Sync(req.body.password, salt, iterations, len, 'sha256');
        hash = hash.toString('base64');

        var u = new User({
          user_id: req.body.user_id,
          name: req.body.name,
          email: req.body.email,
          languages: req.body.preferLanguage.replace(/\s+/g, '').split(','),
          passwordhash: hash,
          salt: salt,
          farmers: [],
          manager: false,
          customer: false,
          test: false
        });
        if (req.body.role === 'customer') {
          u.customer = true;
        } else if (req.body.role === 'manager') {
          u.manager = true;
        }
        u.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect('/login?username=' + u.user_id);
        });
      });
    });
  });

  // local oauth test
  app.post('/auth/local', passport.authenticate('local', { failureRedirect: '/login?fail=true' }), (req, res) => {
    if (req.user.name === 'unset') {
      res.redirect('/register');
    } else {
      res.redirect('/store');
    }
  });
}

module.exports = userSetup;
