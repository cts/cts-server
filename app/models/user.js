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
      return bcrypt.hashSync(password, 5);
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
    hash = User.findOne({email: email}, function(err, userObject){
      if (!userObject||err){
        console.log('Error: '+err);
        return done('Incorrect username or password.', false);
      }else{
        bcrypt.compare(password, userObject.password, function(err, doesMatch){
          console.log("Login DB Result: ERR:", err, " doesMatch:", doesMatch);
          console.log(userObject);
          if(!doesMatch||err){
            return done('Incorrect username or password.', userObject);
          }else{
            return done(null, userObject);
          }
        });
      }
    });
  } else {
    return done('Need to provide email and password', false);
  }
};

exports.User = User;
exports.login = login;

