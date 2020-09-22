FROM php:7.4-cli

WORKDIR /usr/src/app

COPY ./api/php .

RUN curl -sS https://getcomposer.org/installer | php

RUN php composer.phar install

COPY ./public ./public

EXPOSE 9001

CMD php -S 0.0.0.0:9001 -t ./public app.php
