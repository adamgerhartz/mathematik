FROM node:lts-alpine

RUN npm install -g http-server

WORKDIR /mathematik-app
COPY . /mathematik-app

RUN npm install
RUN npm run build

EXPOSE 8080
CMD ["http-server", "dist"]
