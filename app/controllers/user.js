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
  res.header('Access-Control-Allow-Origin', '*');
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

UserController.prototype.login = function(req, res, next) {
  console.log("Setting CORS headers");
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  this.passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/account.html#/login/invalid');
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/home');
    });
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
  // Manual Login

  this.passport.use(new LocalStrategy(
    { usernameField: "email", passwordField: "password"}, LoginFn));

  // Token Login
  //if (this.opts.allowTokens) {
  //  this.passport.use(new BearerStrategy(
  //    function(token, done) {
  //      User.findOne({ oauthToken: token}, function(err, user) {
  //        if (err)   { return done(err); }
  //        if (!user) { return done(null, false); }
  //        return done(null, user, { scope: 'read' });
  //      });
  //    }
  //  ));
  //}

  if (this.opts.allowSessions) {
    console.log("Setting serialize user");
    this.passport.serializeUser(function(user, done) {
      console.log("serializeUser", user);
      done(null, user.id);
    });

    console.log("Setting deserialize user");
    this.passport.deserializeUser(function(id, done) {
      console.log("DE-serializeUser");
      User.findById(id, function (err, user) {
        done(err, user);
      });
    });
  }
  var self = this;
  app.post(prefix,            self.create.bind(self));
  app.post(prefix + '/login', self.login.bind(self));
  app.get(prefix + '/logout', self.destroySession.bind(self));
  app.post(prefix + '/forgot', self.forgot.bind(self));
  app.options(prefix + '/login', self.preflight.bind(self));
  app.options(prefix + '/forgot', self.preflight.bind(self));
};

UserController.prototype.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login.html');
};

exports.UserController = UserController;
