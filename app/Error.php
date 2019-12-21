<?php

namespace App;

class Error
{

    public static function notFound()
    {
        abort("404");
    }
}
