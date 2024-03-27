FROM node:lts-alpine as build

RUN mkdir /app

COPY ./front-end /app/front-end

WORKDIR /app/front-end

RUN npm update
RUN npm install
RUN npm run build
FROM nginx:1.25.3

RUN rm -rf /var/www/html
RUN mkdir -p /etc/nginx/ssl

COPY --from=build /app/front-end/build /var/www/html
COPY --from=build  /app/front-end/build/static/css /var/www/html

COPY ./nginx/nginx_https.conf /etc/nginx/nginx_https.conf

COPY ./nginx/nginx_start.sh /etc/nginx/nginx_start.sh
RUN chmod +x /etc/nginx/nginx_start.sh

EXPOSE 8000

COPY ./nginx/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]
