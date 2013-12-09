var express = require('express');
var pkg     = require('../package.json');
var fs      = require('fs');
var engine  = require('ejs-locals');

module.exports = function(app, config, passport) {
  // JUST FOR DEBUG
  // if (process.env.DEBUG) {
  //   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  // }
  app.use(express.logger());
  console.log('configuring express');


  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'asldjfwiouworuoeruwioroiweru' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/../static/'));
  // app.use(express.methodOverride());
  app.use(app.router);

  // EJS. Cool, huh.
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/../app/views');
  // app.set('view options', { layout:false, root: __dirname + '/templates' } );

  // use ejs-locals for all ejs templates:
  app.engine('ejs', engine);
}
