/*
 * cts-server
 * Persists client-side cts-ui operations.
 */

var express       = require('express');
var passport      = require('passport');
var fs            = require('fs');
var flash         = require('connect-flash');
var path          = require('path');
var opts          = require('./opts');

/*
 * Connect to database
 * -----------------------------------------------------------------------------
 */

//var mongoose = require('mongoose');
//var db            = require('./db');
//mongoose.connect('mongodb://' + Opts.db.host + ':' + Opts.db.port + '/' + Opts.db.database);

/*
 * Create application
 * -----------------------------------------------------------------------------
 */

var app = express();

app.configure(function() {
  // JUST FOR DEBUG
  if (process.env.DEBUG) {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  }
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({secret: 'asldjfwiouworuoeruwioroiweru'}));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.normalize(path.join(__dirname, '..', 'client'))));
});

/*
 * Register controllers
 * -----------------------------------------------------------------------------
 *
 * TODO:
 *  - Integrate user logins and session management.
 *    Acct creation via web, all else via API via CTS-UI.
 */

//var LocalStrategy  = require('passport-local').Strategy;
//var UserController = require('./controllers/user').UserController;
//var userController = new UserController({}, passport);
//userController.connectToApp(app, '/user');
//
//var SessionController = require('./controllers/session').SessionController;
//var sessionController = new SessionController({}, passport);
//sessionController.connectToApp(app, '/session');

var TreeController = require('./controllers/tree').TreeController;
var treeController = new TreeController();
treeController.connectToApp(app, '/tree');

/*
 * 3.. 2.. 1..
 * -----------------------------------------------------------------------------
 */

app.listen(opts.server.port, function() {
  if (process.env.CTSSERVERPROD) {
    // In case we were launched by a daemon in prod, set proper UID and GID
    process.setgid(opts.server.gid);
    process.setuid(opts.server.uid);
  }
});

