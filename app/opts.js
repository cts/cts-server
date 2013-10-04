exports.host = "localhost";
exports.server = {
  port: 8888, 
  uid: "www-data",
  gid: "www-data"
};

/*
 * Now overwrite with any of the local settings
 */
var localOpts = require('./opts-local');

for (key in localOpts) {
  exports[key] = localOpts[key];
}
