/*
 * Url Storage Adapter
 *
 * This stores url and all operations associated with that url
 *
 */

var OperationProcessor = require('./operation_processor').OperationProcessor;
var Operation = require('../models/operation').Operation;
var TreePage = require('../models/tree_page').TreePage;

/*
 * Constructor
 *
 * This is the object exported by the file
 *
 */

var UrlStorageAdapter = function(opts) {
  this.opts = opts || {};
};

/*
 * Methods
 */

UrlStorageAdapter.prototype.storePost = function(post, cb) {
  var operation = new Operation(post);
  operation.save(function(err, operation) {
    if (err) {
      console.log("Unable to save operation: " + err);
    }
    this.updateHtml(operation, cb);
  });
}

UrlStorageAdapter.prototype.updateHtml = function(operation, cb) {
  TreePage.findOne({ treeUrl: operation.treeUrl }, function(err, treePage) {
    if (err) {
      console.log('Unable to update html based on operation: ' + err);
    }

    // Apply operation to the currentHtml
    // FIXME: concurrent operations. We need some notion of a queue.
    // In other words, don't perform a new operation before a previous
    // operation is complete.
    var currentHtml = treePage.treeHtml;
    treePage.treeHtml = OperationProcessor.operate(operation, currentHtml);
    treePage.save();
    cb(treePage);
  });
}

exports.UrlStorageAdapter = UrlStorageAdapter;
