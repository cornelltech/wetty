# wetty
Terminal in browser over http/https. (Ajaxterm/Anyterm alternative, but much better)

## Running locally

Running locally should be pretty easy, just follow these steps.
1. Install docker and docker_compose.
2. Run `docker-compose -f dev-compose.yml build`
3. Run `docker-compose -f dev-compose.yml up`
4. Make sure psql is installed locally and run ./auth/create_db.sh.  You will also need the postgres password that is in the docker-compose file.
5. Visit localhost:8000

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

### Steps to create a new chapter
1. Create the folder and files that are described above.
2. Add your chapter to dev-compose.yml, by mostly copying one of the other chapters.  Don't forget to set both the env var CHAPTER and the label wetty.chapter.  And change the dockerfile location.
3. Add the upstream to nginx.  For dev we'll edit nginx/dev/dev-nginx.conf.  Add a new upstream and a new location that points to the new upstream.
4. Modify the previous chapter with a link to enable this chapter.  You can copy the form from any other chapter that has a link to enable another chapter at the end.  All you need to change is the value of the input with name='chapter'.  The value should be the name of the new chapter.
5. Build and run all the containers with `docker-compose -f dev-compose.yml build` and `docker-compose -f dev-compose.yml up`.
6. Add this chapter to the database.  Just change the chapter_name in this command.  And add it to auth/create_db.sh for the next db setup.  `psql -h 127.0.0.1 -U postgres wetty -c "INSERT INTO chapters VALUES ('chapter_name', '{ \"hello\": \"some stuff\"}')"`
7. Add a line to auth/app.js the post('/signup') endpoint to add users when a new user signs up.  Around line 63 `  docker.add_user('sample', req.body.username, req.body.password);` where sample is the name of the chapter.
8. Finally create a new user and see if your chapter works correctly.
