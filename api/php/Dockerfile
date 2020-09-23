FROM composer:2

WORKDIR /usr/src/app

COPY ./api/php .

RUN composer install

COPY ./public ./public

EXPOSE 9001

CMD php -S 0.0.0.0:9001 -t ./public app.php
