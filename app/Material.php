<?php

namespace App;

use App\User;
use App\Lesson;
use App\MaterialComment;
use App\Path;
use App\Utils\FileTreeIterator;
use App\Utils\FileUtils;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\File;

class Material extends Model
{

    public static function rating($material): float
    {
        $rating = 0;
        $count = 0;
        foreach ($material->lessons as $lesson) {
            foreach ($lesson->ratings->all() as $r) {
                $rating += $r->pivot->value;
            }
            $count += count($lesson->ratings->all());
        }
        if ($count === 0) {
            return 0;
        }
        return $rating / $count;
    }

    protected $fillable = ["title", "description", "price", "thumbnail_image_path", "user_id"];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lessons()
    {
        return $this->belongsToMany(Lesson::class)->withPivot("index")->withTimestamps();
    }

    public function comments()
    {
        return $this->hasMany(MaterialComment::class);
    }

    public function purchases()
    {
        return $this->belongsToMany(User::class, "purchases");
    }

    // TODO: Web用とモバイル用で別のやり方をしているけど、やり方を統一する。
    //       元々あるディレクトリからスナップショットを作成するWeb用のやり方に統一する方が良さそう。
    public function purchase($userId)
    {
        if ($this->user_id === $userId) {
            return;
        }
        if ($this->purchases()->where("user_id", $userId)->exists()) {
            return;
        }
        $this->purchases()->attach($userId);
        foreach ($this->lessons as $lesson) {
            //***** モバイル用 *****//
            $makePath = function ($path, $switch) use ($lesson, $userId) {
                // TODO: Pathクラスを使った書き方に直す
                $p = ltrim(substr($path, strlen($lesson->host_app_directory_path)), "/");
                if ($switch === "original") {
                    return Path::purchasedLessonOriginal($userId, $this->id, $lesson->id, $p);
                } else if ($switch === "work") {
                    return Path::purchasedLessonWork($userId, $this->id, $lesson->id, $p);
                } else {
                    return Path::purchasedLessonOptions($userId, $this->id, $lesson->id, $p);
                }
            };
            // File::makeDirectory($makePath("", "original"), 0755, true);
            // File::makeDirectory($makePath("", "work"));
            File::makeDirectory($makePath("", "options"), 0755, true);
            FileUtils::copy(
                Path::preview("originals"),
                Path::rtrim(Path::purchasedLesson($userId, $this->id, $lesson->id, ""))
            );
            $dumpedDataFilePath = Path::purchasedLesson($userId, $this->id, $lesson->id, "data.sql");
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
                    Path::purchasedLessonOriginal($userId, $this->id, $lesson->id, ""),
                    substr($option->path, strlen($lesson->host_app_directory_path))
                );
                file_put_contents(
                    Path::purchasedLessonOptions($userId, $this->id, $lesson->id, "$option->id.json"),
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
            $webDirectoryPath = Path::purchasedLessonWeb($userId, $this->id, $lesson->id);
            mkdir($webDirectoryPath);
            FileUtils::copy(Path::lesson($lesson->id), $webDirectoryPath);
            $env = file_get_contents(Path::append($webDirectoryPath, ".env"));
            $env = str_replace($lesson->data_directory_path, Path::append($webDirectoryPath, "data"), $env);  // TODO: Webのdataディレクトリを一箇所で定義する 
            $env = str_replace($lesson->host_app_directory_path, Path::append($webDirectoryPath, "app"), $env);  // TODO: Webのappディレクトリを一箇所で定義する
            $env = str_replace($lesson->host_logs_directory_path, Path::append($webDirectoryPath, "logs"), $env);   // TODL: Webのlogsディレクトリを一箇所で定義する
            file_put_contents(Path::append($webDirectoryPath, ".env"), $env);
            $fileHandler = function ($path) use ($userId, $lesson, $options) {
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
                    $this->id,
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
