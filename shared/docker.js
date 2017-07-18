var Docker = require('dockerode');
var docker = new Docker();

var chapter_containers = {};

docker.listContainers(function (err, containers) {
  containers.forEach(function (containerInfo) {
    if(containerInfo.Labels['wetty.chapter']){
      chapter_name = containerInfo.Labels['wetty.chapter'];
      chapter_containers[chapter_name] = containerInfo.Id;
    }
    //docker.getContainer(containerInfo.Id).stop(cb);
  });
  console.log(chapter_containers);
});

// sync database and docker containers with user accounts
module.exports.sync = function(pool){
  pool.getAllUsers(function(rows){
    rows.forEach(function(row){
      if(row.data.available_chapters){
        row.data.available_chapters.forEach(function(chapter){
          console.log("SYNC  adding user:"+row.data.username+" to chapter:"+chapter);
          add_user(chapter, row.data.username, row.data.password);
        });
      }
    });
  });
}

function add_user(chapter, username, password){
  var container = docker.getContainer(chapter_containers[chapter])
  docker_exec(container, ['bash', '-c', 'useradd -d /home/'+username+' -m -s /bin/bash '+username+' && echo '+username+':'+password+' | chpasswd && echo "export PROMPT_COMMAND=\'history -a\'" >> /home/'+username+'/.bashrc && /app/dynamic/setup_user.sh '+username]);
}
module.exports.add_user = add_user;

function docker_exec(container, command){
  var options = {
    Cmd: command,
    AttachStdout: true,
    AttachStderr: true,
    AttachStdin: true
  };

  container.exec(options, function(err, exec) {
    if (err) {
			console.log(err);
      return;
    }
    exec.start({stdin: true, hijack: true}, function(err, stream) {
      if (err){
        console.log(err);
        return;
      }
      container.modem.demuxStream(stream, process.stdout, process.stderr);
      
      exec.inspect(function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(data);
      });
    });
  });
}
