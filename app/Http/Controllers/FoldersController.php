<?php

namespace App\Http\Controllers;

use App\Folder;
use App\Http\Requests\CreateFolderRequest;
use Illuminate\Http\Request;

class FoldersController extends Controller
{

    public function store(CreateFolderRequest $request) {
        $folder = Folder::create($request->all());
        return $folder->id;
    }

    public function fetch(Request $request) {
        $folders = Folder::all();
        if ($request->has("id")) {
            $folders = $folders->where("id", $request->id);
        } else {
            if ($request->has("name")) {
                $folders = $folders->where("name", $request->name);
            }
            if ($request->has("parent_folder_id")) {
                $folders = $folders->where("parent_folder_id", $request->parent_folder_id);
            }
            if ($request->has("lesson_id")) {
                $folders = $folders->where("lesson_id", $request->lesson_id);
            }
        }
        return $folders;
    }

}
