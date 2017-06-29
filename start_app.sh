#!/bin/bash

echo $CHAPTER


npm install nodemon -g
nodemon node/app.js -p 3000 

#npm install -g node-inspector
#node-debug --web-host 0.0.0.0 -p 8000 node/app.js -p 3000
