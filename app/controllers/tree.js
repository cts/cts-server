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
 *   3) Ask the tree adapter to perform teh requested operation
 */

var AdapterFactory = require('../tree-adapters/adapter-factory').AdapterFactory;

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

/**
 *
 */
TreeController.prototype.saveHtml = function(req, next) {
  var adapter = AdapterFactory.adapterForRequest(req);
  adapter.save(html);
};

/**
 *
 */
TreeController.prototype.getHtml= function(req, next) {
  var adapter = AdapterFactory.adapterForRequest(req);
  adapter.fetch(html);
};


/* App integration
 * ----------------------------------------------------------------------------- 
 */

TreeController.prototype.connectToApp = function(app, prefix) {
  var self = this;
  app.post(prefix + '/saveHTML', self.saveHtml.bind(self));
  app.get(prefix + '/getHTML', self.getHtml.bind(self));
};

exports.TreeController = TreeController;
