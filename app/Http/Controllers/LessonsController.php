<?php

namespace App\Http\Controllers;

use App\EnvironmentBuilder;
use App\Http\Requests\LessonCreationRequest;
use App\Lesson;
use App\LessonPort;
use App\Path;
use Auth;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;

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
        $parameters["user_name"] = $request->username;
        $lesson = Lesson::create($parameters);
        $lessonDirectoryPath = Path::lesson("$lesson->id");
        $dockerDirectoryPath = Path::append($lessonDirectoryPath, "docker");
        mkdir($lessonDirectoryPath);
        mkdir(Path::lessonQuestion($lesson->id));
        mkdir($dockerDirectoryPath);
        $ports = $request->has("ports") ? $request->ports : [];
        $ports[] = $request->console_port;
        foreach ($ports as $port) {
            if (!$port) {
                continue;
            }
            LessonPort::create(["port" => $port, "lesson_id" => $lesson->id]);
        }
        $environmentBuilder = new EnvironmentBuilder($request->username, $request->os, $ports);
        if ($request->environments) {
            $php = "PHP";
            $laravel = "Laravel";
            $mysql = "MySQL";
            foreach ($request->environments as $environment) {
                $exploded = explode(": ", $environment);
                $version = end($exploded);
                if (substr($environment, 0, strlen($php)) === $php) {
                    $environmentBuilder->php($version);
                } else if (substr($environment, 0, strlen($laravel)) === $laravel) {
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
        $environmentBuilder->write($dockerDirectoryPath);
        $dockerImageName = uniqid();
        exec("docker image build -t $dockerImageName $dockerDirectoryPath");
        $outputs = [];
        exec("docker container run -itd $dockerImageName", $outputs);
        $dockerContainerId = $outputs[0];
        $tarFilePath = Path::append($lessonDirectoryPath, "container.tar");
        exec("docker container kill $dockerContainerId");
        exec("docker container export $dockerContainerId > $tarFilePath");
        exec("docker container rm $dockerContainerId");
        exec("docker image rm -f $dockerImageName");
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
