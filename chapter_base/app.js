var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var server = require('socket.io');
var pty = require('pty.js');
var fs = require('fs');
var exec = require('child_process').exec;
var chapter = require('../dynamic/chapter_node');
var exphbs = require('express-handlebars');
var Handlebars = require('handlebars');
var exJwt         = require('express-jwt');

const pool = require('../shared/db');
const my_session = require('../shared/session');

var opts = require('optimist')
    .options({
        sslkey: {
            demand: false,
            description: 'path to SSL key'
        },
        sslcert: {
            demand: false,
            description: 'path to SSL certificate'
        },
        sshhost: {
            demand: false,
            description: 'ssh server host'
        },
        sshport: {
            demand: false,
            description: 'ssh server port'
        },
        sshuser: {
            demand: false,
            description: 'ssh user'
        },
        sshauth: {
            demand: false,
            description: 'defaults to "password", you can use "publickey,password" instead'
        },
        port: {
            demand: true,
            alias: 'p',
            description: 'wetty listen port'
        },
    }).boolean('allow_discovery').argv;

var runhttps = false;
var sshport = 22;
var sshhost = 'localhost';
var sshauth = 'password';
var globalsshuser = '';

if (opts.sshport) {
    sshport = opts.sshport;
}

if (opts.sshhost) {
    sshhost = opts.sshhost;
}

if (opts.sshauth) {
	sshauth = opts.sshauth
}

if (opts.sshuser) {
    globalsshuser = opts.sshuser;
}

if (opts.sslkey && opts.sslcert) {
    runhttps = true;
    opts['ssl'] = {};
    opts.ssl['key'] = fs.readFileSync(path.resolve(opts.sslkey));
    opts.ssl['cert'] = fs.readFileSync(path.resolve(opts.sslcert));
}


process.on('uncaughtException', function(e) {
    console.error('Error: ' + e);
});

my_session.setup(pool);

var httpserv;

var app = express();
my_session.add_session_to_express(app, pool);

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir: "chapter_base/views/layouts/"}));
app.set('view engine', 'handlebars');
app.locals.chapter_name = process.env.CHAPTER;
console.log(process.env.CHAPTER);

var chapter_name = process.env.CHAPTER;

//app.get('/' + chapter_name + '/wetty/ssh/:user', function(req, res) {
//    res.sendfile(__dirname + '/public/wetty/index.html');
//});
app.get('/' + chapter_name + '/chapter_frontend.js', function(req, res){
  fs.readFile('/app/dynamic/chapter_frontend.js', 'utf8', function(err, data) {
    if(err){
      res.send(err);
    }
    res.send(data);
  });
});


app.get('/' + chapter_name + '/', function(req, res){
  res.render('index');
});
app.use('/' + chapter_name + '/', express.static(path.join(__dirname, 'public')));
app.get('/' + chapter_name + '/learn.js', function(req, res){
  res.render('learn_js', { layout: false });
});
app.get('/' + chapter_name + '/wetty/wetty.js', function(req, res){
  res.render('wetty_js', { layout: false });
});


app.get('/' + chapter_name + '/status/:index', function(req, res) {
  chapter.steps[req.params["index"]]["statusFunction"](req, res);
  console.log("Getting status of index: " + req.params["index"]);
});    

app.get('/' + chapter_name + '/chat/:index', function(req, res) {
  chat_template = Handlebars.compile(chapter.steps[req.params["index"]]["chat"]);
  question_templates = chapter.steps[req.params['index']]["questions"].map((x) => { return Handlebars.compile(x["prompt"]); });
  res.send({ 
    chat: chat_template(req.user), 
    questions: question_templates.map((template) => { return template(req.user); }),
    correct_question: typeof chapter.steps[req.params['index']]["correct_question"] !== "undefined" ? chapter.steps[req.params['index']]["correct_question"]:-1
  });
});
app.get('/' + chapter_name + '/api/chat/:index', exJwt({ secret: "something_very_secret", userProperty: 'payload' }), function(req, res) {
  chat_template = Handlebars.compile(chapter.steps[req.params["index"]]["chat"]);
  question_templates = chapter.steps[req.params['index']]["questions"].map((x) => { return Handlebars.compile(x["prompt"]); });
  res.send({ 
    chat: chat_template(req.user), 
    questions: question_templates.map((template) => { return template(req.user); }),
    correct_question: typeof chapter.steps[req.params['index']]["correct_question"] !== "undefined" ? chapter.steps[req.params['index']]["correct_question"]:-1
  });
});
app.get('/' + chapter_name + '/api/chat/:index/answer/:question', exJwt({ secret: "something_very_secret", userProperty: 'payload' }), function(req, res) {
  console.log("responding with answer to index: " + req.params["index"] + " and question: " + req.params["question"]);
  answer_template = Handlebars.compile(chapter.steps[req.params["index"]]["questions"][req.params["question"]]["answer"]);
  res.send({chat:answer_template(req.user)});
});
app.get('/' + chapter_name + '/api/status/:index', exJwt({ secret: "something_very_secret", userProperty: 'payload' }), function(req, res) {
  chapter.steps[req.params["index"]]["statusFunction"](req, res);
  console.log("Getting status of index: " + req.params["index"]);
});    

app.get('/' + chapter_name + '/chat/:index/answer/:question', function(req, res) {
  console.log("responding with answer to index: " + req.params["index"] + " and question: " + req.params["question"]);
  answer_template = Handlebars.compile(chapter.steps[req.params["index"]]["questions"][req.params["question"]]["answer"]);
  res.send(answer_template(req.user));
});

// add any endpoints that this chapter might have
chapter.endpoints(app);


if (runhttps) {
    httpserv = https.createServer(opts.ssl, app).listen(opts.port, function() {
        console.log('https on port ' + opts.port);
    });
} else {
    httpserv = http.createServer(app).listen(opts.port, function() {
        console.log('http on port ' + opts.port);
    });
}

var io = server(httpserv,{path: '/' + chapter_name + '/wetty/socket.io'});
io.on('connection', function(socket){
    var sshuser = '';
    var request = socket.request;
    console.log((new Date()) + ' Connection accepted.');
    if (match = request.headers.referer.match('/wetty/ssh/.+$')) {
        sshuser = match[0].replace('/wetty/ssh/', '') + '@';
    } else if (globalsshuser) {
        sshuser = globalsshuser + '@';
    }

    var term;
    if (process.getuid() == 0) {
        term = pty.spawn('/bin/login', [], {
            name: 'xterm-256color',
            cols: 80,
            rows: 30
        });
    } else {
        term = pty.spawn('ssh', [sshuser + sshhost, '-p', sshport, '-o', 'PreferredAuthentications=' + sshauth], {
            name: 'xterm-256color',
            cols: 80,
            rows: 30
        });
    }
    console.log((new Date()) + " PID=" + term.pid + " STARTED on behalf of user=" + sshuser)
    term.on('data', function(data) {
        socket.emit('output', data);
    });
    term.on('exit', function(code) {
        console.log((new Date()) + " PID=" + term.pid + " ENDED")
    });
    socket.on('resize', function(data) {
        term.resize(data.col, data.row);
    });
    socket.on('input', function(data) {
        term.write(data);
    });
    socket.on('disconnect', function() {
        term.end();
    });
})
