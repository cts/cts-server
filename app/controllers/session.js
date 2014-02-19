/*
 * Session Controller
 * Handles user creation, login, auth.
 */

var Mongo          = require('mongodb');
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
      return next(err);
    } else if (!user) {
      // User wasn't found
      if (req.accepts('json')) {
        return Util.apiError(res, 500, "User name or password not valid");
      } else {
        return res.redirect('/account.html#LoginInvalid');
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

exports.SessionController = SessionController;
