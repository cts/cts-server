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
  mongo: {
    host: 'localhost',
    port: 27017,
    database: 'ctsserver'
  },
  CacheAdapter: {
  },
  FilesystemAdapter: {
    rootDir: path.resolve(__dirname, '..', 'filestorage')
  },
  HtmlOperator: {
  }
};

util.deepExtend(exports, defaultOpts);

// Overwrite default options with local options
util.deepExtend(exports, localOpts);

