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


const pool = require('../shared/db');
const my_session = require('../shared/session');
const docker = require('../shared/docker');

var port = 8888;
var httpserv;

my_session.setup(pool);
docker.sync(pool);

var app = express();

my_session.add_session_to_express(app, pool);

app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir: '/app/auth/views/layouts/'}));
app.set('view engine', 'handlebars');
app.set('views', '/app/auth/views/');


app.get('/home', passport.authenticationMiddleware(), function (req, res) {
  pool.getChapters(function(data) {
    var chapter_links = data.map(function (x) { 
      if(req.user.available_chapters){ 
        return { name: x, available: req.user.available_chapters.includes(x) }
      } else {
        return { name: x, available: false }
      }
    });
    res.render('home', { user: req.user, chapter_links: chapter_links });
  });
});
app.post('/finished', passport.authenticationMiddleware(), function(req, res) {
  var chapter = req.body.chapter;
  pool.addChapter(req.user.username, chapter);
  docker.add_user(chapter, req.user.username, req.user.password);
  res.redirect('/home');
});
app.get('/', function(req, res){
  res.redirect('/home');
});

app.get('/signup', function(req, res) {
  res.render('signup');
});
app.post('/signup', function(req, res) {
  pool.addUser(req.body.username, { 
    username: req.body.username,
    password: req.body.password,
    available_chapters: ["quest1"] });
  docker.add_user('quest1', req.body.username, req.body.password);
  res.redirect('/login');
});
app.get('/login', function(req, res) {
  res.render('login');
});
app.post('/login', passport.authenticate('local', { successRedirect: '/home',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);
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

