<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\LessonsController;
use App\Material;
use App\Path;
use App\User;
use App\Utils\FileTreeIterator;
use App\Utils\FileUtils;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use stdClass;

class MaterialsController extends Controller
{

    public static function convert($materials)
    {
        $result = [];
        foreach ($materials as $material) {
            $stdMaterial = new stdClass();
            $stdMaterial->id = $material->id;
            $stdMaterial->title = $material->title;
            $stdMaterial->description = $material->description;
            $stdMaterial->thumbnail_image_path = $material->thumbnail_image_path;
            $stdMaterial->price = $material->price;
            $stdMaterial->created_at = $material->created_at;
            $stdMaterial->updated_at = $material->updated_at;
            $stdMaterial->lessons = [];
            foreach ($material->lessons as $lesson) {
                $stdMaterial->lessons[] = LessonsController::convert(
                    $material->id,
                    $lesson->id
                );
            }
            usort($stdMaterial->lessons, function ($a, $b) {
                return $a->index - $b->index;
            });
            $stdMaterial->comments = [];
            foreach ($material->comments()->where("parent_comment_id", null)->limit(5)->get() as $comment) {
                $stdComment = new stdClass();
                $stdComment->id = $comment->id;
                $stdComment->content = $comment->content;
                $stdComment->user_id = $comment->user_id;
                $stdComment->created_at = $comment->created_at;
                $stdComment->updated_at = $comment->updated_at;
                $stdMaterial->comments[] = $stdComment;
            }
            $result[] = $stdMaterial;
        }
        return $result;
    }

    public function index(Request $request)
    {

        if ($request->has("user_id") && $request->has("purchased")) {
            $materials = User::find($request->user_id)->purchases;
            if ($materials->count() == 0) {
                return [];
            }
            return MaterialsController::convert($materials);
        }

        $conditions = [];
        $columns = ["id", "title", "description", "price", "user_id", "created_at", "updated_at"];
        foreach ($columns as $column) {
            if (!$request->has($column)) {
                continue;
            }
            $conditions[$column] = $request[$column];
        }
        $materials = Controller::narrowDownFromConditions(
            $conditions,
            "\App\Material"
        );
        return MaterialsController::convert($materials);
    }

