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
            $request,
            "\App\Folder::all",
            "\App\Folder::where"
        );
    }

    public function store(FolderCreationRequest $request)
    {
        $folder = Folder::create($request->all());
        return $folder->id;
    }

    public function destroy(Request $request, int $id)
    {
        Folder::destroy($id);
    }
}
