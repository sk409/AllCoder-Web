<?php

namespace App;

class Path
{

    public static function user(string $path): string
    {
        $homeDirectory = posix_getpwuid(posix_geteuid())['dir'];
        return "$homeDirectory/$path";
    }

    public static function app(string $path): string
    {
        return Path::user("AllCoder/$path");
    }
}
