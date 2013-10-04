/*
 * Cache Adapter
 *
 * This is the development adapter while we figure out the right model
 * for building out other adapters.
 *
 */

var uuid = require('node-uuid');
var redis = require('redis');

var ERR_NULL_VALUE =
    "[Error: send_command: set value must not be undefined or null]";

/* Constructor
 * ----------------------------------------------------------------------------- 
 * This is the object exported by this file.
 */

var CacheAdapter = function(opts) {
  this.opts = opts || {};
  this.client = redis.createClient(opts.redis.port, opts.redis.host, opts.redis);

  if (opts.redis.db) {
    this.client.select(args.db);
  }
};

/* Methods 
 * ----------------------------------------------------------------------------- 
 */

/**
 *
 */
CacheAdapter.prototype.save = function(data, cb) {
  var key = uuid.v4();
  var self = this;
  this.client.get(key, function (err, result) {
    if (err == null) {
      self.client.set(key, JSON.stringify(data), function(err) {
        cb(null, key);
      });
    } else if (err == ERR_NULL_VALUE) {
        // Warning: Dangerous to use error text instead of code.
        cb(ERR_NULL_VALUE);
    } else {
      // Key already exists.
      // Warning: Endless loop possible (though not likely).
      self.save(data, cb);
    }
  });
};

/**
 *
 */
CacheAdapter.prototype.fetch = function(key, cb) {
  this.client.get(key, function (err, result) {
    cb(err, result);
  });
};


CacheAdapter.prototype.remove = function(key, cb) {
  this.client.del(key, cb);
};

exports.CacheAdapter = CacheAdapter;
