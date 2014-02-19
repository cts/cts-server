var mongoose      = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User          = mongoose.model('User');

module.exports = function (passport, config) {
  // Token Login
  //if (this.opts.allowTokens) {
  //  this.passport.use(new BearerStrategy(
  //    function(token, done) {
  //      User.findOne({ oauthToken: token}, function(err, user) {
  //        if (err)   { return done(err); }
  //        if (!user) { return done(null, false); }
  //        return done(null, user, { scope: 'read' });
  //      });
  //    }
  //  ));
  //}

  console.log('setting serialize');
  passport.serializeUser(function(user, done) {
    console.log("serializeUser", user);
    done(null, user.id);
  });

  console.log('setting deserialize');
  passport.deserializeUser(function(id, done) {
    console.log("DE-serializeUser");
    User.findOne({_id: id}, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy({
      usernameField: "email",
      passwordField: "password"
    },
    function(email, password, done){
      User.isValidUserPassword(email, password, done);
    })
  );
};
