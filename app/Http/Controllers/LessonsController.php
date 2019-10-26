<?php

namespace App\Http\Controllers;

use App\Http\Requests\LessonCreationRequest;
use App\Lesson;
use App\Path;
use Auth;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class LessonsController extends Controller
{

    public function index(Request $request)
    {
        return Controller::narrowDownFromConditions(
            $request->all(),
            "\App\Lesson"
        );
    }

    public function create(): Renderable
    {
        $lesson = new Lesson();
        return view("lesson_create", [
            "lesson" => $lesson,
            "user" => Auth::user(),
        ]);
    }

    public function store(LessonCreationRequest $request)
    {
        $uniqueName = "pro_marc" . uniqid();
        $composeDirectoryPath = resource_path("docker/" . $uniqueName);
        File::makeDirectory($composeDirectoryPath);
        $composePath = $composeDirectoryPath . "/docker-compose.yml";
        File::copy(resource_path("docker/docker-compose.yml"), $composePath);
        File::copy(resource_path("docker/Dockerfile"), $composeDirectoryPath . "/Dockerfile");
        $originalPath = Path::app("originals/Laravel/5.8");
        $hostAppDirectoryPath = Path::app("$uniqueName/app");
        File::makeDirectory($hostAppDirectoryPath, 0755, true);
        exec("cp -r $originalPath/ $hostAppDirectoryPath/");
        $hostLogsDirectoryPath = Path::app("$uniqueName/logs");
        $hostOptionsDirectoryPath = Path::app("$uniqueName/options");
        File::makeDirectory($hostOptionsDirectoryPath, 0755, true);
        $hostDataDirectoryPath = Path::app("$uniqueName/data");
        $containerAppDirectoryPath = "/opt/app";
        $containerLogsDirectoryPath = "/etc/ProMarc/logs";
        File::put($composeDirectoryPath . "/.env", "HOST_DATA_DIRECTORY_PATH=$hostDataDirectoryPath\nHOST_APP_DIRECTORY_PATH=$hostAppDirectoryPath\nHOST_LOGS_DIRECTORY_PATH=$hostLogsDirectoryPath\nCONTAINER_APP_DIRECTORY_PATH=$containerAppDirectoryPath\nCONTAINER_LOGS_DIRECTORY_PATH=$containerLogsDirectoryPath\nCOMPOSE_PROJECT_NAME=$uniqueName");
        $osPath = resource_path("docker/os");
        exec("cp -r $osPath $composeDirectoryPath");
        exec("cd $composeDirectoryPath && docker-compose build");
        $containerName = $uniqueName . "_develop-lesson_1";
        $parameters = $request->all();
        $parameters["book"] = "";
        $parameters["container_name"] = $containerName;
        $parameters["host_app_directory_path"] = $hostAppDirectoryPath;
        $parameters["host_logs_directory_path"] = $hostLogsDirectoryPath;
        $parameters["host_options_directory_path"] = $hostOptionsDirectoryPath;
        $parameters["container_app_directory_path"] = $containerAppDirectoryPath;
        $parameters["container_logs_directory_path"] = $containerLogsDirectoryPath;
        $parameters["compose_directory_path"] = $composeDirectoryPath;
        $lesson = Lesson::create($parameters);
        return redirect("/development/{$lesson->id}");
    }

    public function update(Request $request, int $id)
    {
        $parameters = $request->all();
        if ($request->has("book") && is_null($request->book)) {
            $parameters["book"] = "";
        }
        Lesson::find($id)->fill($parameters)->save();
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
