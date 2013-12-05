/*
 * Zip Controller
 *
 * Returns a zip file of the html and the assets for a particular url.
 */

var ZipFactory = require('../concerns/zip-factory').ZipFactory;
var FilenameUtil = require('../concerns/filename-util').FilenameUtil;
var WebsiteOwnership = require('../models/website-ownership').WebsiteOwnership;
var fs = require('fs');
var uri = require('uri-js');
var Util = require('../util');

/* Constructor
 * ----------------------------------------------------------------------------- 
 * This is the object exported by this file.
 */

var ZipController = function(opts) {
  this.opts = opts;
  this.prefix = '';
  this.zipFactory = new ZipFactory(opts);
};

/* Public Endpoints
 * ----------------------------------------------------------------------------- 
 */


ZipController.prototype.fetch = function(req, res) {
  var self = this;
  Util.addCORSHeaders(req, res);

  var url = req.body['url'];
  var onlyDownload = req.body['onlyDownload'];
  self.zipFactory.zipTreeToFile(url, function(err, filepath) {
    if (err) {
      res.status(400).send(err);
    } else {
      if (onlyDownload) {
        _performDownload(filepath, res, uri.parse(url).host);
      } else {
        var filepathStub = FilenameUtil.filepathStub(filepath, self.opts.concerns.zipFactory.zipBaseDir);
        if (filepathStub) {
          res.render("zip/save-result.ejs", {'filepath': filepathStub});
          var ownership = new WebsiteOwnership({
            websiteId: filepathStub,
            ownerId: getUserId()
          }).save(function(err) {
            if (err) {
              res.status(400).send('Unable to save filepath due to user ownership');
            }
          });
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

  if (hasWebsiteOwnership(getUserId(), filepathStub)) {
    _performDownload(filepath, res, filepathStub);
  } else {
    res.status(401).send("You don't have permission to access this")
  }
};

ZipController.prototype.displayZip = function(req, res) {
  var self = this;
  Util.addCORSHeaders(req, res);

  var urlPath = req.params.key;

  if (hasWebsiteOwnership(getUserId(), urlPath)) {
    if (typeof req.params[0] !== 'undefined') {
      urlPath += req.params[0];
    }
    var filepath = self.opts.concerns.zipFactory.tempBaseName + "/" + urlPath;
    console.log("Attempting to display resource for: " + filepath);
    fs.exists(filepath, function(exists) {
      if (exists) {
        fs.stat(filepath, function(err, stats) {
          if (stats.isDirectory()) {
            res.redirect("zip/" + urlPath + "/index.html");
          } else {
            fs.readFile(filepath, function(err, data){
              if (err) {
                res.status(400).send(err);
              } else {
                var contentType = FilenameUtil.contentType(filepath);
                res.header('Content-Type', contentType);
                res.send(data);
              }
            });
          }
        });
      } else {
        res.status(400).send('Website id "' + req.params.key + '" does not exist');
      }
    });
  } else {
    res.status(401).send("You don't have permission to access that");
  }
};

/*
 * Private methods
 * ----------------------------------------------------------------------------- 
 */
ZipController.prototype._redirectToIndex = function(url, res) {
  var self = this;
  var redirectUrl = self.prefix + "/" + urlPath + "/index.html";
  console.log('redirecting to: ' + redirectUrl);
  res.redirect(redirectUrl);
};

var _performDownload = function(filepath, res, name) {
  var data = fs.readFileSync(filepath);
  res.header('Content-Type', 'application/zip');
  res.header('Content-Disposition', 'attachment; filename="' + name + ".zip");
  res.send(data);
};

var getUserId = function() {
  // TODO: implement this
  return 1;
};

var hasWebsiteOwnership = function(userId, websiteId) {
  WebsiteOwnership.findOne({'websiteId': filepathStub}, function(err, ownership) {
    return (!(err || !ownership || ownership.userId != userId));
  });
};

/* App integration
 * ----------------------------------------------------------------------------- 
 */

ZipController.prototype.connectToApp = function(app, prefix) {
  var self = this;
  self.prefix = prefix;
  app.post(prefix, self.fetch.bind(self));
  app.options(prefix, Util.preflightHandler);
  app.get(prefix + "/download/:key", self.downloadZip.bind(self));
  app.get(prefix + "/:key*", self.displayZip.bind(self));
};

exports.ZipController = ZipController;
