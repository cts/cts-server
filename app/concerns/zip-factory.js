var zip = require('node-zip');
var fs = require('fs');
var async = require('async');
var WebScraper = require('web-scraper');
var uuid = require('node-uuid');

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
ZipFactory.prototype.zipTree = function(url, cb) {
  var scraperOpts = {
    url: url,
    basedir: '/tmp',
  };
  console.log("Beginning scrape: " + url);
  _createTempDirectory(function(err, directory) {
    console.log("Base directory: " + directory);
    scraperOpts['basedir'] = directory
    console.log(scraperOpts);
    new WebScraper(scraperOpts).scrape(function(err) {
      if (err) {
        console.log("Scraper unable to find files from url: " + err);
      } else {
        _findFilesInDirectory(directory, function(err, filenames) {
          ZipFactory.prototype.zipFiles(filenames, cb);
        });
      }
    });
  });
};

ZipFactory.prototype.zipTreeToFile = function(url, cb) {
  var filepath = _generateZipFileName('/home/john', url);
  ZipFactory.prototype.zipTree(url, function(err, data) {
    fs.writeFile(filepath, data, 'binary', function(err) {
      console.log("wrote to zip file");
      cb(err, filepath);
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
  var fileData = {};
  async.parallel(_readFileFunctions(filenames, fileData, _populateMongoFileData),
    function(err) {
      if (err) {
        console.log('Unable to read Tree Pages from MongoDB.');
      }
      ZipFactory.prototype.zipFileData(fileData, function(err, data) {
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
 * This would create a zip folder with the contents of the these two files. The
 * zip data is returned to the callback.
 *
 */
ZipFactory.prototype.zipFiles = function(filenames, cb) {
  var fileData = {};
  async.parallel(_readFileFunctions(filenames, fileData, _populateFileSystemFileData),
    function(err) {
      if (err) {
        console.log('Unable to read files from file system.');
      }
      ZipFactory.prototype.zipFileData(fileData, function(err, data) {
        cb(err, data);
      });
    });
};


/* Private methods
 *-----------------------------------------------------------------------------
 */

_generateZipFileName = function(basedir, url, tries) {
  if (typeof tries == 'undefined') {
    tries = 0;
  }
  if (tries > 50) {
    return cb(new Error('Too many attempts made to create temporary directory'));
  }

  var potentialName = basedir + "/" + url + uuid.v4();
  fs.exists(potentialName), function(exists) {
    if (exists) {
      return potentialName;
    } else {
      _generateZipFileName(basedir, url, tries+1);
    }
  }
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
    fileData[treepage.url] = treepage.content;
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

/**
 * Creates a directory in the `/tmp` folder. Returns the directory name as a string.
 */
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


/**
 * Recursively finds all of the files in a particular directory. Returns the
 * results as a list.
 *
 */
_findFilesInDirectory = function(dir, cb) {
  var results = [];
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

var zipFactory = new ZipFactory();
exports.ZipFactory = zipFactory;
