FROM node:lts-alpine as build
WORKDIR /var/srv
COPY ./package*.json .
RUN npm install
COPY . .