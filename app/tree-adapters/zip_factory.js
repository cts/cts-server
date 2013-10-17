var zip = require('node-zip');
var fs = require('fs');
var async = require('async');

var ZipFactoryAdapter = function(opts) {
  this.opts = opts || {};
};

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

ZipFactoryAdapter.prototype.zipFiles = function(filenames, cb) {
  var fileData = {};
  async.parallel(ZipFactoryAdapter.prototype.readFileFunctions(filenames, fileData),
      function(err) {
        if (err) {
          console.log('Unable to read files from file system.');
        }
        ZipFactoryAdapter.prototype.zipFileData(fileData, function(err, data) {
          cb(err, data);
        });
      });
};

ZipFactoryAdapter.prototype.readFileFunctions = function(filenames, fileData) {
  var readFileFunctions = [];
  var filename;
  for (var i=0; i<filenames.length; i++) {
    filename = filenames[i];
    populateFileData(fileData, filename, readFileFunctions);
  }

  return readFileFunctions;
};

populateFileData = function(fileData, filename, readFileFunctions) {
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
