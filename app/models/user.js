/*
 * User Model
 * Handles user creation, login, auth.
 */

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var config   = require('../../config/opts');
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

// Helper method for authenticated login.
// Calls done(err, user). On success, err == NULL
UserSchema.statics.isValidUserPassword = function(email, password, done) {
  console.log("Attempting login", email, password);
  if (email && password) {
    hash = this.findOne({email: email}, function(err, userObject){
      if (!userObject||err){
        console.log('Error: '+err);
        return done('Incorrect username or password.', false);
      }else{
        bcrypt.compare(password, userObject.password, function(err, doesMatch){
          console.log("Login DB Result: ERR:", err, " doesMatch:", doesMatch);
          if(!doesMatch||err){
            console.log('Does not match');
            return done('Incorrect username or password.', userObject);
          }else{
            console.log('Does match');
            return done(null, userObject);
          }
        });
      }
    });
  } else {
    return done('Need to provide email and password', false);
  }
};

var User = mongoose.model('User', UserSchema);
exports.User = User;
