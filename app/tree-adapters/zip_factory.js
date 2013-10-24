var zip = require('node-zip');
var fs = require('fs');
var async = require('async');
var WebScraper = require('web-scraper');
var uuid = require('node-uuid');

var ZipFactoryAdapter = function(opts) {
  this.opts = opts || {};
};

/*
 * Take in a url, and we will scrape all of the assets from that url and 
 * store those assets, then present them to you in a zip file.
 */
ZipFactoryAdapter.prototype.zipTree = function(url, cb) {
  var scraperOpts = {
    url: url,
    basedir: '/tmp',
  };
  _createTempDirectory(function(err, directory) {
    scraperOpts['basedir'] = directory
    new WebScraper(scraperOpts).scrape(function(err) {
      if (err) {
        console.log("Scraper unable to find files from url: " + err);
      } else {
        _findFilesInDirectory(directory, function(err, filenames) {
          ZipFactoryAdapter.prototype.zipFiles(filenames, cb);
        });
      }
    });
  });
};

_createTempDirectory = function(cb, tries) {
  if (typeof tries == 'undefined') {
    tries = 0;
  }
  if (tries > 50) {
    return cb(new Error('Too many attempts made to create temporary directory'));
  }

  var scraperDirectory = '/tmp/zip-factory' + uuid.v4();
  fs.exists(scraperDirectory, function (exists) {
    if (exists) {
      _createTempDirectory(cb, tries+1);
    } else {
      cb(null, scraperDirectory);
    }
  });
};

_findFilesInDirectory = function(dir, cb) {
  var results cb;
  fs.readdir(dir, function(err, list) {
    if (err) return cb(err);
    var pending = list.length;
    if (!pending) return cb(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          _findFilesInDirectory(file, function(err, res) {
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

/*
 * Takes in +fileData+ which is an associative array of a filename and what you
 * would like the contents of the file to be. For example:
 *
 *  fileData = { 'filename1': 'the body of my file',
 *               'filename2': 'some more stuff' }
 *
 * Using +fileData+ from the above example, you would receive data which is the
 * zip of 'filename1' and 'filename2'.
 */
ZipFactoryAdapter.prototype.zipFileData = function(fileData, cb) {
  var zipDirectory = zip();
  for (var key in fileData) {
    if (fileData.hasOwnProperty(key)) {
      zipDirectory.file(key, fileData[key]);
    }
  }

  var data = zipDirectory.generate({base64:false,compression:'DEFLATE'});
  cb(null, data);
};


/*
 * Takes in an array of TreePage mongoose objects and returns data in
 * the callback which is a zip of those html pages.
 */
ZipFactoryAdapter.prototype.zipTreePages = function(treePages, cb) {
  var fileData = {};
  async.parallel(_readFileFunctions(filenames, fileData, _populateMongoFileData),
      function(err) {
        if (err) {
          console.log('Unable to read Tree Pages from MongoDB.');
        }
        ZipFactoryAdapter.prototype.zipFileData(fileData, function(err, data) {
          cb(err, data);
        });
      });
};

/*
 * Takes an array of filenames and zips up the files. Node must be able to access
 * the paths provided by the filenames. For example:
 *
 *  filenames = ['~/some_file.js', '~/another_file.js']
 *
 * This would create a zip folder with the contents of the these two files.
 *
 */
ZipFactoryAdapter.prototype.zipFiles = function(filenames, cb) {
  var fileData = {};
  async.parallel(_readFileFunctions(filenames, fileData, _populateFileSystemFileData),
      function(err) {
        if (err) {
          console.log('Unable to read files from file system.');
        }
        ZipFactoryAdapter.prototype.zipFileData(fileData, function(err, data) {
          cb(err, data);
        });
      });
};

_readFileFunctions = function(files, fileData, populateFunction) {
  var functionList = [];
  var file;
  for (var i=0; i<files.length; i++) {
    file = files[i];
    populateFunction(fileData, file, functionList);
  }

  return functionList;
};

_populateMongoFileData = function(fileData, treepage, functionList) {
  functionList.push(function(callback) {
    fileData[treepage.treeHtml] = treepage.treeHtml;
    callback(err, fileData);
  });
};

_populateFileSystemFileData = function(fileData, filename, functionList) {
    functionList.push(function(callback) {
      fs.readFile(filename, 'utf-8', function(err, data) {
        if (err) {
          console.log('Unable to find file "' + filename + '": ' + err);
        } else {
          fileData[filename] = data;
        }
        callback(err, fileData);
      });
    });
}

var zipFactory = new ZipFactoryAdapter();
exports.ZipFactoryAdapter = zipFactory;
