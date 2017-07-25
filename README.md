# wetty
Terminal in browser over http/https. (Ajaxterm/Anyterm alternative, but much better)

## Developing

The code is pretty modular with the idea of making it easy for people to build their own chapters.  
Each chapter is run on a separate docker container.  There is also an additional container for nginx and the login/auth.

### Directory structure
/shared - code that is shared among all containers and builds
/chapter_extra - add on code just for chapters
/auth - base code for authenticator
/nginx - nginx config code
/chapter_base - base code for all chapters


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
##### require anything needed in this file
##### module.exports
We use the node syntax for including files, so everything that will be used elsewhere should be in the module.exports 
dictionary.
##### chapter_name
A simple string of the name of this chapter.
##### endpoints
This is a function that accepts the application as a parameter.
This can be used to add new backend endpoint to the app.  You could also get creative and do all sort of stuff,
this is run when the chapter loads.
##### steps
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
    
