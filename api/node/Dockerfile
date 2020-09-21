FROM node:12

WORKDIR /usr/src/app

COPY ./api/node .

RUN npm install

COPY ./public ./public

EXPOSE 9001

CMD ["node", "app.js"]
