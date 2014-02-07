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
  password: String,
  google: { type: String, unique: true, sparse: true },
  twitter: { type: String, unique: true, sparse: true },
  github: { type: String, unique: true, sparse: true },
  tokens: Array,
  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  }
});

UserSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.methods.gravatar = function(size, defaults) {
  if (!size) size = 200;
  if (!defaults) defaults = 'retro';
  var md5 = crypto.createHash('md5').update(this.email);
  return 'https://gravatar.com/avatar/' + md5.digest('hex').toString() + '?s=' + size + '&d=' + defaults;
};

module.exports = mongoose.model('User', UserSchema);
