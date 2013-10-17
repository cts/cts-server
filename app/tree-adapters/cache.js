/*
 * Cache Adapter
 *
 * This is the development adapter while we figure out the right model
 * for building out other adapters.
 *
 */

var globalOpts = require('../opts');
var util = require('../util');
var TreePage = require('../models/tree_page').TreePage;

/* Constructor
 * ----------------------------------------------------------------------------- 
 * This is the object exported by this file.
 */

var CacheAdapter = function(opts) {
  this.opts = globalOpts.CacheAdapter;
  util.deepExtend(this.opts, opts);
};

/* Methods 
 * ----------------------------------------------------------------------------- 
 */

/**
 *
 */
CacheAdapter.prototype.save = function(data, cb) {
  var self = this;
  var treePage = new TreePage({
    content: data
  });
  treePage.save(function(error) {
    if(error) {
      cb(error);
    } else {
      cb(null, treePage.id);
    }
  });
};

/**
 *
 */
CacheAdapter.prototype.fetch = function(key, cb) {
  TreePage.findById(key, function(error, treePage) {
    if (error) {
      cb(error);
    } else {
      if (treePage == null) {
        cb("Could not page for key.");
      } else {
        cb(null, treePage.content);
      }
    }
  });
};


CacheAdapter.prototype.remove = function(key, cb) {
  TreePage.findByIdAndRemove(key, function(error) {
    if (error) {
      cb(error);
    } else {
      cb(null);
    }
  })
};

exports.CacheAdapter = CacheAdapter;
