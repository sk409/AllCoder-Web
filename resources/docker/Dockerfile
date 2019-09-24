### When changing the name of the app, it will also be reflected in the nginx configuration file

FROM mysql:8

# nginx, php-fpm
RUN apt update
RUN apt install -y vim
RUN apt install -y wget
RUN wget http://nginx.org/keys/nginx_signing.key
RUN apt-key add nginx_signing.key
RUN sh -c 'echo "deb http://nginx.org/packages/debian/ stretch nginx" > /etc/apt/sources.list.d/nginx.list'
RUN sh -c 'echo "deb-src http://nginx.org/packages/debian/ stretch nginx" >> /etc/apt/sources.list.d/nginx.list'
RUN apt install -y apt-transport-https lsb-release ca-certificates
RUN apt install -y curl
RUN curl -ssL -o /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
RUN sh -c 'echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/php.list'
RUN apt update
RUN apt install -y php7.3 php7.3-fpm php7.3-mysql php7.3-mbstring php7.3-xml php7.3-gd php7.3-curl php7.3-zip
RUN apt install -y nginx

# laravel
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php -r "if (hash_file('sha384', 'composer-setup.php') === 'a5c698ffe4b8e849a443b120cd5ba38043260d5c4023dbf93e1558871f1f07f58274fc6f4c93bcfd858c6bd0775cd8d1') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
RUN php composer-setup.php
RUN php -r "unlink('composer-setup.php');"
RUN mv composer.phar /usr/local/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER 1
ENV COMPOSER_HOME /composer
ENV PATH $PATH:/composer/vendor/bin
WORKDIR /opt/app
RUN composer create-project --prefer-dist laravel/laravel my_app
RUN sed -e 's/DB_PASSWORD=/DB_PASSWORD=root/g' ./my_app/.env > ./my_app/.env_tmp
RUN cp -f ./my_app/.env_tmp ./my_app/.env
RUN rm -f ./my_app/.env_tmp

#gotty
RUN wget -qO- https://github.com/yudai/gotty/releases/download/v0.0.12/gotty_linux_amd64.tar.gz | tar zx -C /usr/local/bin/

ENV MYSQL_DATABASE=laravel
# ENV MYSQL_USER=root
#ENV MYSQL_PASSWORD=root
ENV MYSQL_ROOT_PASSWORD=root

COPY os/opt/scripts/startup.sh /opt/scripts/startup.sh
COPY os/opt/app /opt/app
COPY os/etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY os/etc/php/7.3/fpm/pool.d/www.conf /etc/php/7.3/fpm/pool.d/www.conf
COPY os/etc/mysql/conf.d/my.cnf /etc/mysql/conf.d/my.cnf

#CMD ["/opt/scripts/cmd.sh"]

