FROM node:7.10

ADD ./ /app
COPY ./chalenges/sample/frames.js /app/node/frames.js
WORKDIR /app
RUN apt-get update
RUN apt-get install -y vim
RUN useradd -d /home/term -m -s /bin/bash term
RUN echo 'term:term' | chpasswd
RUN echo "export PROMPT_COMMAND='history -a'" >> /home/term/.bashrc

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "app.js", "-p", "3000"]
