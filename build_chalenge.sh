#!/bin/bash -ex

chalenge=$1

docker build -t wetty -f ./chalenges/${chalenge}/Dockerfile .

rm -f ./node/frames.js
ln -s /app/chalenges/${chalenge}/frames.js ./node/frames.js
if [ -f ./chalenges/${chalenge}/extra_procs.sh ]; then
  rm -f ./extra_procs.sh
  ln -s /app/chalenges/${chalenge}/extra_procs.sh ./extra_procs.sh
fi

exec docker run -it -p 3000:3000 -v $(pwd):/app wetty './start_app.sh'
