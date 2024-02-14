FROM node:lts-alpine as build
WORKDIR /var/srv
COPY ./package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine as production
COPY --from=build /var/srv/dist .
COPY --from=build /var/srv/package.json .
COPY --from=build /var/srv/package-lock.json .
RUN npm ci --omit dev
CMD ["node", "."]