var ZipFactoryAdapter = require('./zip_factory').ZipFactoryAdapter;

filenames = [
  'zip_factory_example.js',
  'url_storage.js',
  'zip_factory.js'
]

ZipFactoryAdapter.zipFiles(filenames, function(err, data) {
  // The zipped version
  console.log(data);

  // Now unzip the data
  var zip = new require('node-zip')(data, {base64: false, checkCRC32: true});
  console.log(zip.files);
});
