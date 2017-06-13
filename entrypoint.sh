#!/bin/bash -ex
set -e
cmd="$@"

npm install

exec $cmd