    // TODO: Web用とモバイル用で別のやり方をしているけど、やり方を統一する。
    //       元々あるディレクトリからスナップショットを作成するWeb用のやり方に統一する方が良さそう。
    public function purchase(Request $request)
    {
        $material = Material::find($request->material_id);
        $material->purchases()->attach($request->user_id);
        $userId = $request->user_id;
        $materialId = $request->material_id;
        foreach ($material->lessons as $lesson) {
            //***** モバイル用 *****//
            $makePath = function ($path, $switch) use ($lesson, $userId, $materialId) {
                // TODO: Pathクラスを使った書き方に直す
                $p = ltrim(substr($path, strlen($lesson->host_app_directory_path)), "/");
                if ($switch === "original") {
                    return Path::purchasedLessonOriginal($userId, $materialId, $lesson->id, $p);
                } else if ($switch === "work") {
                    return Path::purchasedLessonWork($userId, $materialId, $lesson->id, $p);
                } else {
                    return Path::purchasedLessonOptions($userId, $materialId, $lesson->id, $p);
                }
            };
            // File::makeDirectory($makePath("", "original"), 0755, true);
            // File::makeDirectory($makePath("", "work"));
            File::makeDirectory($makePath("", "options"), 0755, true);
            FileUtils::copy(
                Path::preview("originals"),
                Path::rtrim(Path::purchasedLesson($userId, $materialId, $lesson->id, ""))
            );
            $dumpedDataFilePath = Path::purchasedLesson($userId, $materialId, $lesson->id, "data.sql");
            /*********************/
            // TODO: 排他制御
            // exec("docker container start $lesson->container_id");
            // exec("docker container exec $lesson->container_id /bin/bash /opt/scripts/mysql_dump.sh");
            // exec("docker container cp $lesson->container_id:/opt/data.sql $dataDumpedFilePath");
            // exec("docker container stop $lesson->container_id");
            $lessonDirectoryPath = $lesson->lesson_directory_path;
            exec("cd $lessonDirectoryPath && docker-compose up -d");
            exec("cd $lessonDirectoryPath && docker-compose exec -d develop /bin/bash /opt/scripts/mysql_dump.sh");
            $outputs = [];
            exec("cd $lessonDirectoryPath && docker-compose ps -q develop", $outputs);
            $containerId = $outputs[0];
            exec("docker container cp $containerId:/opt/data.sql $dumpedDataFilePath");
            /*********************/
            $options = [];
            $optionFileNames = glob(Path::append($lesson->options_directory_path, "*.json"));
            foreach ($optionFileNames as $optionFileName) {
                $options[] = json_decode(file_get_contents($optionFileName));
                $option = json_decode(file_get_contents($optionFileName));
                $option->path = Path::append(
                    Path::purchasedLessonOriginal($userId, $materialId, $lesson->id, ""),
                    substr($option->path, strlen($lesson->host_app_directory_path))
                );
                file_put_contents(
                    Path::purchasedLessonOptions($userId, $materialId, $lesson->id, "$option->id.json"),
                    json_encode($option)
                );
            }
            $fileHandler = function ($path) use ($makePath, $options) {
                $option = null;
                foreach ($options as $o) {
                    if ($o->path === $path) {
                        $option = $o;
                        break;
                    }
                }
                $originalText = file_get_contents($path);
                $workText = $originalText;
                if ($option) {
                    $offset = 0;
                    foreach ($option->questions as $question) {
                        $workText =
                            substr($workText, 0, $question->startIndex - $offset) .
                            substr($workText, $question->endIndex - $offset);
                        $offset += ($question->endIndex - $question->startIndex);
                    }
                }
                File::put(
                    $makePath($path, "original"),
                    $originalText
                );
                File::put(
                    $makePath($path, "work"),
                    $workText
                );
            };
            $folderHandler = function ($path) use ($makePath) {
                File::makeDirectory(
                    $makePath($path, "original")
                );
                File::makeDirectory(
                    $makePath($path, "work")
                );
            };
            FileTreeIterator::iterate(
                $lesson->host_app_directory_path,
                $fileHandler,
                $folderHandler
            );




            //***** Web用 *****//
            $webDirectoryPath = Path::purchasedLessonWeb($userId, $materialId, $lesson->id);
            mkdir($webDirectoryPath);
            FileUtils::copy(Path::lesson($lesson->id), $webDirectoryPath);
            $env = file_get_contents(Path::append($webDirectoryPath, ".env"));
            $env = str_replace($lesson->data_directory_path, Path::append($webDirectoryPath, "data"), $env);  // TODO: Webのdataディレクトリを一箇所で定義する 
            $env = str_replace($lesson->host_app_directory_path, Path::append($webDirectoryPath, "app"), $env);  // TODO: Webのappディレクトリを一箇所で定義する
            $env = str_replace($lesson->host_logs_directory_path, Path::append($webDirectoryPath, "logs"), $env);   // TODL: Webのlogsディレクトリを一箇所で定義する
            file_put_contents(Path::append($webDirectoryPath, ".env"), $env);
            $fileHandler = function ($path) use ($userId, $materialId, $lesson, $options) {
                $option = null;
                foreach ($options as $o) {
                    if ($o->path === $path) {
                        $option = $o;
                        break;
                    }
                }
                $originalText = file_get_contents($path);
                $workText = $originalText;
                if ($option) {
                    $offset = 0;
                    foreach ($option->questions as $question) {
                        $workText =
                            substr($workText, 0, $question->startIndex - $offset) .
                            substr($workText, $question->endIndex - $offset);
                        $offset += ($question->endIndex - $question->startIndex);
                    }
                }
                $newPath = Path::purchasedLessonWeb(
                    $userId,
                    $materialId,
                    $lesson->id,
                    Path::append(
                        "app",
                        substr($path, strlen($lesson->host_app_directory_path))
                    )
                );
                file_put_contents(
                    $newPath,
                    $workText
                );
            };
            FileTreeIterator::iterate(
                $lesson->host_app_directory_path,
                $fileHandler
            );
        }
    }
}
