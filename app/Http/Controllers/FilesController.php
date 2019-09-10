<?php

namespace App\Http\Controllers;

use App\File;
use App\Http\Requests\FileCreationRequest;
use Illuminate\Http\Request;

class FilesController extends Controller
{

    public function index(Request $request)
    {
        return Controller::narrowDownFromConditions(
            $request->all(),
            "\App\File:"
        );
    }

    public function store(FileCreationRequest $request)
    {
        $parameters = $request->all();
        if ($request->has("text") && is_null($request->text)) {
            $parameters["text"] = "";
        }
        $file = File::create($parameters);
        return $file->id;
    }

    public function update(Request $request, int $id)
    {
        $parameters = $request->all();
        if ($request->has("text") && is_null($request->text)) {
            $parameters["text"] = "";
        }
        File::find($id)->fill($parameters)->save();
    }

    public function destroy(Request $request, int $id)
    {
        File::destroy($id);
    }
}
