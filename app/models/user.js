/*
 * User Model
 * Handles user creation, login, auth.
 */

var mongoose = require('mongoose');
var crypto   = require('crypto');
var config   = require('../opts');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var salt = "How much wood could a wood chuck chuck?"

// Helper method to make sure we never save a password in cleartext.
var encodePassword = function(pass) {
  if( typeof pass === 'string' && pass.length < 6 ) return ''
  var h = crypto.createHash('sha512');
  h.update(pass);
  h.update(salt);
  return h.digest('base64');
};

var UserSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, set: encodePassword, required: true }
});

var User = mongoose.model('User', UserSchema);

// Helper method for authenticated login.
// Calls done(err, user). On success, err == NULL
var login = function(email, password, done) {
  console.log("Attempting login", email, password);
  if (email && password) {
    User.where('email', email).where('password', encodePassword(password)).findOne(function(err, user) {
      console.log("Login DB Result: ERR:", err, "USER:", user);
      done(err, user);
    });
  } else {
    done('Need to provide email and password');
  }
};

exports.User = User;
exports.login = login;

