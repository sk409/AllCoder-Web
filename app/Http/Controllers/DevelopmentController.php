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
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Support\Facades\File;

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

    public function index($lessonId): Renderable
    {
        $lesson = Lesson::find($lessonId);
        exec("cd $lesson->compose_directory_path && docker-compose up -d");
        exec("docker container exec $lesson->container_name /bin/bash /opt/scripts/startup.sh");
        exec("docker container exec -itd $lesson->container_name gotty -w bash");
        exec("docker container exec -itd $lesson->container_name /opt/scripts/observe_app_changes.sh $lesson->container_app_directory_path $lesson->container_logs_directory_path/app_changes.txt");
        exec("docker container port $lesson->container_name", $ports);
        $portString = join("\n", $ports);
        preg_match("/80\\/tcp.+:([0-9]+)/u", $portString, $previewPortMatches);
        preg_match("/8080\\/tcp.+:([0-9]+)/u", $portString, $consolePortMatches);
        $lesson->preview_port_number = $previewPortMatches[1];
        $lesson->console_port_number = $consolePortMatches[1];
        $lesson->save();
        return view("development_ide", ["lesson" => $lesson]);
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
