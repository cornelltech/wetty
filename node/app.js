var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var server = require('socket.io');
var pty = require('pty.js');
var fs = require('fs');
var exec = require('child_process').exec;
var chapter = require('./chapter_node');

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

var httpserv;

var app = express();
app.get('/wetty/ssh/:user', function(req, res) {
    res.sendfile(__dirname + '/public/wetty/index.html');
});
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/status/:index', function(req, res) {
  chapter.steps[req.params["index"]]["statusFunction"](req, res);
});    
app.get('/chat/:index', function(req, res) {
  res.send({ 
    chat: chapter.steps[req.params["index"]]["chat"], 
    questions: chapter.steps[req.params['index']]["questions"].map((x) => { return x["prompt"]; }),
    correct_question: typeof chapter.steps[req.params['index']]["correct_question"] !== "undefined" ? chapter.steps[req.params['index']]["correct_question"]:-1
  });
});
app.get('/chat/:index/answer/:question', function(req, res) {
  res.send(chapter.steps[req.params["index"]]["questions"][req.params["question"]]["answer"]);
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

var io = server(httpserv,{path: '/wetty/socket.io'});
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
