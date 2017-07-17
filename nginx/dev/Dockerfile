FROM nginx:latest

RUN apt-get update \
    && apt-get install -y procps
ADD dev-nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]

