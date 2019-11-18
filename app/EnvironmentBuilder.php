<?php

namespace App;

// TODO: CentOS以外にも対応する(現状はyumを使用している)
class EnvironmentBuilder
{

    private $user = "";
    private $dockerfile = "";


    public function __construct(string $user, string $os, array $ports)
    {
        $this->user = $user;
        $this->dockerfile .= "FROM $os\n";
        $this->dockerfile .= "RUN useradd $user\n";
        $this->dockerfile .= <<<EOM
RUN yum -y install wget \
    && wget -qO- https://github.com/yudai/gotty/releases/download/v0.0.12/gotty_linux_amd64.tar.gz | tar zx -C /usr/local/bin/ \
    && yum -y remove wget\n
EOM;
        if ($ports) {
            $this->dockerfile .= "EXPOSE";
            foreach ($ports as $port) {
                if (is_numeric($port) && is_int($port)) {
                    continue;
                }
                $this->dockerfile .= " $port";
            }
            $this->dockerfile .= "\n";
        }
    }

    public function end()
    {
        $this->dockerfile .= "USER $this->user";
    }

    public function write(string $dir, string $filename = "Dockerfile")
    {
        file_put_contents(Path::append($dir, $filename), $this->dockerfile);
    }

    public function laravel(string $version): EnvironmentBuilder
    {
        // TODO: 他の環境にPHPが指定された場合を考慮する
        switch ($version) {
            case "5.7":
                $this->dockerfile .= <<<EOM
RUN yum install -y epel-release \
    && rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-7.rpm \
    && yum install -y --enablerepo=remi,remi-php73 php php-devel php-mbstring php-pdo php-gd php-xml php-mcrypt php-pecl-zip php-mysqlnd \
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
    && mysqladmin password $password -u root -p$(cat /var/log/mysqld.log | grep root | awk '{print substr(substr($0, index($0, "localhost:")), 12)}')
EOM;
                if ($user !== "root") {
                    $this->dockerfile .= " \\\n    && mysql -u root -p$password -e'RENAME USER root@localhost to $user@localhost'\n";
                } else {
                    $this->dockerfile .= "\n";
                }
                $this->dockerfile .= "USER root\n";
        }
        return $this;
    }
}
