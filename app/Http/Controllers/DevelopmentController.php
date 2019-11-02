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

//use App\File;
use App\Lesson;
use App\Material;
use App\Path;
use App\User;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;

// class File
// {
//     public $path = "";
//     public $text = "";

//     public function __construct(string $path, string $text)
//     {
//         $this->path = $path;
//         $this->text = $text;
//     }
// }

// class Folder
// {
//     public $path = "";
//     public $children = [];

//     public function __construct(string $path)
//     {
//         $this->path = $path;
//     }

//     public function appenChild($child)
//     {
//         $this->children[] = $child;
//     }
// }

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
    public function creating(Request $request): Renderable
    {
        $request->validate([
            "lesson_id" => "required"
        ]);
        $lesson = Lesson::find($request->lesson_id);
        /******************************/
        // TODO: DockerContainerClass
        $composeDirectoryPath = Path::lesson($lesson->id);
        // $outputs = [];
        // exec("cd $lessonDirectoryPath && docker-compose ps", $outputs);
        // $itemsAndLine = 2;
        // if ($itemsAndLine === count($outputs)) {
        //     exec("cd $lessonDirectoryPath && docker-compose up -d");
        //     exec("cd $lessonDirectoryPath && docker-compose exec -d develop gotty -w bash");
        //     exec("cd $lessonDirectoryPath && docker-compose exec -d develop /bin/bash /opt/scripts/observe_app_changes.sh $lesson->container_app_directory_path $lesson->container_logs_directory_path/app_changes.txt");
        //     exec("cd $lessonDirectoryPath && docker-compose exec -d develop /bin/bash /opt/scripts/startup.sh");
        //     //exec("cd $lessonDirectoryPath && docker-compose up -d && docker-compose exec develop ");
        //     //exec("docker container exec $lesson->container_name /bin/bash /opt/scripts/startup.sh");
        //     //exec("docker container exec -itd $lesson->container_name gotty -w bash");
        //     //exec("docker container exec -itd $lesson->container_name /opt/scripts/observe_app_changes.sh $lesson->container_app_directory_path $lesson->container_logs_directory_path/app_changes.txt");
        //     // exec("docker container ps -f name=$lesson->container_name -q", $containerId);
        //     // $lesson->container_id = $containerId[0];
        //     // exec("docker container port $lesson->container_name", $ports);
        //     // $portString = join("\n", $ports);
        //     // $lesson->preview_port_number = $previewPortMatches[1];
        //     // $lesson->console_port_number = $consolePortMatches[1];
        //     // $lesson->save();
        // }
        /******************************/
        return DevelopmentController::f(
            "creating",
            $lesson->title,
            $composeDirectoryPath,
            $lesson->host_app_directory_path,
            $lesson->container_app_directory_path,
            $lesson->container_logs_directory_path,
            Path::append($lesson->host_logs_directory_path, "app_changes.txt"),  // TODO: ファイル名まで含めてDBに保存する,
            ["lesson" => $lesson]
        );
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
