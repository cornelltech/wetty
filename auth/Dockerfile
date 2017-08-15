FROM node:7.10

ADD ./ /app
WORKDIR /app
RUN apt-get update
RUN apt-get install -y vim
RUN npm install

EXPOSE 8888

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "auth/app.js"]
