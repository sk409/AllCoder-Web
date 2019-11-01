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
use App\Path;
use Illuminate\Contracts\Support\Renderable;

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

    public function index($lessonId)
    {
        $lesson = Lesson::find($lessonId);
        /******************************/
        // TODO: DockerContainerClass
        $lessonDirectoryPath = Path::lesson($lesson->id);
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
        exec("cd $lessonDirectoryPath && docker-compose down");
        exec("cd $lessonDirectoryPath && docker-compose up -d");
        exec("cd $lessonDirectoryPath && docker-compose exec -d develop gotty -w bash");
        exec("cd $lessonDirectoryPath && docker-compose exec -d develop /bin/bash /opt/scripts/observe_app_changes.sh $lesson->container_app_directory_path $lesson->container_logs_directory_path/app_changes.txt");
        exec("cd $lessonDirectoryPath && docker-compose exec -d develop /bin/bash /opt/scripts/startup.sh");
        $outputs = [];
        // TODO: ポート番号決め打ち直す
        exec("cd $lessonDirectoryPath && docker-compose port develop 80", $outputs);
        preg_match("/.+:([0-9]+)/u", $outputs[0], $previewPortMatches);
        $outputs = [];
        // TODO: ポート番号決め打ち直す
        exec("cd $lessonDirectoryPath && docker-compose port develop 8080", $outputs);
        preg_match("/.+:([0-9]+)/u", $outputs[0], $consolePortMatches);
        return view("development_ide", [
            "lesson" => $lesson,
            "previewPortNumber" => $previewPortMatches[1],
            "consolePortNumber" => $consolePortMatches[1],
        ]);
    }

    public function writing($lessonId): Renderable
    {
        $lesson = Lesson::find($lessonId);
        return view("development_writing", ["lesson" => $lesson]);
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
