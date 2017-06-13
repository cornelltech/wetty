#!/bin/bash -ex
set -e
cmd="$@"

npm install

sudo -H -u term nohup /app/extra_procs.sh &

exec $cmd
