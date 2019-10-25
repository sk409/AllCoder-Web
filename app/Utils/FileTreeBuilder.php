<?php

namespace App\Utils;

use App\Folder;
use App\File;

class FileTreeBuilder
{

    public static function build(string $dir, Folder $current)
    {
        $itemPaths = glob($dir . '/{*,.[!.]*,..?*}', GLOB_BRACE);
        $folders = [];
        $files = [];
        foreach ($itemPaths as $itemPath) {
            if (is_file($itemPath)) {
                $files[] = new File($itemPath, "");
            } else {
                $childFolder = new Folder($itemPath);
                FileTreeBuilder::build($dir . "/" . basename($itemPath), $childFolder);
                $folders[] = $childFolder;
            }
        }
        $current->children = array_merge($folders, $files);
    }
}
