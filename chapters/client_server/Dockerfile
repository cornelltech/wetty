FROM node:7.10

ADD ./ /app
COPY ./chapters/client_server/chapter_node.js /app/node/chapter_node.js
COPY ./chapters/client_server/chapter_frontend.js /app/node/chapter_frontend.js
WORKDIR /app
RUN apt-get update
RUN apt-get install -y vim
RUN useradd -d /home/term -m -s /bin/bash term
RUN echo 'term:term' | chpasswd
RUN echo "export PROMPT_COMMAND='history -a'" >> /home/term/.bashrc
COPY ./chapters/client_server/files/website.txt /home/term/website.txt
COPY ./chapters/client_server/files/date.txt /var/www/date.txt
RUN chmod 777 /var/www/date.txt

EXPOSE 3000
EXPOSE 5858

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "node/app.js", "-p", "3000"]
