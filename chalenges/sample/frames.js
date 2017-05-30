var fs = require('fs');
var exec = require('child_process').exec;
module.exports = {
  responseArray: [
    { 
      chat: "Hello, welcome to the internet.  We will be using the terminal to explore the world of computers.  First we need to try to login.  Try logging in using the username <code>term</code> and the password <code>term</code>.", 
      questions: [
        { prompt: "But the password isn't typing in!", 
          answer: "That's alright the letters that you're pressing are still getting sent.  And you can still use backspace if you make a mistake." },
        { prompt: "What is a username?",
          answer: "A username is the name that you will use.  So usually this might be your name or a name you made up.  But today it will just be <code>term</code>." },
        { prompt: "What is a password?",
          answer: "A password is a secret that only you have.  This makes it very difficult for someone else to pretend to be you.  Only you know the secret so only you can login as your username.  Today we are not using a secret though just use <code>term</code>." }
      ], 
      statusFunction: 
        function(req, res) {
          exec('users', function(error, stdout, stderr) {
            if( stdout.indexOf("term") === -1){
              res.send("false");
            } else {
              res.send("true");
            }
          });
        }
    },
    {
      chat: "Great work!!  Now you've successfully logged into our system.  Ok now let's create a file that we can play with.  The program we use to create a file is called <code>touch</code> and we want to create a file called <code>temp</code>.  See if you can create our temp file!",
      questions: [
        { prompt: "What is a file?",
          answer: "A file is a piece of data on the computer.  It can contain text or an image.  It's basically like a container for data.  Right now we are creating an empty file, so nothing is in it yet."},
        { prompt: "I can't figure out how to create the file!",
          answer: "Try typing this in the terminal <code>touch temp</code>.  If that doesn't work then ask for help."}
      ],
      statusFunction:
        function(req, res) {
          fs.access('/home/term/temp', fs.constants.F_OK, (err) => {
            res.send(err ? "false" : "true");
          });
        }
    },
    {
      chat: "Nice.  Alright now that we have a file let's put something in it and read it back out.  Here we are going to start dealing with input and output.  Most programs have input or output or both.  And we can redirect that input or output.  So let's start by just printing something to the screen.  We will use a program called <code>echo</code> to do this.  By default the output from a program will go to the terminal and we will see it.  So try printing <code>hello</code>.",
      questions: [
        { prompt: "I can't seem to print hello.",
          answer: "Try typing this in the terminal <code>echo hello</code>."},
        { prompt: "Why would we ever just want to print something?",
          answer: "We'll see in a second what we can do with this." }
      ],
      statusFunction:
        function(req, res) {
          res.send("false");
        }
    }
  ]
}
