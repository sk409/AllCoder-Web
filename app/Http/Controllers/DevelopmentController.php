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

use Illuminate\Support\Facades\Auth;
use App\CodeQuestion;
use App\CodeQuestionAnswer;
use App\CodeQuestionClose;
use App\Error;
use App\Lesson;
use App\Material;
use App\Path;
use App\User;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;

class DevelopmentController extends Controller
{

    // TODO: アクセスしてきたユーザとログインしているユーザのIDが一致するかを確認する
    // private static function f(
    //     string $mode,
    //     string $title,
    //     string $composeDirectoryPath,
    //     string $hostAppDirectoryPath,
    //     string $containerAppDirectoryPath,
    //     string $containerLogsDirectoryPath,
    //     string $deltaLogFilePath,
    //     array $parameters
    // ): Renderable {
    //     exec("cd $composeDirectoryPath && docker-compose down");
    //     exec("cd $composeDirectoryPath && docker-compose up -d");
    //     exec("cd $composeDirectoryPath && docker-compose exec -d develop gotty -w bash");
    //     exec("cd $composeDirectoryPath && docker-compose exec -d develop /bin/bash /opt/scripts/observe_app_changes.sh $containerAppDirectoryPath $containerLogsDirectoryPath/app_changes.txt");
    //     exec("cd $composeDirectoryPath && docker-compose exec -d develop /bin/bash /opt/scripts/startup.sh");
    //     $outputs = [];
    //     // TODO: ポート番号決め打ち直す
    //     exec("cd $composeDirectoryPath && docker-compose port develop 80", $outputs);
    //     preg_match("/.+:([0-9]+)/u", $outputs[0], $previewPortMatches);
    //     $outputs = [];
    //     // TODO: ポート番号決め打ち直す
    //     exec("cd $composeDirectoryPath && docker-compose port develop 8080", $outputs);
    //     preg_match("/.+:([0-9]+)/u", $outputs[0], $consolePortMatches);
    //     return view("development_ide", [
    //         "mode" => $mode,
    //         "title" => $title,
    //         "hostAppDirectoryPath" => $hostAppDirectoryPath,
    //         "containerAppDirectoryPath" => $containerAppDirectoryPath,
    //         "deltaLogFilePath" => $deltaLogFilePath,
    //         "previewPortNumber" => $previewPortMatches[1],
    //         "consolePortNumber" => $consolePortMatches[1],
    //     ] + $parameters);
    // }

    /************/
    // 購入時にJSONに吐き出す情報
    // user_name, console_port, ports, container_id(自分で設定), 
    /************/
    public function creating(int $id)
    {
        $lesson = Lesson::find($id);
        if (Auth::user()->id !== $lesson->user->id) {
            Error::notFound();
        }
        $mode = "creating";
        //         if (is_null($lesson->docker_container_id)) {
        //             // $dockerImageName = uniqid();
        //             // exec("docker image build -t $dockerImageName $lessonDirectoryPath");
        //             $lessonDirectoryPath = Path::lesson($lesson->id);
        //             $containerTarFilePath = Path::append($lessonDirectoryPath, "container.tar");
        //             $dockerImageName = uniqid();
        //             exec("cat $containerTarFilePath | docker image import - $dockerImageName");
        //             $dockerDirectoryPath = Path::append($lessonDirectoryPath, "docker");
        //             $dockerfilePath = Path::append($dockerDirectoryPath, "Dockerfile");
        //             $dockerfileText = <<<EOM
        // FROM $dockerImageName
        // USER $lesson->user_name
        // EOM;
        //             file_put_contents($dockerfilePath, $dockerfileText);
        //             $dockerImageName2 = uniqid();
        //             exec("docker image build -t $dockerImageName2 $dockerDirectoryPath");
        //             $portString = "";
        //             foreach ($lesson->ports as $port) {
        //                 $portString .= "-p $port->port ";
        //             }
        //             $outputs = [];
        //             exec("docker container run -d $portString $dockerImageName2 /sbin/init", $outputs);
        //             $containerID = $outputs[0];
        //             // TODO: MySQLが選択されている場合にだけ実行する
        //             exec("docker container exec -it $containerID find /var/lib/mysql -type f -exec touch {} \;");
        //             exec("docker container exec -it --user root $containerID clamd");
        //             exec("docker container exec -itd $containerID gotty -w -p $lesson->console_port bash");
        //         } else {
        //             $containerID = $lesson->docker_container_id;
        //         }
        $outputs = [];
        exec("docker container port $lesson->docker_container_id $lesson->console_port", $outputs);
        preg_match("/[0-9]+:([0-9]+)/u", $outputs[0], $consolePortMatches);
        $consolePort = $consolePortMatches[1];
        $hostPorts = [];
        $containerPorts = [];
        foreach ($lesson->ports()->get()->all() as $containerPort) {
            $outputs = [];
            exec("docker container port $lesson->docker_container_id $containerPort->port", $outputs);
            preg_match("/[0-9]+:([0-9]+)/u", $outputs[0], $portMatches);
            $hostPorts[] = $portMatches[1];
            $containerPorts[] = $containerPort->port;
        }
        // $lesson->docker_container_id = $containerID;
        // $lesson->save();
        exec("docker container exec -it $lesson->docker_container_id find /var/lib/mysql -type f -exec touch {} \;");
        // TODO: ClamAVを無効化
        //exec("docker container exec -it --user root $dockerContainerId clamd");
        exec("docker container exec -itd $lesson->docker_container_id gotty -w -p $lesson->console_port bash");
        return view("development_ide_creating", [
            "mode" => $mode,
            "title" => $lesson->title,
            "consolePort" => $consolePort,
            "hostPorts" => $hostPorts,
            "containerPorts" => $containerPorts,
            "lesson" => $lesson,
        ]);
    }

