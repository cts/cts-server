/*
 * HTML Operator.
 * Operates on HTML Trees.
 */

var globalOpts = require('../opts');
var util = require('../util');

/* Constructor
 * ----------------------------------------------------------------------------- 
 * This is the object exported by this file.
 */

var HtmlOperator = function(opts) {
  this.opts = globalOpts.HtmlOperator;
  util.deepExtend(this.opts, opts);
};

/* Methods 
 * ----------------------------------------------------------------------------- 
 */

/**
 *
 */
HtmlOperator.prototype.perform = function(operation, adapter, cb) {
  switch(operation.action) {
    case 'save':
      this._save(operation, adapter, cb);
      break;
    case 'fetch':
      this._fetch(operation, adapter, cb);
      break;
    default:
      cb("Unknown operator: " + operation.operator);
  }
};

HtmlOperator.prototype._save = function(operation, adapter, cb) {
  // TODO: This handles the minutae of negotiating tree paths, etc etc.
  // TODO: Right now, we just persist whatever was given to us to disk.
  adapter.save(operation.args[0], function(err, data) {
    // TODO: Persist the result of this operation to Mongo.
    if (err) {
      operation.error = {
        message: err
      };
    } else {
      operation.result = {
        url: data
      }
    }
    operation.save(); // TODO: is it ok not to wait?
    cb(err, operation);
  });
};


HtmlOperator.prototype._fetch = function(operation, adapter, cb) {
  adapter.fetch(operation.args[0], function(err, data) {
    // TODO: Persist the result of this operation to Mongo.
    if (err) {
      operation.error = {
        message: err
      };
    } else {
      operation.result = {
        tree: data
      }
    }
    operation.save(); // TODO: is it ok not to wait?
    cb(err, operation);
  });
};

exports.HtmlOperator = HtmlOperator;
