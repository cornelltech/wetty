#!/bin/bash
set -e
cmd="$@"

npm install

exec $cmd
