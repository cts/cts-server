/*
 * User Controller
 * Handles user creation, login, auth.
 */

var Mongo          = require('mongodb');
var db             = require('../db');
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
  app.get(prefix + '/isLoggedIn', self.isLoggedIn.bind(self));
  app.post(prefix + '/token', self.token.bind(self));
  app.post(prefix + '/forgot', self.forgot.bind(self));
};

UserController.prototype.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login.html');
};

exports.UserController = UserController;

