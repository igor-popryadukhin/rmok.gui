FROM nginx:latest

COPY ./*.conf /etc/nginx/
COPY ./sites-enabled/*.conf /etc/nginx/sites-enabled/

COPY ./ssl/nginx-selfsigned.crt /etc/ssl/certs/
COPY ./ssl/nginx-selfsigned.key /etc/ssl/private/
COPY ./ssl/dhparam.pem /etc/ssl/certs/

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
