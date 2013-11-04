/*
 * Zip Controller
 *
 * Returns a zip file of the html and the assets for a particular url.
 */

var ZipFactory = require('../concerns/zip-factory').ZipFactory;
var fs = require('fs');
var uri = require('uri-js');

/* Constructor
 * ----------------------------------------------------------------------------- 
 * This is the object exported by this file.
 */

var ZipController = function(opts) {
  this.opts = opts;
  this.zipFactory = new ZipFactory(opts);
};

/* Public Endpoints
 * ----------------------------------------------------------------------------- 
 */


ZipController.prototype.fetch = function(req, res) {
  var self = this;
  var url = req.body['url'];
  var zipFilename = uri.parse(url).host + ".zip";

  self.zipFactory.zipTreeToFile(url, function(err, filepath) {
    var data = fs.readFileSync(filepath);
    res.header('Content-Type', 'application/zip');
    res.header('Content-Disposition', 'attachment; filename="' + zipFilename);
    res.send(data);
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
