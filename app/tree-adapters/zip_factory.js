var zip = require('node-zip');
var fs = require('fs');
var async = require('async');

var ZipFactoryAdapter = function(opts) {
  this.opts = opts || {};
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
  async.parallel(readFileFunctions(filenames, fileData, populateMongoFileData),
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
  async.parallel(readFileFunctions(filenames, fileData, populateFileSystemFileData),
      function(err) {
        if (err) {
          console.log('Unable to read files from file system.');
        }
        ZipFactoryAdapter.prototype.zipFileData(fileData, function(err, data) {
          cb(err, data);
        });
      });
};

readFileFunctions = function(files, fileData, populateFunction) {
  var readFileFunctions = [];
  var file;
  for (var i=0; i<files.length; i++) {
    file = files[i];
    populateFunction(fileData, file, readFileFunctions);
  }

  return readFileFunctions;
};

populateMongoFileData = function(fileData, treepage, readFileFunctions) {
  readFileFunctions.push(function(callback) {
    fileData[treepage.treeHtml] = treepage.treeHtml;
    callback(err, fileData);
  });
};

populateFileSystemFileData = function(fileData, filename, readFileFunctions) {
    readFileFunctions.push(function(callback) {
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
