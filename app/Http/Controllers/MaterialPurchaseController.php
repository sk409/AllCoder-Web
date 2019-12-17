<?php

namespace App\Http\Controllers;

use App\CodeQuestion;
use App\Lesson;
use App\Material;
use App\Path;
use Illuminate\Http\Request;
use stdClass;

class MaterialPurchaseController extends Controller
{

    public function show($id)
    {
        $material = Material::find($id);
        $material->rating = Material::rating($material);
        foreach ($material->lessons as $lesson) {
            $lesson->rating = Lesson::rating($lesson);
        }
        return view("material_purchase_show", [
            "material" => $material
        ]);
    }

    public function purchase(Request $request, $id)
    {
        $request->validate([
            "user_id" => "required",
        ]);
        $material = Material::find($id);
        if ($material->user_id === $request->user_id) {
            return;
        }
        if ($material->purchases()->where("user_id", $request->user_id)->exists()) {
            return;
        }
        $material->purchases()->attach($request->user_id);
        foreach ($material->lessons as $lesson) {
            $lessonDirectoryPathPurchased = Path::purchasedLesson($request->user_id, $material->id, $lesson->id, "");
            // $dockerDirectoryPathPurchased = Path::append($lessonDirectoryPathPurchased, "docker");
            mkdir($lessonDirectoryPathPurchased, 0755, true);
            // mkdir($dockerDirectoryPathPurchased);
            /*********************************/
            // $lessonDirectoryPathOriginal = Path::lesson($lesson->id);
            // $tarFilePathOriginal = Path::append($lessonDirectoryPathOriginal, "container.tar");
            // $dockerImageNameOriginal = uniqid();
            // exec("cat $tarFilePathOriginal | docker image import - $dockerImageNameOriginal");
            // $outputs = [];
            // exec("docker container run -itd $dockerImageNameOriginal /sbin/init", $outputs);
            /*********************************/
            $dockerImageName = uniqid();
            exec("docker container commit $lesson->docker_container_id $dockerImageName");
            $outputs = [];
            exec("docker container run -itd -P $dockerImageName", $outputs);
            /*********************************/
            $dockerContainerId = $outputs[0];
            // TODO: MySQLが選択されている場合にだけ実行する
            exec("docker container exec -it $dockerContainerId find /var/lib/mysql -type f -exec touch {} \;");
            // TODO: ClamAVを無効化
            //exec("docker container exec -it --user root $dockerContainerId clamd");
            exec("docker container exec -itd $dockerContainerId gotty -w -p $lesson->console_port bash");
            // $questionFileNames = glob(Path::lessonQuestion($lesson->id, "*.json"));
            //
            // foreach ($questionFileNames as $questionFileName) {
            //     $obj = json_decode(file_get_contents($questionFileName));
            //     usort($obj->questions, function ($a, $b) {
            //         return $a->startIndex - $b->endIndex;
            //     });
            //     $outputs = [];
            //     exec("docker container exec -it $dockerContainerId cat $obj->path", $outputs);
            //     $text = implode("\n", $outputs);
            //     $newText = "";
            //     $seek = 0;
            //     usort($obj->questions, function ($a, $b) {
            //         $a->startIndex - $b->startIndex;
            //     });
            //     foreach ($obj->questions as $question) {
            //         $newText .= substr($text, $seek, $question->startIndex);
            //         $seek = $question->endIndex;
            //     }
            //     $newText .= substr($text, $seek, strlen($text));
            //     $tmpFilePath = storage_path(uniqid());
            //     file_put_contents($tmpFilePath, $newText);
            //     exec("docker container cp $tmpFilePath $dockerContainerId:$obj->path");
            //     unlink($tmpFilePath);
            // }
            $groups = CodeQuestion::where("lesson_id", $lesson->id)
                ->get()
                ->groupBy("file_path")
                ->sortBy("start_index")
                ->all();
            foreach ($groups as $filePath => $group) {
                $outputs = [];
                exec("docker container exec -it $dockerContainerId cat $filePath", $outputs);
                $text = implode("\n", $outputs);
                $seek = 0;
                $newText = "";
                $questions = $group->all();
                foreach ($questions as $question) {
                    $newText .= substr($text, $seek, $question->start_index - $seek);
                    $seek = $question->end_index;
                }
                $newText .= substr($text, $seek, strlen($text) - $seek);
                $tmpFilePath = storage_path(uniqid());
                file_put_contents($tmpFilePath, $newText);
                exec("docker container cp $tmpFilePath $dockerContainerId:$filePath");
                unlink($tmpFilePath);
            }
            // $tarFilePathPurchased = Path::append($lessonDirectoryPathPurchased, "container.tar");
            // exec("docker container export $dockerContainerId > $tarFilePathPurchased");
            $info = new stdClass();
            $info->title = $lesson->title;
            $info->user_name = $lesson->user_name;
            $info->console_port = $lesson->console_port;
            $info->ports = [];
            foreach ($lesson->ports->all() as $port) {
                $info->ports[] = $port->port;
            }
            // $info->docker_container_id = null;
            $info->docker_container_id = $dockerContainerId;
            $infoFilePath = Path::append($lessonDirectoryPathPurchased, "info.json");
            file_put_contents($infoFilePath, json_encode($info));
        }
    }
}
