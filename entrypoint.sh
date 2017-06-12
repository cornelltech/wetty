#!/bin/bash -ex
set -e
cmd="$@"

npm install

nohup /app/extra_procs.sh &

exec $cmd
