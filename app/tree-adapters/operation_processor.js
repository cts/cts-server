/*
 * Operation Processor
 *
 * This takes an operation and some html, and applies that operation onto
 * the html.
 *
 */

var OperationProcessor = function(opts) {
  this.opts = opts || {};
}

OperationProcessor.prototype.operate(operation, html) {
  // FIXME: implement this method
  return html;
}

exports.OperationProcessor = OperationProcessor;
