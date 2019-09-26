#!/bin/bash
/etc/init.d/php7.3-fpm start
nginx
gotty -w bash