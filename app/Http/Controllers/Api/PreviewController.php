<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Lesson;
use App\Path;
use App\Utils\FileUtils;
use Illuminate\Http\Request;

class PreviewController extends Controller
{

    public function preview(Request $request)
    {
        $request->validate([
            "user_id" => "required",
            "material_id" => "required",
            "lesson_id" => "required",
        ]);
        $uniqueName = uniqid();
        $directoryPath = Path::preview($uniqueName);
        mkdir($directoryPath);
        FileUtils::copy(Path::preview("originals"), $directoryPath);
        $nginxAppPath = "$directoryPath/nginx/app";
        $phpAppPath = "$directoryPath/php/app";
        mkdir($nginxAppPath);
        mkdir($phpAppPath);
        FileUtils::copy(
            Path::purchasedLessonWork($request->user_id, $request->material_id, $request->lesson_id, ""),
            $nginxAppPath
        );
        FileUtils::copy(
            Path::purchasedLessonWork($request->user_id, $request->material_id, $request->lesson_id, ""),
            $phpAppPath
        );
        /****************/
        //TODO: .envからmysqlのポート、データベース名、パスワードを取得する(mysql_dump.sh,import_mysql_data.shにも反映する)
        //         DB_NAME=laravel
        // DB_HOST=database
        // DB_USER=root
        // DB_PASS=root
        $lesson = Lesson::find($request->lesson_id);
        $env = "DB_NAME=laravel\nDB_HOST=database\nDB_USER=root\nDB_PASS=root\nHOST_DATA_DIRECTORY_PATH=$lesson->host_data_directory_path";
        file_put_contents("$directoryPath/.env", $env);
        /****************/
        exec("cd $directoryPath && docker-compose build && docker-compose up -d");
        /******************************/
        // TODO: コンテナ名とかハードコーディングしてるけど大丈夫?
        // TODO: mysqlのデータベース名とかをちゃんと取得した値にする
        exec("docker container ps -q -f name=" . $uniqueName . "_database_1", $databaseContainerId);
        $databaseContainerId = $databaseContainerId[0];
        exec("docker container cp $lesson->host_dumped_data_file_path $databaseContainerId:/opt/data.sql");
        $importDataScriptPath = Path::append($directoryPath, "import_data.sh");
        file_put_contents($importDataScriptPath, "mysql -u root -proot laravel < /opt/data.sql");
        exec("docker container cp $importDataScriptPath $databaseContainerId:/opt/import_data.sh");
        exec("docker container exec $databaseContainerId chmod +x /opt/import_data.sh");
        while(true) {
            $outputs = [];
            exec("docker container exec $databaseContainerId /bin/bash /opt/import_data.sh 2>&1", $outputs);
            $succeeded = true;
            foreach($outputs as $output) {
                if (strpos($output, "ERROR") !== false) {
                    $succeeded = false;
                    break;
                }
            }
            if ($succeeded) {
                break;
            }
        }
        /******************************/
    }
}
