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

ZipController.prototype.fetchPreflight = function(req, res) {
  var self = this;
  console.log("Zip preflight");
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).send();
};

ZipController.prototype.fetch = function(req, res) {
  var self = this;
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  var url = req.body['url'];
  var zipFilename = uri.parse(url).host + ".zip";

  self.zipFactory.zipTreeToFile(url, function(err, filepath) {
    if (err) { 
      res.status(400).send(err);
    } else {
      var data = fs.readFileSync(filepath);
      res.header('Content-Type', 'application/zip');
      res.header('Content-Disposition', 'attachment; filename="' + zipFilename);
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
  app.options(prefix, self.fetchPreflight.bind(self));
};

exports.ZipController = ZipController;
