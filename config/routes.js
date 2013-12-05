var User = require('../app/models/user');
var Auth = require('./middlewares/authorization.js');

module.exports = function(app, passport){
  app.get('/', function(req, res){
    if (req.isAuthenticated()){
      res.render("landing", {user: req.user});
    }else{
      res.render("landing");
    }
  });

  app.get("/login", function(req, res){
    res.render("login");
  });

  app.post("/login", passport.authenticate('local', {
        successRedirect : "/home",
        failureRedirect : "/login"
    })
  );

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

}
