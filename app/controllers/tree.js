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
var Operation = require('../models/operation').Operation;

/* Constructor
 * ----------------------------------------------------------------------------- 
 * This is the object exported by this file.
 */

var TreeController = function(opts) {
  this.opts = opts;
};

/* Public Endpoints
 * ----------------------------------------------------------------------------- 
 */


TreeController.prototype.save = function(req, res) {
  var html = req.body.html;
  var adapter = req.body.adapter;
  var operation = new Operation({
    'action': 'save',
    'treeUrl': adapter + ":",
    'treeType': 'html',
    'args': [html]
  });

  this._performOperations([operation], function(err, operations) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.render("tree/save-result.ejs", {'operation': operations[0]});
    }
  });
};


TreeController.prototype.fetch = function(req, res) {
  var operation = new Operation({
    'action': 'fetch',
    'treeType': 'html',
    'treeUrl': req.params.key
  });
  this._performOperations([operation], function(err, operations) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(operations[0].result.tree);
    }
  });
};


/* "Private" Methods
 * ----------------------------------------------------------------------------- 
 */

/* Performs one or more operations.
 *
 * Args:
 *  operation - An array of operation model objects
 *  callback  - A node-style callback. On success, the operation will be returned.
 *
 */
TreeController.prototype._performOperations = function(operations, callback) {
  var error = null, results = [];
  var processThenFinish = function(i) {
    if (error != null) {
      // Bail on the first error.
      callback(error, results);
    } else if (i >= operations.length) {
      // Finish up. We succeeded!
      callback(null, results);
    } else {
      // Attempt Operation i
      var adapter = AdapterFactory.adapterForOperation(operations[i]);
      var operator = OperatorFactory.operatorForOperation(operations[i]);
      operator.perform(operations[i], adapter, function(err, res) {
        if (err) {
          error = err;
        } else {
          results.push(res);
        }
        // Continue on to Operation i+1 (or a termination condition).
        processThenFinish(i+1);
      });
    } 
  };
  // Kick off the process.
  processThenFinish(0);
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
