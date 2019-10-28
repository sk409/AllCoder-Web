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
        return Path::user("ProMarc/$path");
    }

    public static function purchasedLessonOriginal($userId, $materialId, $lessonId, $path): string
    {
        return Path::purchasedLesson($userId, $materialId, $lessonId, "original", $path);
    }

    public static function purchasedLessonWork($userId, $materialId, $lessonId, $path): string
    {
        return Path::purchasedLesson($userId, $materialId, $lessonId, "work", $path);
    }

    private static function purchasedLesson($userId, $materialId, $lessonId, $switch, $path): string
    {
        return storage_path("app/public/purchased_materials/$userId/$materialId/$lessonId/$switch/$path");
    }
}
