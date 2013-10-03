/*
 * Adapter Factory
 */

var opts = require('../opts')
var CacheAdapter = require('./cache')

var AdapterFactory = function(opts) {
  // Hardcoded for now...
  this.adapters = {
    'cache': new CacheAdapter(opts);
  }
};

AdapterFactory.prototype.forRequest(req) {
  // Hardcoded for now..
  return this.adapters['cache'];
}

var adapterFactory = new AdapterFactory();

exports.AdapterFactory = adapterFactory;
