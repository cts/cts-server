/*
 * Demonstration of how to use 'zip_factory.js'
 *
 * You can run this with: `node zip_factory_example.js`. You need to be in a
 * directory where the filenames defined below are available.
 *
 */

var ZipFactoryAdapter = require('./zip-factory').ZipFactory;
var fs = require('fs');

filenames = [
  'zip-factory-example.js',
  'zip-factory.js'
]

ZipFactoryAdapter.zipFiles(filenames, function(err, data) {
  // The zipped version
  console.log(data);
  fs.writeFileSync('something.zip', data, 'binary');

  // Now unzip the data
  var zip = new require('node-zip')(data, {base64: false, checkCRC32: true});
  console.log(zip.files);
});
