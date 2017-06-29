FROM node:7.10

ADD ./ /app
COPY ./chapters/quest1/extra_procs.sh /app/extra_procs.sh
WORKDIR /app
RUN apt-get update
RUN apt-get install -y vim sudo
RUN useradd -d /home/term -m -s /bin/bash term
RUN useradd -s /bin/bash hacker
RUN echo 'term:term' | chpasswd
RUN echo 'hacker:top_secret_pw' | chpasswd
RUN echo "export PROMPT_COMMAND='history -a'" >> /home/term/.bashrc
#RUN sed -i 's/npm install/npm install\nsudo -H -u term nohup \/app\/extra_procs.sh \&/' /app/entrypoint.sh
ADD ./chapters/quest1/files /home/term/files
RUN ln -s /app/chapters/quest1 /app/dynamic


EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "node/app.js", "-p", "3000"]
