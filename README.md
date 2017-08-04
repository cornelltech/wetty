# wetty
Terminal in browser over http/https. (Ajaxterm/Anyterm alternative, but much better)

## Running locally

Running locally should be pretty easy, just follow these steps.
1. Install docker and docker_compose.
2. Run `docker-compose -f dev-compose.yml build`
3. Run `docker-compose -f dev-compose.yml up`
4. Make sure psql is installed locally and run ./auth/create_db.sh.  You will also need the postgres password that is in the docker-compose file.
5. Visit localhost:8000

### Ubuntu

1. Install docker.  https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/

In short, this is what I ran.
```
sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get update
sudo apt-get install docker-ce
```

You can test docker with `sudo docker run hello-world`

2. Install docker-compose. https://docs.docker.com/compose/install/

You must run this first command as root.
```
curl -L https://github.com/docker/compose/releases/download/1.14.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

And test that docker-compose is working with `docker-compose --version`

3. Build all the docker containers.
```
cd wetty
sudo docker-compose -f dev-compose.yml build
```
4. Run the containers
```
sudo docker-compose -f dev-compose.yml up
```
5. In another terminal run database script.  Make sure you have psql installed.  `sudo apt-get install postgresql-client-9.5`
```
cd auth
./create_db.sh
# enter in the db password, which can be found in dev-compose.yml
```
6. Test that it is runing at http://localhost:8000

That's it.  Create an account and try it out!


## Developing

The code is pretty modular with the idea of making it easy for people to build their own chapters.  
Each chapter is run on a separate docker container.  There is also an additional container for nginx and the login/auth.

### Directory structure
/shared - code that is shared among all containers and builds
 
/chapter_extra - add on code just for chapters
 
/auth - base code for authenticator
 
/chapter_base - base code for all chapters

/nginx - nginx config code

### Creating a new chapter

In order to create a new chapter you will create a new directory in /chapter_extra with the chapter name.  
There are a few files that are needed.
1. chapter_node.js - contains all server side code for the chapter
2. chapter_frontend.js - contains all frontend code for the chapter
3. Dockerfile - the Dockerfile used to build the docker image for this chapter
4. setup_user.sh - This script is run whenever a user is added to a chapter container and should 
do any additional setup you need.

#### chapter_node.js
There are several parts to this file:
##### Require 
You must require any libraries that you need.
##### Module.exports
We use the node syntax for including files, so everything that will be used elsewhere should be in the module.exports 
dictionary.
##### Chapter_name
A simple string of the name of this chapter.
##### Endpoints
This is a function that accepts the application as a parameter.
This can be used to add new backend endpoint to the app.  You could also get creative and do all sort of stuff,
this is run when the chapter loads.
##### Steps
This is some JSON with the data nessesary for the chat interaction and status functions.  The syntax looks like this:
```
steps: [{
  chat: "Chat text that is printed",
  questsions: [
    { prompt: "text that will appear in question button",
      answer: "text that will appear in chat if button is pressed" }
    ... ],
  correct_question: 1,// this is optional, if it exists then the statusFunction should just return "false". 
  // This will set which question is correct and if that question button is pressed you move to the next step.
  statusFunction: 
    function(req, res){
      res.send("false");
      // this is a function that is run every second, if it returns "true" then the user will be moved to the next step.
    }
  }, ...
]
```

#### chapter_frontend.js
This is javaScript that is included in the frontend and run on page load, this is where you might use some of the endpoints you added in chapter_node.js.  You can use jQuery and what ever other libraries are currently installed.  You might have to add other libraries if they are needed.  If you don't require any additional frontend code this file should still exist and just have a comment in it.
    
#### Dockerfile
This needs a few things and you can add what ever you want to customize the container.

1. FROM node:7.10 - we start all our images from this image
2. ADD ./ ./app - we need the source code to be mounted at /app
3. WORKDIR /app - this is where execution should begin from
4. RUN npm install - need this to install all depends
5. RUN ln -s /app/chapter_extra/chapter_name /app/dynamic - this is used to load all chapter specific code.
6. EXPOSE, ENTRYPOINT and CMD - These should probably be the same accross all chapter images, unless you have a good reason to change them.  You can look at another chapter to see the values.

#### setup_user.sh
This is a simple bash script that is run to setup a new user when they sign up for the site.  It is run with the username as the argument.  eg. `./setup_user.sh bob`.  This is where you can add files to their home directory, or modify their .bashrc file, or what ever you can think of.  It must have executable permissions! And should have `#!/bin/bash` at the top.


