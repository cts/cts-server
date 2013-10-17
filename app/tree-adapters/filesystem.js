/*
 * File adapter
 * Wraps HTML files on the local disk.
 */

var globalOpts = require('../opts');
var uuid = require('node-uuid');
var util = require('../util');
var path = require('path');
var fs = require('fs');

/* Constructor
 * ----------------------------------------------------------------------------- 
 * This is the object exported by this file.
 */

var FilesystemAdapter = function(opts) {
  this.opts = globalOpts.FilesystemAdapter;
  util.deepExtend(this.opts, opts);
};

/* Methods 
 * ----------------------------------------------------------------------------- 
 */

/**
 *
 */
FilesystemAdapter.prototype.save = function(data, cb) {
  var key = uuid.v4();
  var self = this;
  var file = path.join(this.opts.rootDir, key);

  if (data == null) {
    cb("Data was missing.");
    return;
  }

  fs.exists(file, function(exists) {
    if (exists) {
      // Try again with new UUID..
      self.save(data, cb);
    } else {
      var fileOpts = {};
      fs.writeFile(file, JSON.stringify(data), fileOpts, function(err) {
        if (err) {
          cb(err);
        } else {
          cb(null, key);
        }
      });
    }
  });
};

/**
 *
 */
FilesystemAdapter.prototype.fetch = function(key, cb) {
  var file = path.join(this.opts.rootDir, key);
  // Manually implementing callback rather than passing cb as argument directly
  // to readFile just to provide a space to do further processing / decoding later
  // if necessary.
  fs.readFile(file, function(err, data) {
    if (err) {
      cb(err);
    } else {
      var toReturn = JSON.parse(data);
      cb(null, toReturn);
    }
  });
};


FilesystemAdapter.prototype.remove = function(key, cb) {
  var file = path.join(this.opts.rootDir, key);
  // Manually implementing callback rather than passing cb as argument directly
  // to unlink just to provide a space to do further processing / decoding later
  // if necessary.
  fs.unlink(file, function(err) {
    if (err) {
      cb(err);
    } else {
      cb(null);
    }
  });
};

exports.FilesystemAdapter = FilesystemAdapter;
