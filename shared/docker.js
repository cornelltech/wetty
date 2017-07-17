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

module.exports.sync = function(pool){
  pool.getAllUsers(function(rows){
    rows.forEach(function(row){
      console.log(row.data);
      if(row.data.available_chapters){
        console.log(row.data.available_chapters);
        row.data.available_chapters.forEach(function(chapter){
          console.log(chapter, row.data.username, row.data.password);
          add_user(chapter, row.data.username, row.data.password);
        });
      }
    });
  });
}

function add_user(chapter, username, password){
  var container = docker.getContainer(chapter_containers[chapter])
  docker_exec(container, ['bash', '-c', 'useradd -d /home/'+username+' -m -s /bin/bash '+username+' && echo '+username+':'+password+' | chpasswd && echo "export PROMPT_COMMAND=\'history -a\'" >> /home/'+username+'/.bashrc'], null);
}
module.exports.add_user = add_user;

function docker_exec(container, command, second_command){
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
    console.log('here');
    exec.start({stdin: true, hijack: true}, function(err, stream) {
      if (err){
        console.log(err);
        return;
      }
      console.log('there');
      container.modem.demuxStream(stream, process.stdout, process.stderr);
      
      exec.inspect(function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(data);
        if(second_command){
          docker_exec(container, second_command, null);
        }
      });
    });
  });
}
//  docker.getContainer(chapter_containers[chapter]).exec(['echo', 'hello'], {stdout: true}, (err, results) => {
//    console.log(results);
//    console.log(results.stdout);
//  });
//}
