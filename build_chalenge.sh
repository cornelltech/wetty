#!/bin/bash -ex

chalenge=$1

docker build -t wetty -f ./chalenges/${chalenge}/Dockerfile .

rm -f ./node/frames.js
ln -s /app/chalenges/${chalenge}/frames.js ./node/frames.js

exec docker run -it -p 3000:3000 -v $(pwd):/app wetty './start_app.sh'
