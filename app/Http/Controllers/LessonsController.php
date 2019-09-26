<?php

namespace App\Http\Controllers;

use Auth;
use Illuminate\Support\Facades\File;
use App\Http\Requests\LessonCreationRequest;
use App\Lesson;
use App\Path;
use App\Port;
use Illuminate\Contracts\Support\Renderable;

class LessonsController extends Controller
{

    public function create(): Renderable
    {
        $lesson = new Lesson();
        return view("lessons.create", [
            "lesson" => $lesson,
            "user" => Auth::user(),
        ]);
    }

    public function store(LessonCreationRequest $request)
    {
        $uniqueName = "all_coder_" . uniqid();
        $composeDirectoryPath = resource_path("docker/" . $uniqueName);
        File::makeDirectory($composeDirectoryPath);
        $composePath = $composeDirectoryPath . "/docker-compose.yml";
        File::copy(resource_path("docker/docker-compose.yml"), $composePath);
        File::copy(resource_path("docker/Dockerfile"), $composeDirectoryPath . "/Dockerfile");
        $appDirectoryPath = Path::lesson("$uniqueName");
        $originalPath = Path::lesson("originals/laravel/5.8");
        exec("cp -r $originalPath/ $appDirectoryPath/");
        $composeProjectName = "all_coder_$uniqueName";
        File::put($composeDirectoryPath . "/.env", "VOLUME=$appDirectoryPath\nCOMPOSE_PROJECT_NAME=$composeProjectName");
        $osPath = resource_path("docker/os");
        exec("cp -r $osPath $composeDirectoryPath");
        exec("cd $composeDirectoryPath && docker-compose build");
        $containerName = $composeProjectName . "_develop-lesson_1";
        $parameters = $request->all();
        $parameters["container_name"] = $containerName;
        $parameters["app_directory_path"] = $appDirectoryPath;
        $parameters["compose_directory_path"] = $composeDirectoryPath;
        $lesson = Lesson::create($parameters);
        return redirect("/development/{$lesson->id}");
    }
}
