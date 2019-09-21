<?php

namespace App\Http\Controllers;

use App\Folder;
use App\Http\Requests\FolderCreationRequest;
use Illuminate\Http\Request;

class FoldersController extends Controller
{

    public function index(Request $request)
    {
        return Controller::narrowDownFromConditions(
            $request->all(),
            "\App\Folder"
        );
    }

    public function store(FolderCreationRequest $request)
    {
        $parameters = $request->all();
        if ($parameters["name"] === null) {
            $parameters["name"] = "";
        }
        //return $parameters;
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
