var fs = require('fs');
var exec = require('child_process').exec;
module.exports = {
  endpoints: function(app){
  },
  steps: [
    { 
      chat: "Welcome back Katniss.  You should have a username and password from our last adventure, if you don't, go back and find them.  We need them to login to this government web server.  We think this might be where they host their website with the dates of the next games.  They have purposly told us the wrong date so that we won't be able to compete.  We must correct this injustice so that us in sector 5 can compete with the rest.  May the odds be ever in your favor.", 
      questions: [
        { prompt: "What is a website?", 
          answer: "A website is exactly what we are using right now.  They are always hosted on computers called servers." },
        { prompt: "What is a web server?",
          answer: "A server is a computer that is directly connected to the internet and all it does is respond to web requests.  It doesn't have a screen so the only way to interact with it is through this terminal." }
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
      chat: "Great.  Now that you've logged in do you see anything interesting?", 
      correct_question: 2,
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
					fs.readFile('/home/term/.bash_history', 'utf8', function(err, data) {
            if(err){
              res.send('false');
            } else {
              if(data.indexOf("cd /app/node/public/games/") !== -1){
                res.send("true");
              } else {
                res.send('false');
              }
            }
          });
        }
    },
    { 
      chat: "Now first let's see what the website looks like right now.  Please go to <a href='/games/' target='_blank'>games</a>.  What date does it say right now?", 
      correct_question: 2,
      questions: [
        { prompt: "I can't get the site to open.", 
          answer: "Try right clicking on the link and open it in a new tab." },
        { prompt: "June 24, 2017",
          answer: "Not quite, try again." },
        { prompt: "July 14, 2017",
          answer: "" }
      ], 
      statusFunction: 
        function(req, res) {
        }
    },
    { 
      chat: "Yes, that what I'm seeing also.  Ok, let's get to work.  See if you can find a file called date.txt.  Let's see if we can overwrite it with August 12, 2017.", 
      questions: [
        { prompt: "I can't remember how to write to a file.", 
          answer: "Remember we use the <code>&gt</code> to take the output and write to a file." },
        { prompt: "I still can't get it to work!",
          answer: "Try this command <code>echo 'August 12, 2017' > date.txt</code>.  Again notice that we have <code>'</code> around the date, so that it looks like one thing." }
      ], 
      statusFunction: 
        function(req, res) {
        }
    },
    { 
      chat: "Now that we've changed the file.  Let's go back to the webpage and see if it looks correct this time.  Remember to refresh it!  Here is the link again <a href='/games/' target='_blank'>games</a>", 
      correct_answer: 1,
      questions: [
        { prompt: "How do I refresh a page?", 
          answer: "There is a button that looks like a circle with an arrow next to the address bar.  If you click that it will refresh the page." },
        { prompt: "Yay, that looks right!",
          answer: "" }
      ], 
      statusFunction: 
        function(req, res) {
        }
    },
    { 
      chat: "Once again great work!  Now everyone will know when the games are and can compete with the rest of the citizens.", 
      questions: [
      ], 
      statusFunction: 
        function(req, res) {
        }
    }
  ]
}