FROM node:7.10

ADD ./ /app
COPY ./chapter_extra/sample/chapter_node.js /app/node/chapter_node.js
WORKDIR /app
RUN apt-get update
RUN apt-get install -y vim
RUN npm install
RUN ln -s /app/chapter_extra/sample /app/dynamic

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "app.js", "-p", "3000"]
