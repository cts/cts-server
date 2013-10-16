/*
 * Tree Controller
 * Persists remote CTS-UI operations via an adapter.
 *   See: ../tree-adapters
 *
 * General brainstorming:
 *
 *  Each web request specifies:
 *   1) Who you are
 *   2) What tree you are operating upon
 *   3) What operation you want to do
 *
 *  The processing for each request proceeds in the same fashion:
 *   1) Authenticate user
 *   2) Load the tree they are requesting via the proper tree adapter
 *   3) Load the operator for handling this TYPE of tree.
 *   4) Ask the operator to perform the operation
 *   5) Save the tree via the tree adapter
 */

var AdapterFactory = require('../tree-adapters/adapter-factory').AdapterFactory;
var OperatorFactory = require('../tree-operators/operator-factory').OperatorFactory;
var OperationFactory = require('../model/operation').OperationFactory;

/* Constructor
 * ----------------------------------------------------------------------------- 
 * This is the object exported by this file.
 */

var TreeController = function(opts) {
  this.opts = opts;
};

/* Methods 
 * ----------------------------------------------------------------------------- 
 */


/*
 * This will eventually be the only endpoint. (though we will support pooling of
 * multiple operations in the same request.
 */
TreeController.prototype.performOperation = function(operation, callback) {
  var adapter = AdapterFactory.adapterForOperation(operation);
  var operator = OperatorFactory.operatorForOperation(operation);
  operator.perform(operation, adapter, cb);
};

/**
 *
 */
TreeController.prototype.save = function(req, res) {
  var operation = OperationFactory.saveOperation(req);
  this.performOperation(operation, function(err, operation) {
    if (err) {
      res.status(400).send(operation.error.message);
    } else {
      var key = operation.result.url;
      var html = "<html><body>" +
      "<a href='/tree/" + key + "'>" + key + "</a>" +
      "</body></html>";
      res.send(html);
    }
  });
};

/**
 *
 */
TreeController.prototype.fetch = function(req, res) {
  var operation = OperationFactory.fetchOperation(req);
  this.performOperation(operation, function(err, operation) {
    if (err) {
      res.status(400).send(operation.error.message);
    } else {
      res.send(operation.result.body);
    }
  });
};


/* App integration
 * ----------------------------------------------------------------------------- 
 */

TreeController.prototype.connectToApp = function(app, prefix) {
  var self = this;
  app.post(prefix, self.save.bind(self));
  app.get(prefix + '/:key', self.fetch.bind(self));
};

exports.TreeController = TreeController;
