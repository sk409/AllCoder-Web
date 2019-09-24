<?php

namespace App\Http\Controllers;

use Auth;
use App\Http\Requests\LessonCreationRequest;
use App\Lesson;
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
        $containerName = "all_coder_" . uniqid();
        $nginxPort = Port::create();
        $gottyPort = Port::create();
        exec("docker container run -itd --name $containerName -p $nginxPort->id:80 -p $gottyPort->id:8080 all_coder/laravel");
        exec("docker container exec $containerName /bin/bash /opt/scripts/startup.sh");
        exec("docker container exec -itd $containerName gotty -w bash");
        $parameters = $request->all();
        $parameters["container_name"] = $containerName;
        $parameters["nginx_port_number"] = $nginxPort->id;
        $parameters["gotty_port_number"] = $gottyPort->id;
        $lesson = Lesson::create($parameters);
        return redirect("development/" . $lesson->id);
    }
}
