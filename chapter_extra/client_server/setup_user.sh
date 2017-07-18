#!/bin/bash

user=$1

echo "export PROMPT_COMMAND='history -a'" >> /home/${user}/.bashrc
echo "Website directory:  /tmp/${user}/website/" > /home/$user/website.txt
mkdir -p /tmp/${user}/website
cp /app/chapter_extra/client_server/files/date.txt /tmp/${user}/website/date.txt
chown -R $user /tmp/$user/website
