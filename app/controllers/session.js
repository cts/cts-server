/*
 * Session Controller
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
var Util           = require('../util.js');
var LoginFn        = UserModel.login;
var _              = require('underscore');
var LocalStrategy  = require('passport-local').Strategy;
var crypto         = require('crypto');

require('date-utils');

/* Constructor
 * ----------------------------------------------------------------------------- 
 * This is the object exported by this file.
 */

var SessionController = function(opts, passport) {
  this.opts = opts;
  this.passport = passport;
};

/* Methods 
 * ----------------------------------------------------------------------------- 
*/

SessionController.prototype.create = function(req, res) {
  this.passport.authenticate('local', function(err, user, info) {
    if (err) { 
      // Something crashed
      return next(err)
    } else if (!user) {
      // User wasn't found
      if (req.accepts('json')) {
        return Util.apiError(res, 500, "User name or password not valid");
      } else {
        return res.redirect('/account.html#LoginInvalid')
      }
    } else {
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        if (req.accepts('json')) {
          return Util.apiSuccess(res, "Success");
        } else {
          return res.redirect('/home');
        }
      });
    }
  })(req, res, next);
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
  this.passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      return res.redirect('/account.html#/login/invalid')
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


