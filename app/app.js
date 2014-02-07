/*
 * cts-server
 * Persists client-side cts-ui operations.
 */
var path             = require('path');
var mongoose         = require('mongoose');
var passport         = require('passport');

var fs               = require('fs');
var opts             = require('./opts');
var util             = require('./util');

var secrets          = require('./config/secrets');
var passportConf     = require('./config/passport');

var hour             = 3600000;
var day              = (hour * 24);
var week             = (day * 7);
var month            = (day * 30);

console.log(util.Banner);
console.log("");

/*
 * Connect to database
 * -----------------------------------------------------------------------------
 */

mongoose.connect(secrets.mongo.url, secrets.mongo.options);
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});

/*
 * Controllers
 * -----------------------------------------------------------------------------
 */

var homeController = require('./controllers/home');
var userController = require('./controllers/user');

/*
 * Create application
 * -----------------------------------------------------------------------------
 */

var app = require('./config/app').createApp(passport, mongoose, __dirname);

/*
 * Application Routes
 * -----------------------------------------------------------------------------
 */

/* -- Public Facing Stuff -- */

app.get('/', homeController.index);

/* -- Account Stuff -- */

app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));

/* -- CTS Endpoints -- */

var TreeController = require('./controllers/tree').TreeController;
var treeController = new TreeController();
treeController.connectToApp(app, '/tree');

var ZipController = require('./controllers/zip').ZipController;
var zipController = new ZipController(opts);
zipController.connectToApp(app, '/zip');

var MockupController = require('./controllers/mockup').MockupController;
var mockupController = new MockupController();
mockupController.connectToApp(app, '/mockups');


/*
 * 3.. 2.. 1..
 * -----------------------------------------------------------------------------
 */

app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
  if (process.env.CTSSERVERPROD) {
    // In case we were launched by a daemon in prod, set proper UID and GID
    process.setgid(opts.server.gid);
    process.setuid(opts.server.uid);
  }
});

