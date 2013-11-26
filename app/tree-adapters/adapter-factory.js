/*
 * Adapter Factory
 */

var opts = require('../../config/opts')
var CacheAdapter = require('./cache').CacheAdapter;
var FilesystemAdapter = require('./filesystem').FilesystemAdapter;

var AdapterFactory = function() {
  // Hardcoded for now...
  this.adapters = {};
  this.adapters[opts.adapters.cache.scheme] = new CacheAdapter();
  this.adapters[opts.adapters.filesystem.scheme] = new FilesystemAdapter;
};

AdapterFactory.prototype.adapterForOperation = function(operation) {
  // We'll examine the URL
  var scheme = operation.urlScheme();
  if ((scheme != null) && (scheme in this.adapters)) {
    return this.adapters[scheme];
  }
  // Default.
  return this.adapters[opts.adapters.default];
}

var adapterFactory = new AdapterFactory();

exports.AdapterFactory = adapterFactory;
