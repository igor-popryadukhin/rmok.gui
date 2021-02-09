# этап сборки (build stage)
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# этап production (production-stage)
FROM nginx:latest as nginx-stage
WORKDIR /www
COPY --from=build-stage /app/dist .

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/fastcgi.conf /etc/nginx/fastcgi.conf
COPY ./nginx/vhost.conf /etc/nginx/sites-enabled/vhost.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
