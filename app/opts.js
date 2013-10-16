var path = require('path');
var util = require('./util');
var localOpts = require('./opts-local');

var defaultOpts = {
  host: 'localhost',
  server: {
    port: 8888,
    uid: 'www-data',
    gid: 'www-data'
  },
  CacheAdapter: {
  },
  FilesystemAdapter: {
    rootDir: path.resolve(__dirname, '..', 'filestorage')
  }
};

util.deepExtend(exports, defaultOpts);

// Overwrite default options with local options
util.deepExtend(exports, localOpts);

