<?php

namespace App\Http\Controllers;

use App\File;
use App\Folder;
use App\Http\Requests\FolderCreationRequest;
use Illuminate\Http\Request;

class FoldersController extends Controller
{

    private static function fileTree(string $dir, Folder $current)
    {
        $itemPaths = glob($dir . '/{*,.[!.]*,..?*}', GLOB_BRACE);
        $folders = [];
        $files = [];
        foreach ($itemPaths as $itemPath) {
            if (is_file($itemPath)) {
                $files[] = new File($itemPath, "");
            } else {
                $childFolder = new Folder($itemPath);
                FoldersController::fileTree($dir . "/" . basename($itemPath), $childFolder);
                $folders[] = $childFolder;
            }
        }
        $current->children = array_merge($folders, $files);
    }

    public function index(Request $request)
    {
        $rootFolder = new Folder("");
        FoldersController::fileTree($request->path, $rootFolder);
        return json_encode($rootFolder);
    }

    public function store(FolderCreationRequest $request)
    {
        $parameters = $request->all();
        if ($parameters["name"] === null) {
            $parameters["name"] = "";
        }
        $folder = Folder::create($parameters);
        return $folder->id;
    }

    public function update(Request $request, int $id)
    {
        Folder::find($id)->fill($request->all())->save();
    }

    public function destroy(Request $request, int $id)
    {
        Folder::destroy($id);
    }
}
