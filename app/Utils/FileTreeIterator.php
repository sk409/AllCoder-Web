<?php

namespace App\Utils;

class FileTreeIterator
{

    public static function iterate(string $dir, $fileHandler, $folderHandler)
    {
        $itemPaths = glob($dir . '/{*,.[!.]*,..?*}', GLOB_BRACE);
        foreach ($itemPaths as $itemPath) {
            if (is_file($itemPath)) {
                $fileHandler($itemPath);
            } else {
                $folderHandler($itemPath);
                FileTreeIterator::iterate($dir . "/" . basename($itemPath), $fileHandler, $folderHandler);
            }
        }
    }
}
