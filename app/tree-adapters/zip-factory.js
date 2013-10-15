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
  async.parallel(self.readFileFunctions(filenames, fileData),
      function() {
        cb(null, fileData);
      });
};

ZipFactoryAdapter.prototype.readFileFunctions = function(filenames, fileData) {
  var filenamesArray = [];
  for (var filename in filenames) {
    filenamesArray.append(function(fileData) {
      fs.readFile(filename, function(err, data) {
        if (err) {
          console.log('Unable to find file "' + filename + '": ' + err);
        } else {
          fileData[filename] = data;
        }
      });
    });
  }

  return filenamesArray;
};

exports.ZipFactoryAdapter = ZipFactoryAdapter;
