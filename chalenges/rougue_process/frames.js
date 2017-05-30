var fs = require('fs');
var exec = require('child_process').exec;
module.exports = {
  frameContent: [
    `<h1>Welcome to the rougue process chalenge</h1>
     <p class="flow-text">You are a government security agent and one of your servers has been infected with a virus.  We have a feeling who it was, but we haven't been able to fix our server.  Your mission, should you choose to accept it, is the find the rougue process and kill it.</p>
     <p class="flow-text">First step is listing files so we can see what is being created.  We use a command <code>ls</code> to show files in the current directory.  We use the command <code>pwd</code> to show where we are in the directory structure.  And we use the command <code>cd</code> to move from directory to directory.</p>
     <p class="flow-text">Try to <code>cd</code> into the <code>hacked</code> directory.</p>`,
     `<h1>Read a file</h1><p class="flow-text">Great, now let's start by creating a file.  In our hacking terminal we use the command <code>touch</code> to create a file.  See if you can create a file called <code>temp</code>.</p>`,
    "<h1>Complete!!</h1><p class='flow-text'>Congrats, you have completed the chalenge.</p>"
  ],
  statusOfFrame: [
    function(req, res) {
      exec('ps -ef|grep \'bash\'', function(error, stdout, stderr) {
        regexp = /term\W+(\d+)\W+/;
        if(stdout.match(regexp)){
          var pid = stdout.match(regexp)[1];
          exec('lsof -p ' + pid + '|grep cwd', function(error, stdout, stderr) {
            regexp2 = /\W+(\/\w+)\W*/
            if(stdout.match(regexp2)){
              if(stdout.match(regexp2)[1] === '/home/term/temp'){
                res.send("complete");
              }else{
                res.send("not complete");
              }
            } else {
              res.send("not quite");
            }
          });
        } else {
          res.send("not proc");
        }
      });
    },
    function(req, res) {
      fs.access('/home/term/temp', fs.constants.F_OK, (err) => {
        res.send(err ? "not complete" : "complete");
      });
    },
    function(req, res) {
      res.send("YEAY!!");
    }
  ]
}
