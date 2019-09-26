<?php

namespace App;

class Path
{

    public static function lesson(string $path): string
    {
        $homeDirectory = posix_getpwuid(posix_geteuid())['dir'];
        return "$homeDirectory/AllCoder/$path";
    }
}
