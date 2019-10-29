<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FilesController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            "path" => "required",
            "text" => "required",
        ]);
        file_put_contents($request->path, $request->text);
    }
}
