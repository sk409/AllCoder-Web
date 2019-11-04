<?php

namespace App\Helpers;

class Helper
{
    public static function toAmountFormat(string $str): string
    {
        return "¥" . number_format($str);
    }
}
