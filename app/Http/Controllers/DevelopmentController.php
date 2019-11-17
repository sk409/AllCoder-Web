<?php

// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use Illuminate\Contracts\Support\Renderable;
// use App\User;
// use App\Lesson;

// class DevelopmentController extends Controller
// {

//     public function index($lessonId): Renderable
//     {
//         $lesson = Lesson::find($lessonId);
//         $user = User::find($lesson->user_id);
//         return view("development", ["user" => $user, "lesson" => $lesson]);
//     }
// }

namespace App\Http\Controllers;

use App\Lesson;
use App\Material;
use App\Path;
use App\User;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;

function dockerImageName(string $imageName) {
    return "promark_" . $imageName;
}

class DevelopmentController extends Controller
{

    // TODO: アクセスしてきたユーザとログインしているユーザのIDが一致するかを確認する
    private static function f(
        string $mode,
        string $title,
        string $composeDirectoryPath,
        string $hostAppDirectoryPath,
        string $containerAppDirectoryPath,
        string $containerLogsDirectoryPath,
        string $deltaLogFilePath,
        array $parameters
    ): Renderable {
        exec("cd $composeDirectoryPath && docker-compose down");
        exec("cd $composeDirectoryPath && docker-compose up -d");
        exec("cd $composeDirectoryPath && docker-compose exec -d develop gotty -w bash");
        exec("cd $composeDirectoryPath && docker-compose exec -d develop /bin/bash /opt/scripts/observe_app_changes.sh $containerAppDirectoryPath $containerLogsDirectoryPath/app_changes.txt");
        exec("cd $composeDirectoryPath && docker-compose exec -d develop /bin/bash /opt/scripts/startup.sh");
        $outputs = [];
        // TODO: ポート番号決め打ち直す
        exec("cd $composeDirectoryPath && docker-compose port develop 80", $outputs);
        preg_match("/.+:([0-9]+)/u", $outputs[0], $previewPortMatches);
        $outputs = [];
        // TODO: ポート番号決め打ち直す
        exec("cd $composeDirectoryPath && docker-compose port develop 8080", $outputs);
        preg_match("/.+:([0-9]+)/u", $outputs[0], $consolePortMatches);
        return view("development_ide", [
            "mode" => $mode,
            "title" => $title,
            "hostAppDirectoryPath" => $hostAppDirectoryPath,
            "containerAppDirectoryPath" => $containerAppDirectoryPath,
            "deltaLogFilePath" => $deltaLogFilePath,
            "previewPortNumber" => $previewPortMatches[1],
            "consolePortNumber" => $consolePortMatches[1],
        ] + $parameters);
    }

    public function creating(int $id)
    {
        $lesson = Lesson::find($id);
        $lessonDirectoryPath = Path::lesson($lesson->id);
        $dockerImageName = dockerImageName($lesson->id);
        exec("docker image rm $dockerImageName");
        exec("docker image build -t $dockerImageName $lessonDirectoryPath");
        $outputs = [];
        exec("docker container run -itd -P $dockerImageName", $outputs);
        $containerID = $outputs[0];
        exec("docker container exec -itd $containerID gotty -w -p $lesson->console_port bash");
        $outputs = [];
        exec("docker container port $containerID $lesson->console_port", $outputs);
        preg_match("/[0-9]+:([0-9]+)/u", $outputs[0], $consolePortMatches);
        $consolePort = $consolePortMatches[1];
        $ports = [];
        foreach($lesson->ports()->get()->all() as $port) {
            $outputs = [];
            exec("docker container port $containerID $port->port", $outputs);
            preg_match("/[0-9]+:([0-9]+)/u", $outputs[0], $portMatches);
            $ports[] = $portMatches[1];
        }
        $lesson->container_id = $containerID;
        $lesson->save();
        return view("development_ide", [
            "mode" => "creating",
            "title" => $lesson->title,
            "consolePort" => $consolePort,
            "ports" => $ports,
            "lesson" => $lesson,
        ]);
        // return DevelopmentController::f(
        //     "creating",
        //     $lesson->title,
        //     $composeDirectoryPath,
        //     $lesson->host_app_directory_path,
        //     $lesson->container_app_directory_path,
        //     $lesson->container_logs_directory_path,
        //     Path::append($lesson->host_logs_directory_path, "app_changes.txt"),  // TODO: ファイル名まで含めてDBに保存する,
        //     ["lesson" => $lesson]
        // );
    }

    public function learning(Request $request): Renderable
    {
        $request->validate([
            "user_id" => "required",
            "material_id" => "required",
            "lesson_id" => "required",
        ]);
        $user = User::find($request->user_id);
        $material = Material::find($request->material_id);
        $lesson = Lesson::find($request->lesson_id);
        $composeDirectoryPath = Path::purchasedLessonWeb(
            $request->user_id,
            $request->material_id,
            $request->lesson_id
        );
        return DevelopmentController::f(
            "learning",
            $lesson->title,
            $composeDirectoryPath,
            Path::append($composeDirectoryPath, "app"),
            $lesson->container_app_directory_path,
            $lesson->container_logs_directory_path,
            Path::append(Path::append($composeDirectoryPath, "logs"), "app_changes.txt"),    // TODO: パスの指定の仕方なんとかする
            [
                "user" => $user,
                "material" => $material,
                "lesson" => $lesson
            ]
        );
    }

    public function writing($lessonId): Renderable
    {
        $lesson = Lesson::find($lessonId);
        return view("development_writing", ["lesson" => $lesson]);
    }

    public function reading(Request $requst)
    {
        $requst->validate([
            "user_id" => "required",
            "material_id" => "required",
            "lesson_id" => "required"
        ]);
        /****************/
        // TODO: スナップショットからMarkdownTextを返す
        $lesson = Lesson::find($requst->lesson_id);
        return view("development_reading", [
            "markdownText" => $lesson->book
        ]);
        /****************/
    }

    public function unload($lessonId)
    {
        $lesson = Lesson::find($lessonId);
        exec("cd $lesson->compose_directory_path && docker-compose down");
        $lesson->preview_port_number = null;
        $lesson->console_port_number = null;
        $lesson->save();
    }
}
