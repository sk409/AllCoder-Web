<?php

namespace App\Utils;

use App\Folder;

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

    public static function iterateFolder(Folder $folder, $fileHandler = null, $folderHandler = null)
    {
        if (!is_null($folderHandler)) {
            $folderHandler($folder);
        }
        if (!is_null($fileHandler)) {
            foreach ($folder->childFiles as $childFile) {
                $fileHandler($childFile);
            }
        }
        if (!is_null($folderHandler)) {
            foreach ($folder->childFolders as $childFolder) {
                $folderHandler($childFolder);
            }
        }
        foreach ($folder->childFolders as $childFolder) {
            FileTreeIterator::iterateFolder($childFolder, $fileHandler, $folderHandler);
        }
    }
}
