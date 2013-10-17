/*
 * User Model
 * Handles user creation, login, auth.
 */

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var config   = require('../opts');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  password: {
    type: String,
    set: function(password){
      return bcrypt.hash(password, 5, function(err, bcryptedPassword){
        return bcryptedPassword;
      });
    },
    required: true
  }
});

var User = mongoose.model('User', UserSchema);

// Helper method for authenticated login.
// Calls done(err, user). On success, err == NULL
var login = function(email, password, done) {
  console.log("Attempting login", email, password);
  if (email && password) {
    hash = User.where('email', email);
    bcrypt.compare(password, hash, function(err, doesMatch){
      console.log("Login DB Result: ERR:", err, " doesMatch:", doesMatch);
      done(err, doesMatch);
    };
    User.where('email', email).where('password', encodePassword(password)).findOne(function(err, user) {
      console.log("Login DB Result: ERR:", err, "USER:", user);
      done(err, user);
    });
  } else {
    done('Need to provide email and password');
  };
};

exports.User = User;
exports.login = login;

