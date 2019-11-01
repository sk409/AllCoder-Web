<?php

namespace App\Utils;

use App\Folder;

class FileTreeIterator
{

    public static function iterate(string $path, $fileHandler, $folderHandler, string $order = "preorder")
    {
        $handle = function () use ($path, $fileHandler, $folderHandler) {
            if (is_file($path)) {
                $fileHandler($path);
            } else {
                $folderHandler($path);
            }
        };
        if ($order === "preorder") {
            $handle();
        }
        if (is_dir($path)) {
            $itemPaths = glob($path . '/{*,.[!.]*,..?*}', GLOB_BRACE);
            foreach ($itemPaths as $itemPath) {
                FileTreeIterator::iterate($itemPath, $fileHandler, $folderHandler);
            }
        }
        if ($order === "postorder") {
            $handle();
        }
    }

    public static function iterateFileTreeItem(
        $fileTreeItem,
        $fileHandler = null,
        $folderHandler = null,
        string $order = "preorder"
    ) {
        $handle = function () use ($fileTreeItem, $fileHandler, $folderHandler) {
            if ($fileTreeItem instanceof Folder) {
                if (!is_null($folderHandler)) {
                    $folderHandler($fileTreeItem);
                }
            } else {
                if (!is_null($fileHandler)) {
                    $fileHandler($fileTreeItem);
                }
            }
        };
        if ($order === "preorder") {
            $handle();
        }
        if ($fileTreeItem instanceof Folder) {
            foreach ($fileTreeItem->childFiles as $childFile) {
                FileTreeIterator::iterateFileTreeItem($childFile, $fileHandler, $folderHandler);
            }
            foreach ($fileTreeItem->childFolders as $childFolder) {
                FileTreeIterator::iterateFileTreeItem($childFolder, $fileHandler, $folderHandler);
            }
        }
        if ($order === "postorder") {
            $handle();
        }
    }
}
