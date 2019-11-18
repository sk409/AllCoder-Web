<?php

namespace App\Http\Controllers;

use App\EnvironmentBuilder;
use App\Http\Requests\LessonCreationRequest;
use App\Lesson;
use App\LessonPort;
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
        //
        $request->validate([
            "title" => "required",
            "description" => "required",
            "os" => "required",
            "username" => "required",
            "console_port" => "required"
        ]);
        $parameters = $request->all();
        $parameters["book"] = "";
        $parameters["docker_image_name"] = uniqid();
        $lesson = Lesson::create($parameters);
        $lessonDirectoryPath = Path::lesson("$lesson->id");
        mkdir($lessonDirectoryPath);
        $ports = $request->has("ports") ? $request->ports : [];
        $ports[] = $request->console_port;
        foreach ($ports as $port) {
            LessonPort::create(["port" => $port, "lesson_id" => $lesson->id]);
        }
        $environmentBuilder = new EnvironmentBuilder($request->username, $request->os, $ports);
        if ($request->environments) {
            $laravel = "Laravel";
            $mysql = "MySQL";
            foreach ($request->environments as $environment) {
                $exploded = explode(": ", $environment);
                $version = end($exploded);
                echo $version;
                if (substr($environment, 0, strlen($laravel)) === $laravel) {
                    $environmentBuilder->laravel($version);
                } else if (substr($environment, 0, strlen($mysql)) === $mysql) {
                    $request->validate([
                        "mysql_username" => "required",
                        "mysql_password" => "required",
                        "mysql_port" => "required",
                    ]);
                    $environmentBuilder->mysql(
                        $version,
                        $request->mysql_username,
                        $request->mysql_password,
                        $request->mysql_port
                    );
                }
            }
        }
        $environmentBuilder->end();
        $environmentBuilder->write($lessonDirectoryPath);
        return redirect("/development/creating/{$lesson->id}");
        //return $request->all();

        // $parameters = $request->all();
        // $parameters["book"] = "";
        // $lesson = Lesson::create($parameters);
        // $lessonDirectoryPath = Path::lesson("$lesson->id");
        // mkdir($lessonDirectoryPath);
        // FileUtils::copy(Path::dockerDevelopment(), $lessonDirectoryPath);
        // $originalPath = Path::lessonOriginals(Path::append("Laravel", "5.8"));
        // $hostAppDirectoryPath = Path::append($lessonDirectoryPath, "app");
        // mkdir($hostAppDirectoryPath);
        // FileUtils::copy($originalPath, $hostAppDirectoryPath);
        // $optionsDirectoryPath = Path::append($lessonDirectoryPath, "options");
        // mkdir($optionsDirectoryPath);
        // $containerAppDirectoryPath = "/opt/app";
        // $containerLogsDirectoryPath = "/etc/ProMark/logs";
        // $dataDirectoryPath = Path::append($lessonDirectoryPath, "data");
        // $hostLogsDirectoryPath = Path::append($lessonDirectoryPath, "logs");
        // File::put(
        //     Path::append($lessonDirectoryPath, ".env"),
        //     "HOST_DATA_DIRECTORY_PATH=$dataDirectoryPath\nHOST_APP_DIRECTORY_PATH=$hostAppDirectoryPath\nHOST_LOGS_DIRECTORY_PATH=$hostLogsDirectoryPath\nCONTAINER_APP_DIRECTORY_PATH=$containerAppDirectoryPath\nCONTAINER_LOGS_DIRECTORY_PATH=$containerLogsDirectoryPath"
        // );
        // exec("cd $lessonDirectoryPath && docker-compose build");
        // $lesson->host_app_directory_path = $hostAppDirectoryPath;
        // $lesson->host_logs_directory_path = $hostLogsDirectoryPath;
        // $lesson->container_app_directory_path = $containerAppDirectoryPath;
        // $lesson->container_logs_directory_path = $containerLogsDirectoryPath;
        // $lesson->lesson_directory_path = $lessonDirectoryPath;
        // $lesson->options_directory_path = $optionsDirectoryPath;
        // $lesson->data_directory_path = $dataDirectoryPath;
        // $lesson->save();
        // return redirect("/development/creating/{$lesson->id}");
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
