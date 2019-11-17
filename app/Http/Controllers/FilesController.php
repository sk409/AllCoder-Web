<?php

namespace App\Http\Controllers;

use App\File;
use App\Lesson;
use App\Http\Requests\FileCreationRequest;
use Illuminate\Http\Request;

class FilesController extends Controller
{

    public function index(Request $request)
    {
        $request->validate([
            "path" => "required",
            "lesson_id" => "required",
        ]);
        $lesson = Lesson::find($request->lesson_id);
        $outputs = [];
        //return "docker container exec -it $lesson->container_id cat $request->path";
        exec("docker container exec -it $lesson->container_id cat $request->path", $outputs);
        $file = new File($request->path, implode("\n", $outputs));
        return json_encode($file);
    }

    // public function store(FileCreationRequest $request)
    // {
    //     $parameters = $request->all();
    //     if ($request->has("text") && is_null($request->text)) {
    //         $parameters["text"] = "";
    //     }
    //     $file = File::create($parameters);
    //     return $file->id;
    // }

    // public function update(Request $request, int $id)
    // {
    //     $parameters = $request->all();
    //     if ($request->has("text") && is_null($request->text)) {
    //         $parameters["text"] = "";
    //     }
    //     File::find($id)->fill($parameters)->save();
    // }

    public function update(Request $request)
    {
        // return $request->all();
        // $request->validate([
        //     "path" => "required",
        //     "text" => "required",
        //     "lesson_id" => "required"
        // ]);
        $lesson = Lesson::find($request->lesson_id);
        $tmpFilePath = storage_path(uniqid());
        file_put_contents($tmpFilePath, $request->text);
        exec("docker container cp $tmpFilePath $lesson->container_id:$request->path");
        unlink($tmpFilePath);
        //\Illuminate\Support\Facades\File::put($request->path, $request->text, true);
    }

    // public function destroy(Request $request, int $id)
    // {
    //     File::destroy($id);
    // }
}
