var uuid = require('node-uuid');

function createCache(args) {
  args = args || {};
  var cache = {};
  var redis = require('redis');
  cache.client = redis.createClient(args.port, args.host, args);

  if (args.db) {
    cache.client.select(args.db);
  }

  cache.get = function (key, cb) {
    cache.client.get(key, function (err, result) {
      cb(err, JSON.parse(result));
    });
  };

  cache.set = function (key, value, cb) {
    cache.client.set(key, JSON.stringify(value), cb);
  };

  cache.setUnusedKey = function(value, cb) {
    var key = uuid.v4();
    cache.client.get(key, function (err, result) {
      if (err == null) {
        cache.client.set(key, JSON.stringify(value), function() {
          cb(key);
        });
      } else {
        cache.setUnusedKey(value, cb);
      }
    });
  }

  cache.del = function (key, cb) {
    cache.client.del(key, cb);
  };

  return cache;
}

exports.createCache = createCache;
