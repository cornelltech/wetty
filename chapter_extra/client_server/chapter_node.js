var fs = require('fs');
var exec = require('child_process').exec;
module.exports = {
  chapter_name: "client_server",
  endpoints: function(app){
    app.get('/client_server/games/', function(req, res) {
      fs.readFile('/tmp/'+req.user.username+'/website/date.txt', 'utf8', function(err, data) {
        if(err){
          res.send('<h1>The Date for our next Hunger games is: </h1>');
        } else {
          res.send('<h1>The Date for our next Hunger games is: '+data+'</h1>');
        }
      });
    });
  },
  steps: [
    { 
      chat: "Welcome back {{username}}.  We have another big problem.  The government has tried to mislead our sector by posting the wrong date for the next games.  We must correct this injustice!  <br><br>First we need to login to this government web server.  The username and password are the same as the last chapter.  We think this might be where they host their website with the dates of the next games.  May the odds be ever in your favor.", 
      questions: [
        { prompt: "What is a website?", 
          answer: "A website is exactly what we are using right now.  They are always hosted on computers called servers." },
        { prompt: "What is a web server?",
          answer: "A web server is a computer that is directly connected to the internet and all it does is respond to web requests.  It doesn't have a screen so the only way to interact with it is through this terminal." }
      ], 
      statusFunction: 
        function(req, res) {
					exec('users', function(error, stdout, stderr) {
            if( stdout.indexOf(req.user.username) === -1){
              res.send("false");
            } else {
              res.send("true");
            }
          });
        }
    },
    { 
      chat: "Great.  Now that you've logged in do you see anything interesting?", 
      questions: [
        { prompt: "No, nothing interesting here!", 
          answer: "Hmm.  Try looking around by using <code>ls</code> and <code>cd</code>." },
        { prompt: "I see lots of files but don't know where to start.",
          answer: "Try reading some of them with <code>cat</code>." },
        { prompt: "I think I found their secret directory.",
          answer: "Great, use <code>cd</code> to move to that directory.  Remember, any path that starts with a <code>/</code> is starting from the root directory." }
      ], 
      statusFunction: 
        function(req, res) {
					fs.readFile('/home/'+req.user.username+'/.bash_history', 'utf8', function(err, data) {
            if(err){
              res.send('false');
            } else {
              if(data.indexOf("cd /tmp/"+req.user.username+"/website") !== -1){
                res.send("true");
              } else {
                res.send('false');
              }
            }
          });
        }
    },
    { 
      chat: "Now first let's see what the website looks like right now.  Please go to <a href='/client_server/games/' target='_blank'>games</a>.  What date does it say right now?", 
      correct_question: 2,
      questions: [
        { prompt: "I can't get the site to open.", 
          answer: "Try right clicking on the link and open it in a new tab." },
        { prompt: "June 24, 2017",
          answer: "Not quite, try again." },
        { prompt: "June 4, 2017",
          answer: "" }
      ], 
      statusFunction: 
        function(req, res) {
          res.send('false');
        }
    },
    { 
      chat: "Yes, that what I'm seeing also.  Ok, let's get to work.  See if you can find a file called date.txt.  Let's see if we can overwrite it with August 12, 2017.", 
      questions: [
        { prompt: "I can't remember how to write to a file.", 
          answer: "Remember we use the <code>&gt;</code> to take the output and write to a file." },
        { prompt: "I still can't get it to work!",
          answer: "Try this command <code>echo 'August 12, 2017' &gt; date.txt</code>.  Again notice that we have <code>'</code> around the date, so that it looks like one thing." }
      ], 
      statusFunction: 
        function(req, res) {
					fs.readFile('/tmp/'+req.user.username+'/website/date.txt', 'utf8', function(err, data) {
            if(err){
              res.send('false');
            } else {
              if(data.indexOf("August 12, 2017") !== -1){
                res.send("true");
              } else {
                res.send('false');
              }
            }
          });
        }
    },
    { 
      chat: "Now that we've changed the file.  Let's go back to the webpage and see if it looks correct this time.  Remember to refresh it!  Here is the link again <a href='/client_server/games/' target='_blank'>games</a>", 
      correct_question: 1,
      questions: [
        { prompt: "How do I refresh a page?", 
          answer: "There is a button that looks like a circle with an arrow next to the address bar.  If you click that it will refresh the page." },
        { prompt: "Yay, that looks right!",
          answer: "" }
      ], 
      statusFunction: 
        function(req, res) {
          res.send("false");
        }
    },
    { 
      chat: "Once again great work!  Now everyone will know when the games are and can compete with the rest of the citizens.  Click <a href='/home'>here</a> to return to the home page.", 
      questions: [
      ], 
      statusFunction: 
        function(req, res) {
          res.send("false");
        }
    }
  ]
}
