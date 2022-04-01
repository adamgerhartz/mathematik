FROM node:lts-alpine

WORKDIR /mathematik-app
COPY . /mathematik-app

RUN npm install --registry https://registry.npmjs.org
RUN npm run build

EXPOSE 3000
CMD ["node", "server.js"]
