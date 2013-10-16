/*
 * File adapter
 * Wraps HTML files on the local disk.
 */

/* Constructor
 * ----------------------------------------------------------------------------- 
 * This is the object exported by this file.
 */

var FilesystemAdapter = function(opts) {
  this.opts = opts || {};
};

/* Methods 
 * ----------------------------------------------------------------------------- 
 */

/**
 *
 */
FilesystemAdapter.prototype.save = function(data, cb) {
};

/**
 *
 */
FilesystemAdapter.prototype.fetch = function(key, cb) {
};


FilesystemAdapter.prototype.remove = function(key, cb) {
};

exports.FilesystemAdapter = FilesystemAdapter;
