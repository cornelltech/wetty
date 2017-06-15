#!/bin/bash -ex

file=/home/term/countdown.txt


for i in `seq 300 -1 0`; do
  echo $i > $file
  sleep 1
done

echo 'boom!!' > $file
