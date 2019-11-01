<?php

namespace App\Utils;

class FileUtils
{

    public static function copy(string $src, string $dst)
    {
        // echo $src . "\n";
        // echo $dst . "\n\n";
        $makePath = function ($path) use ($src, $dst) {
            return $dst . substr($path, strlen($src));
        };
        $fileHandler = function ($path) use ($makePath) {
            if (file_exists($makePath($path))) {
                return;
            }
            file_put_contents($makePath($path), file_get_contents($path));
        };
        $folderHandler = function ($path) use ($makePath) {
            if (file_exists($makePath($path))) {
                return;
            }
            //echo $makePath($path) . "\n\n";
            mkdir($makePath($path));
        };
        FileTreeIterator::iterate($src, $fileHandler, $folderHandler);
    }
}
