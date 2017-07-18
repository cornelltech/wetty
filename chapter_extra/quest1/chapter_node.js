var fs = require('fs');
var exec = require('child_process').exec;
module.exports = {
  chapter_name: "quest1",
  endpoints: function(app){
    app.get('/quest1/countdown', function(req, res) {
      fs.readFile('/home/'+req.user.username+'/countdown.txt', 'utf8', function(err, data) {
        if(err){
          res.send('file read error!');
        } else {
          res.send(data);
        }
      });
    });
    app.get('/quest1/start_proc', function(req, res) {
      exec('if ! pidof -x extra_procs.sh >/dev/null; then sudo -H -u '+req.user.username+' nohup /app/extra_procs.sh '+req.user.username+' & fi', function(err, data) {
        if(err){
          res.send(err);
        } else {
          res.send('true');
        }
      });
    });
    app.get('/quest1/status', function(req, res) {
      fs.readFile('/home/'+req.user.username+'/countdown.txt', 'utf8', function(err, data) {
        if(err){
          console.log(err);
          res.send(err);
        }
        if(data.indexOf("boom!!") !== -1){
          res.send('fail');
        } else {
          exec('pidof -x extra_procs.sh', function(err, data) {
            if(data === ''){
              res.send('success');
            } else {
              res.send('continue');
            }
          });
        }
      });
    });
  },
  steps: [
    { 
      chat: "Hello {{username}}.  There is an emergency and we need your help!  Some agents from the Capitol have infected the mainframe computer running the powerplant for all District 12 with a malware. The malware will most likely destroy some files, infect other machines and shuts down the power for all inhabitants of the District.<br><br>According to our intelligence sources, we have less than 5 minutes to deactivate the malware.<br><br>May the odds be ever in your favor!<br><br>Thankfully the agent working for the Capitol was a little sloppy and left some traces behind.  They left some files behind.  Let's see if we can find the footsteps.txt file.  First let's list the files in our current directory with <code>ls</code>.", 
      questions: [
        { prompt: "What is a directory?",
          answer: "A directory contains files and/or directories.  Similar to how a file is a container for data, a directory is a container for files.  Directories make it easier to organize our files." },
        { prompt: "What is a directory structure?",
          answer: "A directory structure is the layout of directories to organize our files" }
      ],
      statusFunction:
        function(req, res) {
          fs.readFile('/home/'+req.user.username+'/.bash_history', 'utf8', function(err, data) {
            if(err){
              res.send('false');
            } else {
              if(data.indexOf("ls") !== -1){
                res.send('true');
              } else {
                res.send('false');
              }
            }
          });
        }
    },
    {
      chat:  "Great, now we know how to list files in our current directory.  But what about listing files in other directories?  We can simply run <code>ls</code> with the directory.  So let's try to list the files in the <code>files</code> directory.",
      questions: [
        { prompt: "I can't seem to list the files in the files directory.",
          answer: "Try running this command <code>ls files</code>" }
      ],
      statusFunction: 
        function(req, res) {
          fs.readFile('/home/'+req.user.username+'/.bash_history', 'utf8', function(err, data) {
            if(err){
              res.send('false');
            } else {
              if(data.indexOf("ls files") !== -1){
                res.send("true");
              } else {
                res.send('false');
              }
            }
          });
        }
    },
    {
      chat: "Ok, now we should be able to find the file <code>footsteps.txt</code>.  Now we need to print it out, but it's in a different directory so we need to tell the <code>cat</code> program where it is.  We do this by giving it the directory and filename separated by <code>/</code>.  So the path from our curent directory would be <code>files/footsteps.txt</code>.  Now try to read that file.",
      questions: [
        { prompt: "How do I read a file?", 
          answer: "You can use a program called <code>cat</code> to read a file.  Try <code>cat files/footsteps.txt</code>." }
      ], 
      statusFunction: 
        function(req, res) {
          fs.readFile('/home/'+req.user.username+'/.bash_history', 'utf8', function(err, data) {
            if(err){
              res.send('false');
            } else {
              if(data.indexOf("cat files/footsteps.txt") !== -1){
                res.send("true");
              } else {
                res.send('false');
              }
            }
          });
        }
    },
    {
      chat: "Great work!!  Our sources told us that they left the command they ran in that file.  But in order to stop the process we need the PID or process ID.  Every process on this mainframe has an ID and we need to find the ID of this one.  Let's list the processes that are running and see if we can find the process.  To list the current processes run this command <code>ps -U {{username}}</code>.",
      questions: [
        { prompt: "What is a process?",
          answer: "A process is a running program.  On a phone a process might be an app you have installed or is running.  On this system an example is everytime you run a command, so far they haven't lasted long though."},
        { prompt: "What is a CMD?",
          answer: "CMD is short for command.  So if we can find the line that has the correct CMD we should get the correct PID."}
      ],
      statusFunction:
        function(req, res) {
          fs.readFile('/home/'+req.user.username+'/.bash_history', 'utf8', function(err, data) {
            if(err){
              res.send('false');
            } else {
              if(data.indexOf("ps -U "+req.user.username) !== -1){
                res.send("true");
              } else {
                res.send('false');
              }
            }
          });
        }
    },
    {
      chat: "Nice.  Now that we have the correct PID we can try to kill the process.  We use the <code>kill</code> command for that.  Try running <code>kill [PID]</code> but replace the <code>[PID]</code> with the number you got from <code>ps</code>",
      questions: [
        { prompt: "What does kill do?",
          answer: "Kill is a program to stop (kill) processes.  Usually it needs the PID to know which process to kill."},
        { prompt: "What is CMD?",
          answer: "CMD is just a short way to write command, but they have the same meaning."}
      ],
      statusFunction:
        function(req, res) {
          exec('ps -ef', function(err, data) {
            if(err){
              res.send('false');
            } else {
              if(data.indexOf("/app/extra_procs.sh") !== -1){
                res.send("false");
              } else {
                res.send('true');
              }
            }
          });
        }
    },
    {
      chat: "Great work!!  It looks like the countdown has stopped!  Thank you so much, now we have electricity. Click <form action=\"/finished\" method='post' id='success_form'><input type='hidden' name='chapter' value='client_server'><a href=\"javascript:{}\" onclick=\"document.getElementById('success_form').submit();\">here</a></form> to continue.",
      questions: [
      ],
      statusFunction:
        function(req, res) {
          res.send("false");
        }
    }
  ]
}
