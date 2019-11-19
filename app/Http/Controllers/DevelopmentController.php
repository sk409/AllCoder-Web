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

    /************/
    // 購入時にJSONに吐き出す情報
    // user_name, console_port, ports, container_id(自分で設定), 
    /************/
    public function creating(int $id)
    {
        $lesson = Lesson::find($id);
        $mode = "creating";
        if (is_null($lesson->docker_container_id)) {
            // $dockerImageName = uniqid();
            // exec("docker image build -t $dockerImageName $lessonDirectoryPath");
            $lessonDirectoryPath = Path::lesson($lesson->id);
            $containerTarFilePath = Path::append($lessonDirectoryPath, "container.tar");
            $dockerImageName = uniqid();
            exec("cat $containerTarFilePath | docker image import - $dockerImageName");
            $dockerDirectoryPath = Path::append($lessonDirectoryPath, "docker");
            $dockerfilePath = Path::append($dockerDirectoryPath, "Dockerfile");
            // TODO: レッスンからユーザ名を取得する
            $dockerfileText = <<<EOM
FROM $dockerImageName
USER $lesson->user_name
EOM;
            file_put_contents($dockerfilePath, $dockerfileText);
            $dockerImageName2 = uniqid();
            exec("docker image build -t $dockerImageName2 $dockerDirectoryPath");
            $portString = "";
            foreach ($lesson->ports as $port) {
                $portString .= "-p $port->port ";
            }
            $outputs = [];
            exec("docker container run -d $portString $dockerImageName2 /sbin/init", $outputs);
            $containerID = $outputs[0];
            // TODO: MySQLが選択されている場合にだけ実行する
            exec("docker container exec -it $containerID find /var/lib/mysql -type f -exec touch {} \;");
            exec("docker container exec -it --user root $containerID clamd");
            exec("docker container exec -itd $containerID gotty -w -p $lesson->console_port bash");
        } else {
            $containerID = $lesson->docker_container_id;
        }
        $outputs = [];
        exec("docker container port $containerID $lesson->console_port", $outputs);
        preg_match("/[0-9]+:([0-9]+)/u", $outputs[0], $consolePortMatches);
        $consolePort = $consolePortMatches[1];
        $hostPorts = [];
        $containerPorts = [];
        foreach ($lesson->ports()->get()->all() as $containerPort) {
            $outputs = [];
            exec("docker container port $containerID $containerPort->port", $outputs);
            preg_match("/[0-9]+:([0-9]+)/u", $outputs[0], $portMatches);
            $hostPorts[] = $portMatches[1];
            $containerPorts[] = $containerPort->port;
        }
        $lesson->docker_container_id = $containerID;
        $lesson->save();
        return view("development_ide", [
            "mode" => $mode,
            "title" => $lesson->title,
            "consolePort" => $consolePort,
            "hostPorts" => $hostPorts,
            "containerPorts" => $containerPorts,
            "lesson" => $lesson,
        ]);
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
        // $composeDirectoryPath = Path::purchasedLessonWeb(
        //     $request->user_id,
        //     $request->material_id,
        //     $request->lesson_id
        // );
        $mode = "learning";
        $lessonDirectoryPathPurchased = Path::purchasedLesson($user->id, $material->id, $lesson->id, "");
        $infoFilePath = Path::append($lessonDirectoryPathPurchased, "info.json");
        $info = json_decode(file_get_contents($infoFilePath));
        if (is_null($info->docker_container_id)) {
            $containerTarFilePath = Path::append($lessonDirectoryPathPurchased, "container.tar");
            $dockerImageName = uniqid();
            exec("cat $containerTarFilePath | docker image import - $dockerImageName");
            $dockerDirectoryPath = Path::append($lessonDirectoryPathPurchased, "docker");
            // KOKOKARA
            $dockerfilePath = Path::append($dockerDirectoryPath, "Dockerfile");
            // TODO: レッスンからユーザ名を取得する
            $dockerfileText = <<<EOM
FROM $dockerImageName
USER $info->user_name
EOM;
            file_put_contents($dockerfilePath, $dockerfileText);
            $dockerImageName2 = uniqid();
            exec("docker image build -t $dockerImageName2 $dockerDirectoryPath");
            $portString = "";
            foreach ($info->ports as $port) {
                $portString .= "-p $port->port ";
            }
            $outputs = [];
            exec("docker container run -d --privileged $portString $dockerImageName2 /sbin/init", $outputs);
            $containerID = $outputs[0];
            // TODO: MySQLが選択されている場合にだけ実行する
            exec("docker container exec -it $containerID find /var/lib/mysql -type f -exec touch {} \;");
            exec("docker container exec -it --user root $containerID systemctl start clamd@scan");
            exec("docker container exec -itd $containerID gotty -w -p $info->console_port bash");
        } else {
            $containerID = $info->container_id;
        }
        $outputs = [];
        exec("docker container port $containerID $info->console_port", $outputs);
        preg_match("/[0-9]+:([0-9]+)/u", $outputs[0], $consolePortMatches);
        $consolePort = $consolePortMatches[1];
        $hostPorts = [];
        $containerPorts = [];
        foreach ($info->ports as $containerPort) {
            $outputs = [];
            exec("docker container port $containerID $containerPort", $outputs);
            preg_match("/[0-9]+:([0-9]+)/u", $outputs[0], $portMatches);
            $hostPorts[] = $portMatches[1];
            $containerPorts[] = $containerPort;
        }
        $info->docker_container_id = $containerID;
        file_put_contents($infoFilePath, json_encode($info));
        return view("development_ide", [
            "mode" => $mode,
            "title" => $info->title,
            "consolePort" => $consolePort,
            "hostPorts" => $hostPorts,
            "containerPorts" => $containerPorts,
            "user" => $user,
            "material" => $material,
            "lesson" => $lesson,
            "info" => $info
        ]);
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

    public function down(Request $request)
    {
        $request->validate([
            "mode" => "required",
            "lesson_id" => "required",
        ]);
        $lesson = Lesson::find($request->lesson_id);
        if ($request->mode === "creating") {
            $lessonDirectoryPath = Path::lesson($lesson->id);
            $dockerContainerId = $lesson->docker_container_id;
        } else {
            $request->validate([
                "user_id" => "required",
                "material_id" => "required",
                "info" => "required",
            ]);
            $lessonDirectoryPath = Path::purchasedLesson($request->user_id, $request->material_id, $lesson->id, "");
            $info = json_decode($request->info);
            $dockerContainerId = $info->docker_container_id;
        }
        $tarFilePath = Path::append($lessonDirectoryPath, "container.tar");
        exec("docker container export $dockerContainerId > $tarFilePath");
        $outputs = [];
        exec("docker container inspect --format={{.Image}} $dockerContainerId", $outputs);
        $oldDockerImageId = $outputs[0];
        exec("docker container kill $dockerContainerId");
        exec("docker container rm $dockerContainerId");
        $outputs = [];
        exec("docker image inspect --format={{.RepoTags}} $oldDockerImageId", $outputs);
        $matches = [];
        preg_match_all("/([a-z0-9]+):latest/u", $outputs[0], $matches);
        for ($index = 0; $index < count($matches[1]); ++$index) {
            $oldDockerImageName = $matches[1][$index];
            exec("docker image rm -f $oldDockerImageName");
        }
        $dockerFilePath = Path::append(Path::append($lessonDirectoryPath, "docker"), "Dockerfile");
        $dockerfileText = file_get_contents($dockerFilePath);
        $matches = [];
        preg_match("/^FROM ([a-z0-9]+)$/um", $dockerfileText, $matches);
        if (count($matches) == 2) {
            $oldDockerImageName = $matches[1];
            exec("docker image rm -f $oldDockerImageName");
        }
        if ($request->mode === "creating") {
            $lesson->docker_container_id = null;
            $lesson->save();
        } else {
            $info->docker_container_id = null;
            file_put_contents(Path::append($lessonDirectoryPath, "info.json"), json_encode($info));
        }
    }
}
