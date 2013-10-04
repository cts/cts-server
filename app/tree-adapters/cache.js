/*
 * Cache Adapter
 *
 * This is the development adapter while we figure out the right model
 * for building out other adapters.
 *
 */

var uuid = require('node-uuid');
var redis = require('redis');

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
  this.client.get(key, function (err, result) {
    if (err == null) {
      this.client.set(key, JSON.stringify(value), function() {
        cb(key);
      });
    } else {
      // Key already exists.
      // Warning: Endless loop possible (though not likely).
      cache.setUnusedKey(value, cb);
    }
  });
};

/**
 *
 */
CacheAdapter.prototype.fetch = function(key, cb) {
  this.client.get(key, function (err, result) {
    cb(err, JSON.parse(result));
  });
};


CacheAdapter.prototype.remove = function(key, cb) {
  this.client.del(key, cb);
};

exports.CacheAdapter = CacheAdapter;
