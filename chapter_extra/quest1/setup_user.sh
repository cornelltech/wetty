#!/bin/bash

user=$1

echo "export PROMPT_COMMAND='history -a'" >> /home/${user}/.bashrc

cp -r /app/chapter_extra/quest1/files /home/${user}/files
chown -R $user /home/${user}/files
