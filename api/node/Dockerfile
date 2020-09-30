FROM node:12

WORKDIR /usr/src/app

COPY ./api/node ./node
COPY ./public ./public

EXPOSE 9001

CMD cd node && npm install && node app.js
