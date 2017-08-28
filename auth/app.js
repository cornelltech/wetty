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
var exJwt         = require('express-jwt');

const pool = require('../shared/db');
const my_session = require('../shared/session');
const docker = require('../shared/docker');
const auth = require('../shared/auth');

var port = 8888;
var httpserv;

my_session.setup(pool);

var app = express();

my_session.add_session_to_express(app, pool);

app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir: '/app/auth/views/layouts/'}));
app.set('view engine', 'handlebars');
app.set('views', '/app/auth/views/');


app.get('/home', function (req, res) {
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
app.post('/finished', function(req, res) {
  var chapter = req.body.chapter;
  pool.addChapter(req.user.username, chapter);
  res.redirect('/home');
});
app.post('/api/completeChapter', exJwt({ secret: "something_very_secret", userProperty: 'payload' }), function(req, res) {
  var chapter = req.body.chapter;
  pool.getChapters(function(data) {
    for(let i=0; i<data.length; i++){
      if(data[i] === chapter){
        if(data[i+1]){
          pool.addChapter(req.payload.user.username, data[i+1]);
          res.json({status: true, chapter_enabled: data[i+1]});
          return;
        } else {
          res.json({status: false, message:"No more chapters to enable, this was the last."});
          return;
        }
      }
    }
    res.json({status:false, message:`unable to find chapter ${chapter}`});
  });
});
app.get('/', function(req, res){
  res.redirect('/home');
});

app.get('/signup', function(req, res) {
  res.render('signup');
});
app.post('/signup', function(req, res) {
  console.log(req.body.username);
  console.log(req.body.password);

  var hash = auth.createHash(req.body.password);
  pool.addUser(req.body.username, {
    username: req.body.username,
    password_hash: hash,
    available_chapters: ["quest1"] });
  docker.add_user('quest1', req.body.username, req.body.password);
  docker.add_user('client_server', req.body.username, req.body.password);
  docker.add_user('sample', req.body.username, req.body.password);
  res.redirect('/login');
});
app.get('/login', function(req, res) {
  res.render('login');
});
app.post('/api/register', function(req, res){
  console.log(req.body.username);
  console.log(req.body.password);

  var hash = auth.createHash(req.body.password);
  pool.addUser(req.body.username, {
    username: req.body.username,
    password_hash: hash,
    available_chapters: ["quest1"] });
  docker.add_user('quest1', req.body.username, req.body.password);
  docker.add_user('client_server', req.body.username, req.body.password);
  docker.add_user('sample', req.body.username, req.body.password);
  passport.authenticate('local', function(err, user, info){
    var token;
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }
    // If a user is found
    if(user){
      token = auth.generateJwt(user);
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }

  })(req, res);
})
app.get('/api/chapters', exJwt({ secret: "something_very_secret", userProperty: 'payload' }), function(req, res) {
  console.log(req.payload.user);
  pool.getChapters(function(data) {
    res.json(data);
  });
});
app.get('/api/genJwt', exJwt({ secret: "something_very_secret", userProperty: 'payload' }), function(req, res) {
  pool.getUser(req.payload.user.username, data => {
    token = auth.generateJwt(data);
    res.status(200);
    res.json({
      "token" : token
    });
  });
});
app.post('/api/login', function(req, res){
  passport.authenticate('local', function(err, user, info){
    var token;
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }
    // If a user is found
    if(user){
      token = auth.generateJwt(user);
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }

  })(req, res);
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
