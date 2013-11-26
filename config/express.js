var express = require('express');
var pkg     = require('../package.json');
var fs      = require('fs');

module.exports = function(app, config, passport) {
  // JUST FOR DEBUG
  if (process.env.DEBUG) {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  }
  console.log('configuring express');

  // EJS. Cool, huh.
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views');
  app.set('view options', { layout:false, root: __dirname + '/templates' } );

  app.use(express.static(__dirname + '../static/'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'asldjfwiouworuoeruwioroiweru' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());
  app.use(app.router);
}
