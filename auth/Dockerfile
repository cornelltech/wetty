FROM node:latest

ADD ./ /app
WORKDIR /app
RUN apt-get update
RUN apt-get install -y vim

EXPOSE 8888

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "app.js"]
