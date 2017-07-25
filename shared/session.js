var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session       = require('express-session');
var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser');
var flash         = require('connect-flash');
var auth          = require('./auth');

module.exports.setup = function (pool) {
  
  passport.use(new LocalStrategy(
    function(username, password, done) {
        pool.getUser(username, function(user){
          if (user == undefined) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          if (! auth.checkHash(user.password_hash, password)) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
        });
    }
  ));
  
  passport.serializeUser(function(user, done) {
      done(null, user.username);
  });
  
  passport.deserializeUser(function(username, done) {
      pool.getUser(username, function( data ){
        done(null, data);
      });
  });
  
  function authenticationMiddleware () {
    return function (req, res, next) {
  
      if (req.isAuthenticated()) {
        return next()
      }
      res.redirect('/login')
    }
  }
  
  passport.authenticationMiddleware = authenticationMiddleware
}

module.exports.add_session_to_express = function (app, pool) {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  //app.use(cookieParser());
  app.use(session({
    store: pool.pgSession,
    secret: 'ilovescotchscotchyscotchscotch',
    resave: true,
    saveUninitialized: true
  })); // session secret
  
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session
}
