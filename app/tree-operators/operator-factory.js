/*
 * Operator Factory
 */

var opts = require('../opts')
var HtmlOperator = require('./html').HtmlOperator;

var OperatorFactory = function() {
  // Hardcoded for now...
  this.operators= {
    'html': new HtmlOperator()
  }
};

OperatorFactory.prototype.operatorForRequest = function(req) {
  // Hardcoded for now..
  return this.operators['html'];
};

var operatorFactory = new OperatorFactory();

exports.OperatorFactory = operatorFactory;

