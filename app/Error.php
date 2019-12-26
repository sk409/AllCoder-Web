<?php

namespace App;

class Error
{

    public static function notFound()
    {
        abort("404");
    }

    public static function badRequest()
    {
        abort(400);
    }
}
