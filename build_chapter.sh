#!/bin/bash -ex

chapter=$1

docker build -t wetty -f ./chapters/${chapter}/Dockerfile .

rm -f ./node/chapter_node.js
ln -s /app/chapters/${chapter}/chapter_node.js ./node/chapter_node.js
rm -f ./node/public/chapter_frontend.js
ln -s /app/chapters/${chapter}/chapter_frontend.js ./node/public/chapter_frontend.js
#if [ -f ./chapters/${chapter}/extra_procs.sh ]; then
#  rm -f ./extra_procs.sh
#  ln -s /app/chapters/${chapter}/extra_procs.sh ./extra_procs.sh
#fi

exec docker run -it -p 3000:3000 -v $(pwd)/node:/app/node -v $(pwd)/chapters:/app/chapters wetty './start_app.sh'
