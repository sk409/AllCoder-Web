<?php

namespace App\Http\Controllers;

use App\File;
use App\Http\Requests\FileCreationRequest;
use Illuminate\Http\Request;

class FilesController extends Controller
{

    public function store(FileCreationRequest $request)
    {
        $parameters = $request->all();
        if ($request->has("text") && is_null($request->text)) {
            $parameters["text"] = "";
        }
        $file = File::create($parameters);
        return $file->id;
    }

    public function update(Request $request, int $id) {
        $parameters = $request->all();
        if ($request->has("text") && is_null($request->text)) {
            $parameters["text"] = "";
        }
        File::find($id)->fill($parameters)->save();
    }

    public function fetch(Request $request)
    {
        return Controller::narrowDownFromConditions(
            $request,
            File::all(),
            ["id", "name", "parent_folder_id", "lesson_id"]
        );
    }

}
