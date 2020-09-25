FROM node:12

WORKDIR /usr/src/app

COPY ./api/node ./node

RUN cd ./node && npm install

COPY ./public ./public

EXPOSE 9001

CMD node node/app.js
