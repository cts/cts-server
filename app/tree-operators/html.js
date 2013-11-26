/*
 * HTML Operator.
 * Operates on HTML Trees.
 */

var globalOpts = require('../../config/opts');
var util = require('../../config/util');
var cheerio = require('cheerio');
var OperatorBase = require('./operator-base').OperatorBase;

/* Constructor
 * ----------------------------------------------------------------------------- 
 * This is the object exported by this file.
 */

var HtmlOperator = function(opts) {
  this.opts = globalOpts.operators.html;
  opts = opts || {};
  util.deepExtend(this.opts, opts);
};

// Inherit from OperatorBase
HtmlOperator.prototype = new OperatorBase();

/* "Private" Methods 
 * ----------------------------------------------------------------------------- 
 *
 * NOTE: All of these methods are managed by the superclass, OperatorBase.
 * They should simply perform a manipulation without any regard to persistence.
 *
 */

/**
 * Sets $(operation.params.selector) <- operation.params.replacement
 */
HtmlOperator.prototype._edit = function(operation, data, cb) {
  var error = this._checkForMissingParams(
      operation, ['selector', 'replacement']);
  if (error) {
    cb(error);
  } else {
    $ = cheerio.load(data);
    var elem = $(operation.parameters.selector);
    if (elem.length == 0) {
      cb("Selector did not resolve any elements.");
    } else {
      // The duplication.
      elem.html(operation.parameters.replacement);
      cb(null, $.html());
    }
  }
};

/**
 * Duplicates $(operation.params.selector).
 */
HtmlOperator.prototype._duplicate = function(operation, data, cb) {
  var error = this._checkForMissingParams(operation, ['selector']);
  if (error) {
    cb(error);
  } else {
    $ = cheerio.load(data);
    var elem = $(operation.parameters.selector);
    if (elem.length == 0) {
      cb("Selector did not resolve any elements.");
    } else {
      // The duplication.
      elem.after(elem.clone());
      cb(null, $.html());
    }
  }
};

/**
 * Removes $(operation.params.selector) from tree.
 */
HtmlOperator.prototype._remove = function(operation, data, cb) {
  var error = this._checkForMissingParams(operation, ['selector']);
  if (error) {
    cb(error);
  } else {
    $ = cheerio.load(data);
    var elem = $(operation.parameters.selector);
    if (elem.length == 0) {
      cb("Selector did not resolve any elements.");
    } else {
      // The duplication.
      elem.remove();
      cb(null, $.html());
    }
  }
};


exports.HtmlOperator = HtmlOperator;
