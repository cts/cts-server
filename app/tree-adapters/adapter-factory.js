/*
 * Adapter Factory
 */

var opts = require('../opts')
var CacheAdapter = require('./cache').CacheAdapter;

var AdapterFactory = function() {
  // Hardcoded for now...
  this.adapters = {
    'cache': new CacheAdapter(),
    'fs': new FilesystemAdapter()
  }
};

AdapterFactory.prototype.adapterForRequest = function(req) {
  // Hardcoded for now..
  return this.adapters['cache'];
}

var adapterFactory = new AdapterFactory();

exports.AdapterFactory = adapterFactory;
