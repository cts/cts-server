var User = require('../app/models/user');
var Auth = require('./middlewares/authorization.js');

module.exports = function(app, passport){
  app.get('/', function(req, res){
    if (req.isAuthenticated()){
      console.log("IS AUTHENTICATED");
      res.render("landing", {user: req.user});
    }else{
      console.log("IS NOT");
      res.render("landing");
    }
  });

  app.get("/login", function(req, res){
    console.log("get");
    res.render("login");
  });

  app.post("/login", function(req, res, next) {
    console.log('calling authentication');
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        console.log("error "+ err);
        return next(err);
      }
      if (!user) {
        console.log("no such user");
        return res.redirect('/login');
      }
      req.logIn(user, function(err) {
        if (err) {
          console.log("error "+ err);
          return next(err);
        }
        console.log('It worked');
        return res.redirect('/home');
      });
    })(req, res, next);
  });

  app.get("/signup", function (req, res) {
    res.render("signup");
  });

  app.get("/home", function (req, res) {
    res.render("home");
  });

  app.post("/signup", Auth.userExist, function (req, res, next) {
    User.signup(req.body.email, req.body.password, function(err, user){
      if(err) throw err;
      req.login(user, function(err){
        if(err) return next(err);
        return res.redirect("/home");
      });
    });
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

};
