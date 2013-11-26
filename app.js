/*
 * cts-server
 * Persists client-side cts-ui operations.
 */

var express       = require('express');
var MongoStore    = require('connect-mongo')(express);
var passport      = require('passport');
var fs            = require('fs');
//var flash       = require('connect-flash');
var env           = process.env.NODE_ENV || 'development';
var path          = require('path');
var opts          = require('./config/opts');
var util          = require('./config/util');
var mongoose      = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User          = require('./app/models/user');

/*
 * Connect to database
 * -----------------------------------------------------------------------------
 */
mongoose.connect('mongodb://' + opts.mongo.host + ':' + opts.mongo.port + '/' + opts.mongo.database);

/*
 * Initialize passport
 * -----------------------------------------------------------------------------
 */
require('./config/passport')(passport, opts);

/*
 * Create application
 * -----------------------------------------------------------------------------
 */
var app = express();
var opt_str = JSON.stringify(opts, null, 2).replace(/\n/g, '\n              ');

console.log(util.Banner);
console.log("Options     : " + opt_str);
console.log("");

/*
 * Set express settings
 * -----------------------------------------------------------------------------
 */
require('./config/express')(app, opts, passport);

/*
 * Register controllers
 * -----------------------------------------------------------------------------
 *
 * TODO:
 *  - Integrate user logins and session management.
 *    Acct creation via web, all else via API via CTS-UI.
 */

var UserController = require('./app/controllers/user').UserController;
var userController = new UserController({}, passport);
userController.connectToApp(app, '/user');

var TreeController = require('./app/controllers/tree').TreeController;
var treeController = new TreeController();
treeController.connectToApp(app, '/tree');

var ZipController = require('./app/controllers/zip').ZipController;
var zipController = new ZipController();
zipController.connectToApp(app, '/zip');

/*
 * 3.. 2.. 1..
 * -----------------------------------------------------------------------------
 */

app.listen(opts.server.port, function() {
  console.log("Listening on port " + opts.server.port + "...");
  if (process.env.CTSSERVERPROD) {
    // In case we were launched by a daemon in prod, set proper UID and GID
    process.setgid(opts.server.gid);
    process.setuid(opts.server.uid);
  }
});

