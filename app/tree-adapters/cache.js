/*
 * Cache Adapter
 *
 * This is the development adapter while we figure out the right model
 * for building out other adapters.
 *
 */

var globalOpts = require('../../config/opts');
var util = require('../../config/util');
var MongoTree = require('../models/mongo-tree').MongoTree;

/* Constructor
 * ----------------------------------------------------------------------------- 
 * This is the object exported by this file.
 */

var CacheAdapter = function(opts) {
  this.opts = globalOpts.adapters.cache;
  util.deepExtend(this.opts, opts);
};

/* Methods 
 * ----------------------------------------------------------------------------- 
 */

/**
 *
 */
CacheAdapter.prototype.save = function(data, operation, cb) {
  var self = this;
  var mongoTree = new MongoTree({
    content: data,
    url: operation.treeUrl
  });
  mongoTree.save(function(error) {
    if(error) {
      cb(error);
    } else {
      cb(null, self.opts.scheme + ":" + mongoTree.id);
    }
  });
};

/**
 *
 */
CacheAdapter.prototype.fetch = function(key, cb) {
  MongoTree.findById(key, function(error, mongoTree) {
    if (error) {
      cb(error);
    } else {
      if (mongoTree == null) {
        cb("Could not page for key.");
      } else {
        cb(null, mongoTree.content);
      }
    }
  });
};


CacheAdapter.prototype.remove = function(key, cb) {
  MongoTree.findByIdAndRemove(key, function(error) {
    if (error) {
      cb(error);
    } else {
      cb(null);
    }
  })
};

exports.CacheAdapter = CacheAdapter;
