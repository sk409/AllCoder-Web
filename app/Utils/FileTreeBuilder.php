<?php

namespace App\Utils;

use App\Folder;
use App\File;

class FileTreeBuilder
{

    public static function build(string $dir, Folder $current, bool $withText = false, array $options = [])
    {
        $dir = rtrim($dir, "/");
        $itemPaths = glob($dir . '/{*,.[!.]*,..?*}', GLOB_BRACE);
        foreach ($itemPaths as $itemPath) {
            if (is_file($itemPath)) {
                $text = $withText ? file_get_contents($itemPath) : "";
                $converted = mb_convert_encoding($text, 'UTF-8', 'UTF-8');
                $option = null;
                foreach ($options as $o) {
                    if ($itemPath === $o->path) {
                        $option = $o;
                        break;
                    }
                }
                $current->childFiles[] = new File($itemPath, $converted, $option);
            } else {
                $childFolder = new Folder($itemPath);
                FileTreeBuilder::build($dir . "/" . basename($itemPath), $childFolder, $withText, $options);
                $current->childFolders[] = $childFolder;
            }
        }
    }
}
