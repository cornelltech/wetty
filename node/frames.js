var fs = require('fs');
module.exports = {
  frameContent: [
    `<h1>Welcome!!!...</h1>
     <p class="flow-text">to the hacking center.  The president is in need of your help, and you are the only one who can provide the brains nessesary to complete the task.  First we need to login to our hacking station.  Try logging in with the username and password of <code>term</code>.</p>
     <p class="flow-text">Great, now let's start by creating a file.  In our hacking terminal we use the command <code>touch</code> to create a file.  See if you can create a file called <code>temp</code>.</p>`,
    "<h1>Step 1</h1>",
    "<h1>Step 2</h1>"
  ],
  statusOfFrame: [
    function(req, res) {
      fs.access('/home/term/temp', fs.constants.F_OK, (err) => {
        res.send(err ? "not complete" : "complete");
      });
    },
    function(req, res) {
      res.send("frame 1 status");
    }
  ]
}
    //#exec('ls -la', function(error, stdout, stderr) {
    //    //#    res.send(stdout);
    //        //#});
