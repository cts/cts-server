/*
 * Zip Controller
 *
 * Returns a zip file of the html and the assets for a particular url.
 */

var ZipFactory = require('../concerns/zip-factory').ZipFactory;
var fs = require('fs');
var uri = require('uri-js');
var Util = require('../util');

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
  Util.addCORSHeaders(req, res);

  var url = req.body['url'];
  self.zipFactory.zipTreeToFile(url, function(err, filepath) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.render("zip/save-result.ejs", {'filepath': filepath});
    }
  });
};

ZipController.prototype.downloadZip = function(req, res) {
  var filepath = req.params.key;
  var data = fs.readFileSync(filepath);
  res.header('Content-Type', 'application/zip');
  res.header('Content-Disposition', 'attachment; filename="' + filepath);
  res.send(data);
};

ZipController.prototype.displayZip = function(req, res) {

};

/* App integration
 * ----------------------------------------------------------------------------- 
 */

ZipController.prototype.connectToApp = function(app, prefix) {
  var self = this;
  app.post(prefix, self.fetch.bind(self));
  app.options(prefix, Util.preflightHandler);
  app.get(prefix + "download/:key", self.downloadZip.bind(self));
  app.get(prefix + "/:key", self.downloadZip.bind(self));
  app.options(prefix, self.fetchPreflight.bind(self));
};

exports.ZipController = ZipController;