    public function learning(Request $request)
    {
        $request->validate([
            "user_id" => "required",
            "material_id" => "required",
            "lesson_id" => "required",
        ]);
        $user = User::find($request->user_id);
        $readOnly = $user->id !== Auth::user()->id;
        // if ($user->id !== Auth::user()->id) {
        //     Error::notFound();
        // }
        $material = Material::find($request->material_id);
        //***********************************/
        // TODO: 買ってない人を考慮する
        //$purchased = count($user->purchases()->where("material_id", $material->id)->get()->all());
        // if (!$purchased) {
        //     Error::notFound();
        // }
        //***********************************/
        $lesson = Lesson::find($request->lesson_id);
        $includes = false;
        foreach ($material->lessons()->get()->all() as $l) {
            if ($lesson->id === $l->id) {
                $includes = true;
                break;
            }
        }
        if (!$includes) {
            Error::notFound();
        }
        $questions = CodeQuestion::where("lesson_id", $lesson->id)->orderBy("start_index")->get()->all();
        foreach ($questions as $question) {
            $question->closes = CodeQuestionClose::where("code_question_id", $question->id)->get()->all();
            $answers = CodeQuestionAnswer::where("user_id", $user->id)
                ->where("material_id", $material->id)
                ->where("lesson_id", $lesson->id)
                ->where("code_question_id", $question->id)->get()->all();
            $question->answer = empty($answers) ? null : $answers[0];
        }
        $lessonDirectoryPathPurchased = Path::purchasedLesson($user->id, $material->id, $lesson->id, "");
        $infoFilePath = Path::append($lessonDirectoryPathPurchased, "info.json");
        $info = json_decode(file_get_contents($infoFilePath));
        $outputs = [];
        exec("docker container port $info->docker_container_id $info->console_port", $outputs);
        preg_match("/[0-9]+:([0-9]+)/u", $outputs[0], $consolePortMatches);
        $consolePort = $consolePortMatches[1];
        $hostPorts = [];
        $containerPorts = [];
        foreach ($info->ports as $containerPort) {
            $outputs = [];
            exec("docker container port $info->docker_container_id $containerPort", $outputs);
            preg_match("/[0-9]+:([0-9]+)/u", $outputs[0], $portMatches);
            $hostPorts[] = $portMatches[1];
            $containerPorts[] = $containerPort;
        }
        exec("docker container exec -it $info->docker_container_id find /var/lib/mysql -type f -exec touch {} \;");
        exec("docker container exec -itd $info->docker_container_id gotty -w -p $info->console_port bash");
        return view("development_ide_learning", [
            "title" => $info->title,
            "consolePort" => $consolePort,
            "hostPorts" => $hostPorts,
            "containerPorts" => $containerPorts,
            "info" => $info,
            "user" => $user,
            "material" => $material,
            "lesson" => $lesson,
            "questions" => $questions,
            "filePath" => $request->file_path
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
        // $request->validate([
        //     "mode" => "required",
        //     "lesson_id" => "required",
        // ]);
        // $lesson = Lesson::find($request->lesson_id);
        // if ($request->mode === "creating") {
        //     $lessonDirectoryPath = Path::lesson($lesson->id);
        //     $dockerContainerId = $lesson->docker_container_id;
        // } else {
        //     $request->validate([
        //         "user_id" => "required",
        //         "material_id" => "required",
        //         "info" => "required",
        //     ]);
        //     $lessonDirectoryPath = Path::purchasedLesson($request->user_id, $request->material_id, $lesson->id, "");
        //     $info = json_decode($request->info);
        //     $dockerContainerId = $info->docker_container_id;
        // }
        // //
        // $tarFilePath = Path::append($lessonDirectoryPath, "container.tar");
        // exec("docker container export $dockerContainerId > $tarFilePath");
        // $outputs = [];
        // exec("docker container inspect --format={{.Image}} $dockerContainerId", $outputs);
        // $oldDockerImageId = $outputs[0];
        // exec("docker container kill $dockerContainerId");
        // exec("docker container rm $dockerContainerId");
        // $outputs = [];
        // exec("docker image inspect --format={{.RepoTags}} $oldDockerImageId", $outputs);
        // $matches = [];
        // //
        // if (count($outputs) !== 0) {
        //     preg_match_all("/([a-z0-9]+):latest/u", $outputs[0], $matches);
        //     if (count($matches) !== 0) {
        //         for ($index = 0; $index < count($matches[1]); ++$index) {
        //             $oldDockerImageName = $matches[1][$index];
        //             exec("docker image rm -f $oldDockerImageName");
        //         }
        //     }
        // }
        // $dockerFilePath = Path::append(Path::append($lessonDirectoryPath, "docker"), "Dockerfile");
        // $dockerfileText = file_get_contents($dockerFilePath);
        // $matches = [];
        // preg_match("/^FROM ([a-z0-9]+)$/um", $dockerfileText, $matches);
        // if (count($matches) == 2) {
        //     $oldDockerImageName = $matches[1];
        //     exec("docker image rm -f $oldDockerImageName");
        // }
        // if ($request->mode === "creating") {
        //     $lesson->docker_container_id = null;
        //     $lesson->save();
        // } else {
        //     $info->docker_container_id = null;
        //     file_put_contents(Path::append($lessonDirectoryPath, "info.json"), json_encode($info));
        // }
    }
}
