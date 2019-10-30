FROM php:7.3-fpm

RUN docker-php-ext-install pdo_mysql

COPY app /opt/app

RUN chmod -R 777 /opt/app/storage