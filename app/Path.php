<?php

namespace App;

class Path
{

    public static function delimiter(): string
    {
        // TODO: OSによってデリミタを区別する
        return "/";
    }

    public static function trim(string $path): string
    {
        return Path::ltrim(Path::rtrim($path));
    }

    public static function ltrim(string $path): string
    {
        $delimiter = Path::delimiter();
        return ltrim($path, $delimiter);
    }

    public static function rtrim(string $path): string
    {
        $delimiter = Path::delimiter();
        return rtrim($path, $delimiter);
    }

    public static function append(string $l, string $r): string
    {
        $delimiter = Path::delimiter();
        return Path::rtrim($l) . $delimiter . Path::ltrim($r);
    }

    public static function user(string $path): string
    {
        $homeDirectory = posix_getpwuid(posix_geteuid())['dir'];
        return "$homeDirectory/$path";
    }

    public static function app(string $path): string
    {
        return Path::user("ProMarc/$path");
    }

    public static function purchasedLesson($userId, $materialId, $lessonId, $path): string
    {
        return storage_path("app/public/purchased_materials/$userId/$materialId/$lessonId/$path");
    }

    public static function purchasedLessonOriginal($userId, $materialId, $lessonId, $path): string
    {
        return Path::purchasedLesson($userId, $materialId, $lessonId, "original/" . $path);
    }

    public static function purchasedLessonWork($userId, $materialId, $lessonId, $path): string
    {
        return Path::purchasedLesson($userId, $materialId, $lessonId, "work/" . $path);
    }

    public static function purchasedLessonOptions($userId, $materialId, $lessonId, $path): string
    {
        return Path::purchasedLesson($userId, $materialId, $lessonId, "options/" . $path);
    }
}
