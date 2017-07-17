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

const pool = require('../shared/db');

var port = 8888;
var httpserv;


passport.use(new LocalStrategy(
  function(username, password, done) {
      pool.getUser(username, function(user){
        console.log("user: " + username + " and password: " + password);
        console.log(user);
        if (user == undefined) {
          return done(null, false, { message: 'Incorrect username.' });
        } 
        if (user.password != password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        console.log("should be authenticated");
        return done(null, user);
      });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    console.log(username);
    pool.getUser(username, function( data ){
      console.log(data);
      done(null, data);
    });
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
  store: pool.pgSession,
  secret: 'ilovescotchscotchyscotchscotch', 
  resave: true,
  saveUninitialized: true 
})); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir: '/app/auth/views/layouts/'}));
app.set('view engine', 'handlebars');
app.set('views', '/app/auth/views/');


app.get('/home', passport.authenticationMiddleware(), function (req, res) {
  pool.getChapters(function(data) {
    var chapter_links = data.map(function (x) { return { name: x, available: req.user.available_chapters.includes(x) }});
    res.render('home', { user: req.user, chapter_links: chapter_links });
  });
});

app.get('/signup', function(req, res) {
  res.render('signup');
});
app.post('/signup', function(req, res) {
  pool.addUser(req.body.username, { 
    username: req.body.username,
    password: req.body.password,
    available_chapters: ["quest1"] });
  res.redirect('/login');
});
app.get('/login', function(req, res) {
  res.render('login');
});
app.post('/login', passport.authenticate('local', { successRedirect: '/home',
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
app.get('/db', function(req, res) {
  pool.query('select * from users', [], function(err, resp) {
    if(err) {
      return console.log("error running query", err);
    }
    console.log(resp.rows);
    res.send(resp.rows);
  }); 
});


httpserv = http.createServer(app).listen(port, function() {
  console.log('http on port ' + port);
});

