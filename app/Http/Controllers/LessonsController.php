<?php

namespace App\Http\Controllers;

use App\Http\Requests\LessonCreationRequest;
use App\Lesson;
use App\Path;
use App\Utils\FileUtils;
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
        $parameters = $request->all();
        $parameters["book"] = "";
        $lesson = Lesson::create($parameters);
        $lessonDirectoryPath = Path::lesson("$lesson->id");
        // $composeDirectoryPath = resource_path("docker/" . $uniqueName);
        // File::makeDirectory($composeDirectoryPath);
        // $composePath = $composeDirectoryPath . "/docker-compose.yml";
        mkdir($lessonDirectoryPath);
        FileUtils::copy(Path::dockerDevelopment(), $lessonDirectoryPath);
        // File::copy(resource_path("docker/docker-compose.yml"), $composePath);
        // File::copy(resource_path("docker/Dockerfile"), $composeDirectoryPath . "/Dockerfile");
        $originalPath = Path::lessonOriginals(Path::append("Laravel", "5.8"));
        $hostAppDirectoryPath = Path::append($lessonDirectoryPath, "app");
        mkdir($hostAppDirectoryPath);
        FileUtils::copy($originalPath, $hostAppDirectoryPath);
        // exec("cp -r $originalPath/ $hostAppDirectoryPath/");
        $optionsDirectoryPath = Path::append($lessonDirectoryPath, "options");
        mkdir($optionsDirectoryPath);
        $containerAppDirectoryPath = "/opt/app";
        $containerLogsDirectoryPath = "/etc/ProMark/logs";
        $dataDirectoryPath = Path::append($lessonDirectoryPath, "data");
        $hostLogsDirectoryPath = Path::append($lessonDirectoryPath, "logs");
        File::put(
            Path::append($lessonDirectoryPath, ".env"),
            "HOST_DATA_DIRECTORY_PATH=$dataDirectoryPath\nHOST_APP_DIRECTORY_PATH=$hostAppDirectoryPath\nHOST_LOGS_DIRECTORY_PATH=$hostLogsDirectoryPath\nCONTAINER_APP_DIRECTORY_PATH=$containerAppDirectoryPath\nCONTAINER_LOGS_DIRECTORY_PATH=$containerLogsDirectoryPath"
        );
        exec("cd $lessonDirectoryPath && docker-compose build");
        //$osPath = resource_path("docker/os");
        //exec("cp -r $osPath $composeDirectoryPath");
        //exec("cd $composeDirectoryPath && docker-compose build");
        //$containerName = $uniqueName . "_develop-lesson_1";
        // $parameters = $request->all();
        // $parameters["book"] = "";
        // $parameters["container_name"] = $containerName;
        // $parameters["host_app_directory_path"] = $hostAppDirectoryPath;
        // $parameters["host_data_directory_path"] = $dataDirectoryPath;
        // $parameters["host_logs_directory_path"] = $logsDirectoryPath;
        // $parameters["host_options_directory_path"] = $hostOptionsDirectoryPath;
        // $parameters["container_app_directory_path"] = $containerAppDirectoryPath;
        // $parameters["container_logs_directory_path"] = $containerLogsDirectoryPath;
        // $parameters["compose_directory_path"] = $composeDirectoryPath;
        // $lesson = Lesson::create($parameters);
        $lesson->host_app_directory_path = $hostAppDirectoryPath;
        $lesson->host_logs_directory_path = $hostLogsDirectoryPath;
        $lesson->container_app_directory_path = $containerAppDirectoryPath;
        $lesson->container_logs_directory_path = $containerLogsDirectoryPath;
        $lesson->lesson_directory_path = $lessonDirectoryPath;
        $lesson->options_directory_path = $optionsDirectoryPath;
        $lesson->data_directory_path = $dataDirectoryPath;
        $lesson->save();
        return redirect("/development/creating/{$lesson->id}");
    }

    public function update(Request $request, int $id)
    {
        $parameters = $request->all();
        if ($request->has("book") && is_null($request->book)) {
            $parameters["book"] = "";
        }
        Lesson::find($id)->fill($parameters)->save();
    }

    // public function delta(int $id)
    // {
    //     $lesson = Lesson::find($id);
    //     $logPath = Path::append($lesson->host_logs_directory_path, "app_changes.txt");
    //     //$logPath = "$lesson->host_logs_directory_path/app_changes.txt";
    //     $appChanges = File::get($logPath, true);
    //     File::put($logPath, "");
    //     $pattern = "/(\\/opt\\/app\\/.*?) (CREATE|DELETE|MODIFY)(,ISDIR)? (.*)/u";
    //     preg_match_all($pattern, $appChanges, $matches);
    //     return $matches;
    // }
}
