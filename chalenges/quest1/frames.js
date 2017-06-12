var fs = require('fs');
var exec = require('child_process').exec;
module.exports = {
  responseArray: [
    { 
      chat: "Hello Katniss.  There is an emergency and we need your help!  Some agents from the Capitol have infected the mainframe computer running the powerplant for all District 12 with a malware. The malware will most likely destroy some files, infect other machines and shuts down the power for all inhabitants of the District.<br><br>According to our intelligence sources, we have less than 5 minutes to deactivate the malware.<br><br>May the odds be ever in your favor!<br><br>Thankfully the agent working for the Capitol was a little sloppy and left some traces behind.  From the current folder, look for a file named footsteps.txt and read it.", 
      questions: [
        { prompt: "How do I read a file?", 
          answer: "You can use a program called <code>cat</code> to read a file.  Try <code>cat footsteps.txt</code>." },
        { prompt: "How do I login?",
          answer: "You should log in with username and password of <code>term</code>." }
      ], 
      statusFunction: 
        function(req, res) {
          fs.readFile('/home/term/.bash_history', 'utf8', function(err, data) {
            if(err){
              res.send('false');
            } else {
              if(data.indexOf("cat footsteps.txt") !== -1){
                res.send("true");
              } else {
                res.send('false');
              }
            }
          });
        }
    },
    {
      chat: "Great work!!  Our sources told us that they left the command they ran in that file.  But in order to stop the process we need the PID or process ID.  Every process on this mainframe has an ID and we need to find the ID of this one.  Let's list the processes that are running and see if we can find the process.  To list the current processes run this command <code>ps -ef</code>.",
      questions: [
        { prompt: "What is a process?",
          answer: "A process is a running program.  On a phone a process might be an app you have installed or is running.  On this system an example is everytime you run a command, so far they haven't lasted long though."},
        { prompt: "What is a CMD?",
          answer: "CMD is short for command.  So if we can find the line that has the correct CMD we should get the correct PID."}
      ],
      statusFunction:
        function(req, res) {
          fs.readFile('/home/term/.bash_history', 'utf8', function(err, data) {
            if(err){
              res.send('false');
            } else {
              if(data.indexOf("ps -ef") !== -1){
                res.send("true");
              } else {
                res.send('false');
              }
            }
          });
        }
    },
    {
      chat: "Nice.  Now that we have the correct PID we can try to kill the process.  We use the <code>kill</code> command for that.  Try running <code>kill [PID]</code> but replace the <code>[PID]</code> with the number you got from <code>ps -ef</code>",
      questions: [
        { prompt: "What does kill do?",
          answer: "Kill is a program to stop (kill) processes.  Usually it needs the PID to know which process to kill."},
        { prompt: "I can't remember how to write to a file.",
          answer: "That's ok.  Remember to use <code>echo \"CMD\" > command.txt</code>" },
        { prompt: "What is CMD?",
          answer: "CMD is just a short way to write command, but they have the same meaning."}
      ],
      statusFunction:
        function(req, res) {
          fs.readFile('/home/term/command.txt', 'utf8', function(err, data) {
            if(err){
              res.send('false');
            } else {
              if(data.indexOf("/app/extra_procs.sh") !== -1){
                res.send("true");
              } else {
                res.send('false');
              }
            }
          });
        }
    },
    {
      chat: "Great!  Now we know the command they ran to infiltrate our system.",
      questions: [
        { prompt: "How do I use the redirect?",
          answer: "You must put the <code>&gt;</code> after the <code>echo hello</code> and then put the filename <code>temp</code> after the <code>&gt;</code>." },
        { prompt: "I can't figure out how to do this!",
          answer: "Try typing this in the console: <code>echo hello &gt; temp</code>" }
      ],
      statusFunction:
        function(req, res) {
          fs.readFile('/home/term/temp', 'utf8', function(err, data) {
            if(err){
              res.send("false");
            } else {
              if(data.indexOf("hello") === -1){
                res.send("false");
              } else {
                res.send("true");
              }
            }
          });
        }
    },
    {
      chat: "Once again you've done excelent work!!  Next we would like to read that file and see exactly what we wrote into it.  We use a program called <code>cat</code> to read a file.  See if you can figure out how to read this file back to us!",
      questions: [
        { prompt: "I can't figure out how to read it.",
          answer: "Try using the command and then the filename." },
        { prompt: "I really can't figure this out!",
          answer: "Try typing this into the terminal: <code>cat temp</code>" }
      ],
      statusFunction:
        function(req, res) {
          fs.readFile('/home/term/.bash_history', 'utf8', function(err, data) {
            if(err){
              res.send('false');
            } else {
              if(data.indexOf("cat temp") !== -1){
                res.send("true");
              } else {
                res.send('false');
              }
            }
          });
        }
    },
    {
      chat: "Congratulations, you have completed the first chapter!",
      questions: [
        { prompt: "What do I do now?",
          answer: "Now you must wait for us to build the next chapter." },
        { prompt: "How can I find out more?",
          answer: "you can't...yet." }
      ],
      statusFunction:
        function(req, res) {
          res.send('false');
        }
    }
  ]
}
