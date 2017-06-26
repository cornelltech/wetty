var express       = require('express');
var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser');
var http          = require('http');
var path          = require('path');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session       = require('express-session');
var flash         = require('connect-flash');
var exphbs        = require('express-handlebars');

var Docker = require('dockerode');
var docker = new Docker();

var port = 8888;
var httpserv;

const users = {
scot: {password: 'K12Rocks!',
  username: 'scot',
id: 1}}


passport.use(new LocalStrategy(
  function(username, password, done) {
      console.log("user: " + username + " and password: " + password);
      console.log(users[username]);
      if (users[username] == undefined) {
        return done(null, false, { message: 'Incorrect username.' });
      } 
      if (users[username]['password'] != password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log("should be authenticated");
      return done(null, users[username]);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

function authenticationMiddleware () {  
  return function (req, res, next) {

    console.log("authenticating...");
    if (req.isAuthenticated()) {
      console.log('successful auth');
      return next()
    }
    res.redirect('/login')
  }
}

passport.authenticationMiddleware = authenticationMiddleware

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//app.use(cookieParser());
app.use(session({ 
  secret: 'ilovescotchscotchyscotchscotch', 
  resave: true,
  saveUninitialized: true 
})); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/home', function (req, res) {
      res.render('home');
});

app.get('/stuff', passport.authenticationMiddleware(), function (req, res) {
  console.log(req.session.passport.user);
  res.render('stuff', {user: req.session.passport.user.username})
});
app.get('/login', function(req, res) {
  res.send('<form action="/login" method="post"><div><label>Username:</label><input type="text" name="username"/></div><div><label>Password:</label><input type="password" name="password"/></div><div><input type="submit" value="Log In"/></div></form>');
});
app.post('/login', passport.authenticate('local', { successRedirect: '/stuff',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);
app.get('/docker', function(req, res) {
  docker.listContainers(function (err, containers) {
    res.send(containers);
    console.log(containers);
    //containers.forEach(function (containerInfo) {
    //  docker.getContainer(containerInfo.Id).stop(cb);
    //});
  });
});

httpserv = http.createServer(app).listen(port, function() {
  console.log('http on port ' + port);
});

