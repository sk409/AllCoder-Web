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

    public static function append($l, $r): string
    {
        $delimiter = Path::delimiter();
        return Path::rtrim($l) . $delimiter . Path::ltrim($r);
    }

    public static function user(string $path): string
    {
        $homeDirectory = posix_getpwuid(posix_geteuid())['dir'];
        return "$homeDirectory/$path";
    }

    public static function lesson(string $path = ""): string
    {
        return storage_path("app/lessons/$path");
    }

    public static function lessonQuestion($lessonId, string $path = ""): string
    {
        return Path::lesson(Path::append($lessonId, Path::append("questions", $path)));
    }

    public static function lessonOriginals($path): string
    {
        return Path::lesson(Path::append("originals", $path));
    }

    public static function purchasedLesson($userId, $materialId, $lessonId, $path = ""): string
    {
        return storage_path("app/purchased_materials/$userId/$materialId/$lessonId/$path");
    }

    public static function purchasedLessonOriginal($userId, $materialId, $lessonId, $path = ""): string
    {
        return Path::purchasedLesson($userId, $materialId, $lessonId, Path::append("original", $path));
    }

    // public static function purchasedLessonWork($userId, $materialId, $lessonId, $path): string
    // {
    //     return Path::purchasedLesson($userId, $materialId, $lessonId, "work/" . $path);
    // }

    public static function purchasedLessonMobile($userId, $materialId, $lessonId, $path = ""): string
    {
        return Path::purchasedLesson($userId, $materialId, $lessonId, Path::append("mobile", $path));
    }

    public static function purchasedLessonWeb($userId, $materialId, $lessonId, $path = ""): string
    {
        return Path::purchasedLesson($userId, $materialId, $lessonId, Path::append("web", $path));
    }

    public static function purchasedLessonOptions($userId, $materialId, $lessonId, $path = ""): string
    {
        return Path::purchasedLessonMobile($userId, $materialId, $lessonId, Path::append("options", $path));
    }

    // public static function docker($path): string
    // {
    //     return Path::append(resource_path("docker"), $path);
    // }

    // public static function dockerDevelopment($path = ""): string
    // {
    //     return Path::docker(Path::append("development", $path));
    // }

    // // TODO: 修正
    // public static function preview($path): string
    // {
    //     return Path::docker("preview/$path");
    // }
}
