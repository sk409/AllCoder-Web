<?php

namespace App\Http\Controllers;

use Auth;
use Illuminate\Support\Facades\File;
use App\Http\Requests\LessonCreationRequest;
use App\Lesson;
use App\Path;
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
        $hostAppDirectoryPath = Path::app("$uniqueName");
        $originalPath = Path::app("originals/laravel/5.8");
        exec("cp -r $originalPath/ $hostAppDirectoryPath/");
        $containerAppDirectoryPath = "/opt/app";
        $hostLogsDirectoryPath = Path::app("logs/$uniqueName");
        $containerLogsDirectoryPath = "/etc/AllCoder/logs";
        $composeProjectName = "all_coder_$uniqueName";
        File::put($composeDirectoryPath . "/.env", "HOST_APP_DIRECTORY_PATH=$hostAppDirectoryPath\nHOST_LOGS_DIRECTORY_PATH=$hostLogsDirectoryPath\nCONTAINER_APP_DIRECTORY_PATH=$containerAppDirectoryPath\nCONTAINER_LOGS_DIRECTORY_PATH=$containerLogsDirectoryPath\nCOMPOSE_PROJECT_NAME=$composeProjectName");
        $osPath = resource_path("docker/os");
        exec("cp -r $osPath $composeDirectoryPath");
        exec("cd $composeDirectoryPath && docker-compose build");
        $containerName = $composeProjectName . "_develop-lesson_1";
        $parameters = $request->all();
        $parameters["container_name"] = $containerName;
        $parameters["host_app_directory_path"] = $hostAppDirectoryPath;
        $parameters["host_logs_directory_path"] = $hostLogsDirectoryPath;
        $parameters["container_app_directory_path"] = $containerAppDirectoryPath;
        $parameters["container_logs_directory_path"] = $containerLogsDirectoryPath;
        $parameters["compose_directory_path"] = $composeDirectoryPath;
        $lesson = Lesson::create($parameters);
        return redirect("/development/{$lesson->id}");
    }

    public function delta(int $id)
    {
        $lesson = Lesson::find($id);
        $logPath = "$lesson->host_logs_directory_path/app_changes.txt";
        $appChanges = File::get($logPath, true);
        File::put($logPath, "");
        $pattern = "/(\\/opt\\/app\\/.*?) (CREATE|DELETE|MODIFY)(,ISDIR)? (.*)/u";
        preg_match_all($pattern, $appChanges, $matches);
        return $matches;
    }
}
