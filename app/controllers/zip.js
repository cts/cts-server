/*
 * Zip Controller
 *
 * Returns a zip file of the html and the assets for a particular url.
 */

var ZipFactory = require('../concerns/zip-factory').ZipFactory;

/* Constructor
 * ----------------------------------------------------------------------------- 
 * This is the object exported by this file.
 */

var ZipController = function(opts) {
  this.opts = opts;
};

/* Public Endpoints
 * ----------------------------------------------------------------------------- 
 */


ZipController.prototype.fetch = function(req, res) {
  var url = req.body['url'];
  ZipFactory.zipTree(url, function(err, data) {
    if (err) {
      res.status(400).send(err);
    } else {
      console.log("sending zip data");
      res.header('Content-Type', 'application/zip');
      res.header('Content-Disposition', 'attachment; filename="site.zip"');
      res.send(data);
    }
  });
};

/* App integration
 * ----------------------------------------------------------------------------- 
 */

ZipController.prototype.connectToApp = function(app, prefix) {
  var self = this;
  app.post(prefix, self.fetch.bind(self));
};

exports.ZipController = ZipController;
