/*
 * Url Storage Adapter
 *
 * This stores url and all operations associated with that url
 *
 */

var OperationProcessor = require('./operation_processor').OperationProcessor;
var Operation = require('../models/operation').Operation;
var TreePage = require('../models/tree_page').TreePage;
var uuid = require('node-uuid');

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

UrlStorageAdapter.prototype.save = function(post, cb) {
  TreePage.findOne({ treeUrl: operation
};

UrlStorageAdapter.prototype.save = function(post, cb) {
  var operation = new Operation(post);
  operation.save(function(err, operation) {
    if (err) {
      TreePage.create({
        treeKey: uuid.v4(),
        treeUrl: post.treeUrl,
        treeHtml: post.html
      }, function(err, newTreePage) {
        if (err) {
          console.log("Unable to save post request: " + err);
        }

        cb(null, newTreePage);
      });
    } else {
      this.updateHtml(operation, cb);
    }
  });
};

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
    treePage.save(function(err, savedPage) {
      if (err) {
        console.log('Unable to save tree page: ' + err);
      }
      cb(err, savedPage);
    });
  });
};

exports.UrlStorageAdapter = UrlStorageAdapter;
