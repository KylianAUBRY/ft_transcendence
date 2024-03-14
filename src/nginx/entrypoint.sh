#!/bin/bash
if [ "$DJANGO_PROTOCOL" = "https" ]; then
    mv /etc/nginx/nginx_https.conf /etc/nginx/nginx.conf
    /etc/nginx/nginx_start.sh
fi

if [ "$DJANGO_PROTOCOL" = "http" ]; then
    mv /etc/nginx/nginx_http.conf /etc/nginx/nginx.conf
    echo "log : http started "
fi

exec nginx -g 'daemon off;'
