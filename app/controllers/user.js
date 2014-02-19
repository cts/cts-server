/*
 * User Controller
 * Handles user creation, login, auth.
 */

var Mongo          = require('mongodb');
var Connection     = Mongo.Connection;
var Server         = Mongo.Server;
var BSON           = Mongo.BSON;
var ObjectID       = Mongo.ObjectID;
var UserModel      = require('../models/user');
var User           = UserModel.User;
var LoginFn        = UserModel.login;
var _              = require('underscore');
var LocalStrategy  = require('passport-local').Strategy;
var crypto         = require('crypto');

require('date-utils');

/* Constructor
 * -----------------------------------------------------------------------------
 * This is the object exported by this file.
 */

var UserController = function(opts, passport) {
  this.opts = opts;
  this.passport = passport;
};

/* CORS Preflight
 */
UserController.prototype.preflight = function(req, res) {
  // Add CORS Headers
  console.log("CORS Preflight");
  res.header('Access-Control-Allow-Origin', 'http://web.mit.edu');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).send();
};

/* Methods
 * -----------------------------------------------------------------------------
*/

UserController.prototype.create = function(req, res) {
  var userdata = _.pick(req.body, 'email', 'password');
  var self = this;
  User.create(userdata, function(error, users) {
    if (error) {
      console.log(error);
      res.status(400).send("Error while creating new user account: " + error);
    } else {
      var user = items[0];
      res.send(user);
    }
  });
};


UserController.prototype.forgot = function(req, res, next) {
  var user = _.pick(req.body, 'email');
  User.findOne({'email': user.email}, function(err, user) {
    if (err)   {
      res.status(401).send("Error");
    }
    else if (!user) {
      res.status(401).send("Error");
    }
    else {
        crypto.randomBytes(32, function(ex, buf) {
        user.reset_password_token = buf.toString('hex');
        user.reset_password_expire = Date.tomorrow();
        user.save(function(err, user) {
          if (err) {
            res.status(400).send("Error - Could not update reset token.");
          } else {
            Tasker.enqueue("ForgotEmail", {
              email: user.email,
              token: user.reset_password_token
            }).then(
              function() {
                res.send("Success");
              },
              function() {
                res.status(400).send("Could'nt task recovery email.");
              });
          }
        });
      });
    }
  });
};


UserController.prototype.githubAuthorize = function(req, res, next) {
  console.log(req);
};

UserController.prototype.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    res.send("Yes");
  } else {
    res.send("No");
  }
};

UserController.prototype.reset = function(req, res, next) {
  var u = _.pick(req.body, 'token', 'password');

  User.findOne({'reset_password_token': u.token}, function(err, user) {
    if (err)   {
      res.status(401).send("Error");
    }
    else if (!user) {
      res.status(401).send("Error");
    }
    else {
      if (user.reset_password_expire > Date.today()) {
        user.password = u.password;
        user.save(function(err, user) {
          if (err) {
            res.status(400).send("Error - Could not update reset token.");
          } else {



            // TODO: Actually send email
            res.send("Success");
          }
        });
      }
    }
  });
};

UserController.prototype.createWithToken = function(req, res) {
  if (opts.allowTokens) {
    // Passport responds with HTTP 401 Unauthorized if this fails.
    this.passport.authenticate('bearer', {session: false}, function(req, res) {
      res.send('Logged In');
    });
  } else {
    // 401 = Unauthorized
    res.status(401).send('Token authentication not permitted.');
  }
};

UserController.prototype.isLoggedIn = function(req, res, next) {
  console.log("CORS Preflight");
  res.header('Access-Control-Allow-Origin', 'http://web.mit.edu');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  console.log("session*******************");
  console.log(req.session);
  console.log("XHR************************");
  console.log(req.xhr);
  console.log("isAuthenticated**************");
  console.log(req.isAuthenticated());

  if (req.isAuthenticated()) {
    return res.send("Yes");
  } else {
    return res.send("No");
  }
};

UserController.prototype.login = function(req, res, next) {
  console.log("Setting CORS headers");
  res.header('Access-Control-Allow-Origin', 'http://web.mit.edu');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  console.log("USER*******************");
  console.log(req.user);
  console.log("session*******************");
  console.log(req.session);
  console.log("XHR************************");
  console.log(req.xhr);

  console.log("Authenticating user");
  this.passport.authenticate('local', function(err, user, info) {
    if (err) {
      console.log("error "+ err);
      return res.send(401, err);
    }
    if (!user) {
      console.log("no such user");
      return res.send(401, 'no such user');
    }
    req.logIn(user, function(err){
      if (err) {
        console.log("error "+ err);
        return res.send(401, err);
      }
      console.log('It worked');
      return res.send(200, 'log in successful');
    });
  })(req, res, next);
};

UserController.prototype.loginRedirect = function(req, res, next){
  console.log('traditional login triggered');
  this.passport.authenticate('local', function(err, user, info) {
    if (err) {
      console.log('bad login');
      return res.redirect('/no');
    }else{
      // create session, get the key and return it
      console.log('good login');
      return res.redirect('/');
    }
  })(req, res, next);
};

UserController.prototype.destroySession = function(req, res) {
  req.logout();
  res.redirect('/');
};

UserController.prototype.destroyToken = function(req, res) {
  if (opts.allowTokens) {
  } else {
  }
  // Clears the user's token
};

UserController.prototype.connectToApp = function(app, prefix) {
  console.log('hooking up user routes');
  var self = this;
  app.post(prefix                     , self.create.bind(self));
  app.post(prefix + '/login'          , self.login.bind(self));
  app.get(prefix + '/logout'          , self.destroySession.bind(self));
  app.post(prefix + '/token', self.token.bind(self));
  app.post(prefix + '/forgot'         , self.forgot.bind(self));
  app.options(prefix + '/login'       , self.preflight.bind(self));
  app.options(prefix + '/forgot'      , self.preflight.bind(self));
  app.options(prefix + '/isLoggedIn'  , self.preflight.bind(self));
  app.post(prefix + '/isLoggedIn'     , self.isLoggedIn.bind(self));
  app.post(prefix + '/login-redirect' , self.loginRedirect.bind(self));
};

UserController.prototype.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login.html');
};

exports.UserController = UserController;
