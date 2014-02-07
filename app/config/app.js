var path             = require('path');
var express          = require('express');
var secrets          = require('./secrets');
var flash            = require('express-flash');
var MongoStore       = require('connect-mongo')(express);
var expressValidator = require('express-validator');

var hour             = 3600000;
var day              = (hour * 24);
var week             = (day * 7);
var month            = (day * 30);

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

var createApp = function(passport, mongoose, dirname) {
  var app = express();
  if (process.env.DEBUG) {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  }
  
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(require('connect-assets')({
    src: 'public',
    helperContext: app.locals
  }));
  
  app.use(express.compress());
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.json());
  app.use(allowCrossDomain);
  app.use(express.urlencoded());
  app.use(expressValidator());
  app.use(express.methodOverride());
  app.use(express.session({
    secret: secrets.sessionSecret,
    store: new MongoStore({
      db: mongoose.connection.db,
      auto_reconnect: true
    })
  }));
  app.use(express.csrf());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function(req, res, next) {
    res.locals.user = req.user;
    res.locals.token = req.csrfToken();
    next();
  });
  app.use(flash());
  app.use(app.router);
  app.use(express.static(path.join(dirname, 'public'), { maxAge: week }));
  app.use(function(req, res) {
    res.status(404);
    res.render('404');
  });
  app.use(express.errorHandler());
  return app;
}

exports.createApp = createApp;
