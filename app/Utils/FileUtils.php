<?php

namespace App\Utils;

class FileUtils
{

    public static function copy(string $src, string $dst)
    {
        $makePath = function ($path) use ($src, $dst) {
            return $dst . substr($path, strlen($src));
        };
        $fileHandler = function ($path) use ($makePath) {
            file_put_contents($makePath($path), file_get_contents($path));
        };
        $folderHandler = function ($path) use ($makePath) {
            mkdir($makePath($path));
        };
        FileTreeIterator::iterate($src, $fileHandler, $folderHandler);
    }
}
