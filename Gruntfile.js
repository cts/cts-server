module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.registerTask('seed','Put users in the db', function(){
    var mongoose  = require('mongoose');
    var opts      = require('./app/opts');
    var userModel = require('./app/models/user');
    var bcrypt    = require('bcrypt');
    var done      = this.async();
    var async     = require('async');

    users = [
      {
        email    : "default@test.com",
        password : "password"
      },
      {
        email    : "hello@world.com",
        password : "password"
      }
    ]

    var filter = function(user, done){
      var u = new userModel.User(user);
      u.save(function(err){
        if(err){
          done(err);
        }else{
          console.log("New user inserted");
          done();
        }
      });
    };

    mongoose.connect('mongodb://'+ opts.mongo.host + ":" + opts.mongo.port + '/' + opts.mongo.database);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
      console.log("successfully connected");
      async.each(users, filter, function(err){
        if (err){
          console.log('Error: '+err);
        }
        mongoose.connection.close(done);
      });
    });
  });
}
