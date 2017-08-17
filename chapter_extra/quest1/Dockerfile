FROM node:7.10-alpine

ADD ./ /app
COPY ./chapter_extra/quest1/extra_procs.sh /app/extra_procs.sh
WORKDIR /app
# RUN apt-get update
# RUN apt-get install -y vim sudo
#RUN useradd -d /home/term -m -s /bin/bash term
#RUN echo 'term:term' | chpasswd
RUN apk add --no-cache make gcc g++ python && \
  npm install && \
  apk del make gcc g++ python
RUN apk add --no-cache bash
RUN ln -s /app/chapter_extra/quest1 /app/dynamic

RUN ls -la /bin/bash


EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "chapter_base/app.js", "-p", "3000"]
