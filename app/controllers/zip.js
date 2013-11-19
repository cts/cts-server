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
  var onlyDownload = req.body['onlyDownload'];
  self.zipFactory.zipTreeToFile(url, function(err, filepath) {
    if (err) {
      res.status(400).send(err);
    } else {
      if (onlyDownload) {
        _performDownload(filepath, res, uri.parse(url).host);
      } else {
        var filepathStub = _getFilepathStub(filepath, self.opts.concerns.zipFactory.zipBaseDir);
        if (filepathStub) {
          res.render("zip/save-result.ejs", {'filepath': filepathStub});
        } else {
          res.status(400).send('Bad filepath: ' + filepath);
        }
      }
    }
  });
};

ZipController.prototype.downloadZip = function(req, res) {
  var self = this;
  var filepathStub = req.params.key;
  var filepath = self.opts.concerns.zipFactory.zipBaseDir + "/" + filepathStub;
  _performDownload(filepath, res, filepathStub);
};

var _performDownload = function(filepath, res, name) {
  var data = fs.readFileSync(filepath);
  res.header('Content-Type', 'application/zip');
  res.header('Content-Disposition', 'attachment; filename="' + name + ".zip");
  res.send(data);
};

var _getFilepathStub = function(filepath, basedir) {
  // Note the +1's come from the extra "/" at the end of the basedir
  if (filepath.length < basedir.length + 1) {
    throw new Error('');
  }

  for (var i=0; i++; i<basedir.length + 1) {
    if (basedir[i] != filepath[i]) {
      throw new Error('');
    }
  }

  return filepath.slice(basedir.length + 1, filepath.length);
};

ZipController.prototype.displayZip = function(req, res) {
  console.log("displaying zip");
};

/* App integration
 * ----------------------------------------------------------------------------- 
 */

ZipController.prototype.connectToApp = function(app, prefix) {
  var self = this;
  app.post(prefix, self.fetch.bind(self));
  app.get(prefix + "/download/:key", self.downloadZip.bind(self));
  app.get(prefix + "/:key", self.displayZip.bind(self));
  app.options(prefix, self.fetchPreflight.bind(self));
};

exports.ZipController = ZipController;
