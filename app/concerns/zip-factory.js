var zip = require('node-zip');
var fs = require('fs');
var async = require('async');
var WebScraper = require('web-scraper');
var FilenameUtil = require('./filename-util').FilenameUtil;

var ZipFactory = function(opts) {
  this.opts = opts || {};
};

/* Methods
 *-----------------------------------------------------------------------------
 */

/*
 * Takes in a url, scrapes the assets and the html from that url, and zips
 * everything. The javascript and css files are included in the zip file along
 * with the html.
 *
 * The callback will receive the resulting zip data as a string one processing
 * has been completed.
 *
 */
ZipFactory.prototype.zipTree = function(scraperOpts, cb) {
  var self = this;
  if (scraperOpts.hasOwnProperty('basedir')) {
    self._performScrape(scraperOpts, cb);
  } else {
    var tempStorageDirectory = self.opts.concerns.zipFactory.tempBaseName + "/";
    FilenameUtil.unusedPath(tempStorageDirectory, function(err, directory) {
      scraperOpts['basedir'] = directory;
      self._performScrape(scraperOpts, cb);
    });
  }
};

ZipFactory.prototype.zipTreeToFile = function(url, cb) {
  var self = this;
  var tempBasename = self.opts.concerns.zipFactory.tempBaseName + "/";
  FilenameUtil.unusedPath(tempBasename, function(err, filepath, uuidAppendage) {
    if (err) {
      cb(err);
    } else {
      self.zipTree({'url': url, 'basedir': filepath}, function(err, data) {
        if (err) {
          cb(err);
        } else {
          var zipFilepath = self.opts.concerns.zipFactory.zipBaseDir + "/" + uuidAppendage;
          fs.writeFile(zipFilepath, data, 'binary', function(err) {
            console.log("wrote to zip file: " + zipFilepath);
            cb(err, zipFilepath);
          });
        }
      });
    }
  });
};

/*
 * Takes in +fileData+ which is an associative array of a filename and what you
 * would like the contents of the file to be. For example:
 *
 *  fileData = { 'filename1': 'the body of my file',
 *               'filename2': 'some more stuff' }
 *
 * Using +fileData+ from the above example, your callback would receive a result
 * which is a string of data representing the zipped form of 'filename1' and
 * 'filename2'.
 */
ZipFactory.prototype.zipFileData = function(fileData, cb) {
  var zipDirectory = zip();
  for (var key in fileData) {
    if (fileData.hasOwnProperty(key)) {
      zipDirectory.file(key, fileData[key]);
    }
  }

  var data = zipDirectory.generate({type:'string'});
  cb(null, data);
};


/*
 * Takes in an array of TreePage mongoose objects. The callback function will
 * receive a result which is a string of data representing the zipped TreePage
 * objects.
 *
 * This method will use the content and url from the TreePage to create a zip
 * file. Files in the zip data will correspond to different TreePages. Filenames
 * will be determined by the TreePage's url.
 *
 */
ZipFactory.prototype.zipTreePages = function(treePages, cb) {
  var self = this;
  var fileData = {};
  async.parallel(self._readFileFunctions(filenames, fileData, self._populateMongoFileData),
    function(err) {
      if (err) {
        console.log('Unable to read Tree Pages from MongoDB.');
        cb(err);
      } else {
        self.zipFileData(fileData, function(err, data) {
          cb(err, data);
        });
      }
    });
};

/*
 * Takes an array of filenames and zips up the files. Node must be able to access
 * the paths provided by the filenames. For example:
 *
 *  filenames = ['~/some_file.js', '~/another_file.js']
 *
 * This would create a zip folder with the contents of the these two files. The
 * zip data is returned to the callback.
 *
 */
ZipFactory.prototype.zipFiles = function(filenames, cb) {
  var self = this;
  var fileData = {};
  async.parallel(self._readFileFunctions(filenames, fileData, self._populateFileSystemFileData),
    function(err) {
      if (err) {
        console.log('Unable to read files from file system.');
        cb(err);
      } else {
        self.zipFileData(fileData, function(err, data) {
          cb(err, data);
        });
      }
    });
};


/* Private methods
 *-----------------------------------------------------------------------------
 */
ZipFactory.prototype._readFileFunctions = function(files, fileData, populateFunction) {
  var self = this;
  var functionList = [];
  var file;
  for (var i=0; i<files.length; i++) {
    file = files[i];
    populateFunction(fileData, file, functionList, { basedir: self.opts.concerns.zipFactory.tempBaseName });
  }

  return functionList;
};

ZipFactory.prototype._populateMongoFileData = function(fileData, treepage, functionList) {
  functionList.push(function(callback) {
    fileData[treepage.url] = treepage.content;
    callback(null, fileData);
  });
};

ZipFactory.prototype._populateFileSystemFileData = function(fileData, filename, functionList, opts) {
  var self = this;
  functionList.push(function(callback) {
    fs.readFile(filename, 'utf-8', function(err, data) {
      if (err) {
        console.log('Unable to find file "' + filename + '": ' + err);
      } else {
        if (typeof opts === 'undefined') {
          fileData[filename] = data;
        } else {
          FilenameUtil.filepathStub(filename, opts.basedir, function(err, stub) {
            if (err) {
              fileData[filename] = data;
            } else {
              fileData[stub] = data;
            }
          });
        }
      }
      callback(err, fileData);
    });
  });
}

ZipFactory.prototype._performScrape = function(scraperOpts, cb) {
  var self = this;
  new WebScraper(scraperOpts).scrape(function(err) {
    if (err) {
      console.log("Scraper unable to find files from url: " + err);
      cb(err);
    } else {
      self._findFilesInDirectory(scraperOpts['basedir'], function(err, filenames) {
        self.zipFiles(filenames, cb);
      });
    }
  });
}


/**
 * Recursively finds all of the files in a particular directory. Returns the
 * results as a list.
 *
 */
ZipFactory.prototype._findFilesInDirectory = function(dir, cb) {
  var self = this;
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return cb(err);
    var pending = list.length;
    if (!pending) return cb(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          self._findFilesInDirectory(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) cb(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) cb(null, results);
        }
      });
    });
  });
};

exports.ZipFactory = ZipFactory;
