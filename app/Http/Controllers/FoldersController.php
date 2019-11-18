<?php

namespace App\Http\Controllers;

use App\File;
use App\Folder;
use App\Lesson;
use App\Http\Requests\FolderCreationRequest;
use App\Utils\FileTreeBuilder;
use Illuminate\Http\Request;

class FoldersController extends Controller
{

    public function children(Request $request)
    {
        $request->validate([
            "lesson_id" => "required",
            "root" => "required",
        ]);
        $lesson = Lesson::find($request->lesson_id);
        $rootFolder = new Folder($request->root);
        $fileInfos = [];
        exec("docker container exec -it $lesson->docker_container_id ls -la $request->root/", $fileInfos);
        if (strpos($fileInfos[0], "Permission denied") !== false) {
            return "Permission denied";
        }
        if (strpos($fileInfos[0], "No such file or directory") !== false) {
            return "No such directory";
        }
        array_shift($fileInfos);
        $children = [];
        exec("docker container exec -it $lesson->docker_container_id ls -1a $request->root", $children);
        foreach ($children as $index => $child) {
            if (in_array($child, [".", ".."])) {
                continue;
            }
            $isDir = in_array(substr($fileInfos[$index], 0, 1), ["d", "l"], true);
            $newPath = $request->root === "/" ? "/$child" : "$request->root/$child";
            if ($isDir) {
                $rootFolder->childFolders[] = new Folder($newPath);
            } else {
                $rootFolder->childFiles[] = new File($newPath, "");
            }
        }
        return json_encode($rootFolder);
    }

    // public function tree(Request $request) {
    //     //return $request->all();
    //     $request->validate([
    //         "lesson_id" => "required",
    //         "root" => "required",
    //     ]);
    //     $lesson = Lesson::find($request->lesson_id);
    //     $iterator = function(string $path, $currentItem) use ($lesson) {
    //         $items = [];
    //         exec("docker container exec $lesson->docker_container_id ls $path", $items);
    //         // $childFiles = [];
    //         // $childFolders = [];
    //         // foreach($items as $item) {
    //         //     $newPath = "$path/$item";
    //         //     if (is_dir($item)) {
    //         //         $childFolder = new Folder($newPath);
    //         //         iterator($newPath, $childFolder);
    //         //         $childFolders[] = $childFolder;
    //         //     } else {
    //         //         $childFiles = new File($newPath);
    //         //     }
    //         // }
    //         // $currentItem->children = array_merge($childFolders, $childFiles);
    //     };
    //     $rootFolder = new Folder("");
    //     $iterator($request->root, $rootFolder);
    //     return json_encode($rootFolder);
    // }

    // private static function fileTree(string $dir, Folder $current)
    // {
    //     $itemPaths = glob($dir . '/{*,.[!.]*,..?*}', GLOB_BRACE);
    //     $folders = [];
    //     $files = [];
    //     foreach ($itemPaths as $itemPath) {
    //         if (is_file($itemPath)) {
    //             $files[] = new File($itemPath, "");
    //         } else {
    //             $childFolder = new Folder($itemPath);
    //             FoldersController::fileTree($dir . "/" . basename($itemPath), $childFolder);
    //             $folders[] = $childFolder;
    //         }
    //     }
    //     $current->children = array_merge($folders, $files);
    // }

    // public function index(Request $request)
    // {
    //     $rootFolder = new Folder("");
    //     FileTreeBuilder::build($request->path, $rootFolder);
    //     return json_encode($rootFolder);
    // }

    // public function store(FolderCreationRequest $request)
    // {
    //     $parameters = $request->all();
    //     if ($parameters["name"] === null) {
    //         $parameters["name"] = "";
    //     }
    //     $folder = Folder::create($parameters);
    //     return $folder->id;
    // }

    // public function update(Request $request, int $id)
    // {
    //     Folder::find($id)->fill($request->all())->save();
    // }

    // public function destroy(Request $request, int $id)
    // {
    //     Folder::destroy($id);
    // }
}
