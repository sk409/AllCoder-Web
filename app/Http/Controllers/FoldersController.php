<?php

namespace App\Http\Controllers;

use App\Folder;
use App\Http\Requests\FolderCreationRequest;
use Illuminate\Http\Request;

class FoldersController extends Controller
{

    public function store(FolderCreationRequest $request) {
        $folder = Folder::create($request->all());
        return $folder->id;
    }

    public function fetch(Request $request) {
        return Controller::narrowDownFromConditions(
            $request,
            Folder::all(),
            ["id", "name", "parent_folder_id", "lesson_id"]
        );
    }

}
