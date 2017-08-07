#!/bin/bash

user=$1

echo "export PROMPT_COMMAND='history -a'" >> /home/${user}/.bashrc

