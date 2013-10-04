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
TreeController.prototype.save = function(req, res) {
  var adapter = AdapterFactory.adapterForRequest(req);
  adapter.save(html, function(err, key) {
    if (err) {
      res.status(400).send("Could save data. " + err);
    } else {
      res.send(key);
    }
  });
};

TreeController.prototype.foo = function(req, res) {
  res.send("H");
}
/**
 *
 */
TreeController.prototype.fetch = function(req, res) {
  var key = req.params.key;
  var adapter = AdapterFactory.adapterForRequest(req);
  adapter.fetch(key, function(err, result) {
    if (err) {
      res.status(400).send("Could not lookup key <" + key + ">: " + err);
    }
    else if (result == null) {
      res.status(404).send("No data for key <" + key + ">: " + err);
    } else {
      res.send(result);
    }
  });
};


/* App integration
 * ----------------------------------------------------------------------------- 
 */

TreeController.prototype.connectToApp = function(app, prefix) {
  var self = this;
  app.post(prefix, self.save.bind(self));
  app.get(prefix + '/foo', self.foo.bind(self));
  app.get(prefix + '/:key', self.fetch.bind(self));
};

exports.TreeController = TreeController;
