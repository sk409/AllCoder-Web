FROM centos:7
RUN useradd promark
RUN yum localinstall -y http://dev.mysql.com/get/mysql57-community-release-el7-7.noarch.rpm \
    && yum install -y mysql-community-server \
    && chown -hR promark:promark /var/log/mysqld.log \
    && chown -hR promark:promark /var/lib/mysql \
    && chown -hR promark:promark /var/run/mysqld
USER promark
RUN mysqld --initialize --user=promark \
    && mysqld & sleep 10 \
    && mysqladmin password promarkpassword -u root -p$(cat /var/log/mysqld.log | grep root | awk '{print substr(substr($0, index($0, "localhost:")), 12)}') \
    && mysql -u root -ppromarkpassword -e'RENAME USER root@localhost to promarkuser@localhost'
USER root
RUN yum install -y epel-release \
    && rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-7.rpm \
    && yum install -y --enablerepo=remi,remi-php73 php php-devel php-mbstring php-pdo php-gd php-xml php-mcrypt php-pecl-zip \
    && curl -sS https://getcomposer.org/installer | php \
    && mv composer.phar /usr/local/bin/composer \
    && composer global require "laravel/installer"
USER promark