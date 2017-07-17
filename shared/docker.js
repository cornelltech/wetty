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

//RUN useradd -s /bin/bash hacker
//RUN echo 'hacker:top_secret_pw' | chpasswd
// , '&&', 'echo', username+':pw', '|', 'chpasswd'

module.exports.add_user = function(chapter, username, password){
  var container = docker.getContainer(chapter_containers[chapter])
  docker_exec(container, ['bash', '-c', 'useradd -d /home/'+username+' -m -s /bin/bash '+username+' && echo '+username+':'+password+' | chpasswd && echo "export PROMPT_COMMAND=\'history -a\'" >> /home/'+username+'/.bashrc'], null);
}

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
