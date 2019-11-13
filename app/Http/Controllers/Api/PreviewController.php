<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Path;
use Illuminate\Http\Request;

class PreviewController extends Controller
{

    public function up(Request $request)
    {
        $request->validate([
            "user_id" => "required",
            "material_id" => "required",
            "lesson_id" => "required",
        ]);
        $purchasedLessonDirectoryPath = Path::rtrim(Path::purchasedLessonMobile(
            $request->user_id,
            $request->material_id,
            $request->lesson_id
        ));
        exec("cd $purchasedLessonDirectoryPath && docker-compose down");
        exec("cd $purchasedLessonDirectoryPath && docker-compose up -d");
        exec("cd $purchasedLessonDirectoryPath && docker-compose exec -d develop /bin/bash /opt/scripts/startup.sh");
        // /******************************/
        // // TODO: コンテナ名とかハードコーディングしてるけど大丈夫?
        // // TODO: mysqlのデータベース名とかをちゃんと取得した値にする
        // $outputs = [];
        // exec("cd $purchasedLessonDirectoryPath && docker-compose ps -q database", $outputs);
        // $databaseContainerId = $outputs[0];
        // $dumpedDataFilePath = Path::purchasedLesson($request->user_id, $request->material_id, $request->lesson_id, "data.sql");
        // exec("docker container cp $dumpedDataFilePath $databaseContainerId:/opt/data.sql");
        // $importDataScriptPath = Path::append($purchasedLessonDirectoryPath, "import_data.sh");
        // file_put_contents($importDataScriptPath, "mysql -u root -proot laravel < /opt/data.sql");
        // exec("docker container cp $importDataScriptPath $databaseContainerId:/opt/import_data.sh");
        // exec("docker container exec $databaseContainerId chmod +x /opt/import_data.sh");
        // while (true) {
        //     $outputs = [];
        //     exec("docker container exec $databaseContainerId /bin/bash /opt/import_data.sh 2>&1", $outputs);
        //     $succeeded = true;
        //     foreach ($outputs as $output) {
        //         if (strpos($output, "ERROR") !== false) {
        //             $succeeded = false;
        //             break;
        //         }
        //     }
        //     if ($succeeded) {
        //         break;
        //     }
        // }
    }

    public function preview(Request $request)
    {
        $request->validate([
            "user_id" => "required",
            "material_id" => "required",
            "lesson_id" => "required",
        ]);
        $purchasedLessonDirectoryPath = Path::rtrim(Path::purchasedLessonMobile(
            $request->user_id,
            $request->material_id,
            $request->lesson_id
        ));
        // // TODO: ポート番号のハードコーディング修正
        $outputs = [];
        exec("cd $purchasedLessonDirectoryPath && docker-compose port develop 80", $outputs);
        preg_match("/.+:([0-9]+)/u", $outputs[0], $portMatches);
        $previewPortNumber = $portMatches[1];
        // // TODO: リダイレクト先のスキーム、ホストを一箇所にまとめる
        return redirect("http://localhost:$previewPortNumber");
    }

    public function down(Request $request)
    {
        $request->validate([
            "user_id" => "required",
            "material_id" => "required",
            "lesson_id" => "required",
        ]);
        $purchasedLessonDirectoryPath = Path::rtrim(Path::purchasedLesson(
            $request->user_id,
            $request->material_id,
            $request->lesson_id,
            ""
        ));
        exec("cd $purchasedLessonDirectoryPath && docker-compose down");
    }
}
