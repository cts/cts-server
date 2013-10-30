/*
 * cts-server
 * Persists client-side cts-ui operations.
 */

var express       = require('express');
var passport      = require('passport');
var fs            = require('fs');
//var flash         = require('connect-flash');
var path          = require('path');
var opts          = require('./opts');
var util          = require('./util');



/*
 * Connect to database
 * -----------------------------------------------------------------------------
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://' + opts.mongo.host + ':' + opts.mongo.port + '/' + opts.mongo.database);

/*
 * Create application
 * -----------------------------------------------------------------------------
 */

var app = express();
var static_dir = path.normalize(path.join(__dirname, '..', 'static'));

var opt_str = JSON.stringify(opts, null, 2)
    .replace(/\n/g, '\n              ');

console.log(util.Banner);
console.log("Static dir  : " + static_dir);
console.log("Options     : " + opt_str);
console.log("");

app.configure(function() {
  // JUST FOR DEBUG
  if (process.env.DEBUG) {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  }

  // EJS. Cool, huh.
  app.set('view engine', 'ejs');
  app.set('views',__dirname + '/views');
  app.set('view options', { layout:false, root: __dirname + '/templates' } );

  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({secret: 'asldjfwiouworuoeruwioroiweru'}));
  //app.use(passport.initialize());
  //app.use(passport.session());
  app.use(app.router);
  app.use(express.static(static_dir));
});

/*
 * Register controllers
 * -----------------------------------------------------------------------------
 *
 * TODO:
 *  - Integrate user logins and session management.
 *    Acct creation via web, all else via API via CTS-UI.
 */

var LocalStrategy  = require('passport-local').Strategy;

var UserController = require('./controllers/user').UserController;
var userController = new UserController({}, passport);
userController.connectToApp(app, '/user');

var SessionController = require('./controllers/session').SessionController;
var sessionController = new SessionController({}, passport);
// sessionController.connectToApp(app, '/session');

var TreeController = require('./controllers/tree').TreeController;
var treeController = new TreeController();
treeController.connectToApp(app, '/tree');

var ZipController = require('./controllers/zip').ZipController;
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

