<?php

namespace App;

class EnvironmentBuilder
{

    private $user = "";
    private $dockerfile = "";


    public function __construct(string $user, string $os)
    {
        $this->user = $user;
        $this->dockerfile .= "FROM $os\n";
        $this->dockerfile .= "RUN useradd $user\n";
    }

    public function write(string $filename)
    {
        $this->dockerfile .= "USER $this->user";
        file_put_contents($filename, $this->dockerfile);
    }

    public function laravel(string $version): EnvironmentBuilder
    {
        switch ($version) {
            case "5.7":
                $this->dockerfile .= <<<EOM
RUN yum install -y epel-release \
    && rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-7.rpm \
    && yum install -y --enablerepo=remi,remi-php73 php php-devel php-mbstring php-pdo php-gd php-xml php-mcrypt php-pecl-zip \
    && curl -sS https://getcomposer.org/installer | php \
    && mv composer.phar /usr/local/bin/composer \
    && composer global require "laravel/installer"\n
EOM;
        }
        return $this;
    }

    public function mysql(string $version, string $user, string $password, string $port): EnvironmentBuilder
    {
        switch ($version) {
            case "5.7.28":
                $this->dockerfile .= <<<EOM
RUN yum localinstall -y http://dev.mysql.com/get/mysql57-community-release-el7-7.noarch.rpm \
    && yum install -y mysql-community-server \
    && chown -hR $this->user:$this->user /var/log/mysqld.log \
    && chown -hR $this->user:$this->user /var/lib/mysql \
    && chown -hR $this->user:$this->user /var/run/mysqld
USER $this->user
RUN mysqld --initialize --user=$this->user \
    && mysqld & sleep 10 \
    && mysqladmin password $password -u root -p$(cat /var/log/mysqld.log | grep root | awk '{print substr(substr($0, index($0, "localhost:")), 12)}') \
    && mysql -u root -p$password -e'RENAME USER root@localhost to $user@localhost'
USER root\n
EOM;
        }
        return $this;
    }
}
