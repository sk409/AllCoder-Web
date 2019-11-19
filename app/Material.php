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

    // public function purchase($userId)
    // {
    //     if ($this->user_id === $userId) {
    //         return;
    //     }
    //     if ($this->purchases()->where("user_id", $userId)->exists()) {
    //         return;
    //     }
    //     $this->purchases()->attach($userId);
    //     foreach($this->lessons as $lesson) {

    //     }
    //     // foreach ($this->lessons as $lesson) {
    //     //     $originalDirectoryPath = Path::purchasedLessonOriginal($userId, $this->id, $lesson->id);
    //     //     $webDirectoryPath = Path::purchasedLessonWeb($userId, $this->id, $lesson->id);
    //     //     $mobileDirectoryPath = Path::purchasedLessonMobile($userId, $this->id, $lesson->id);
    //     //     mkdir($webDirectoryPath, 0755, true);
    //     //     mkdir($mobileDirectoryPath);
    //     //     mkdir(Path::append($mobileDirectoryPath, "options"));
    //     //     FileUtils::copy(Path::lesson($lesson->id), Path::purchasedLessonOriginal($userId, $this->id, $lesson->id));
    //     //     FileUtils::copy(Path::lesson($lesson->id), $webDirectoryPath);
    //     //     FileUtils::copy(Path::lesson($lesson->id), $mobileDirectoryPath);
    //     //     $modifyENV = function ($dataDirectiryPath, $hostAppDirectoryPath, $hostLogsDirectoryPath, $envFilePath) use ($lesson) {
    //     //         $env = file_get_contents($envFilePath);
    //     //         $env = str_replace($lesson->data_directory_path, $dataDirectiryPath, $env);  // TODO: Webのdataディレクトリを一箇所で定義する 
    //     //         $env = str_replace($lesson->host_app_directory_path, $hostAppDirectoryPath, $env);  // TODO: Webのappディレクトリを一箇所で定義する
    //     //         $env = str_replace($lesson->host_logs_directory_path, $hostLogsDirectoryPath, $env);   // TODL: Webのlogsディレクトリを一箇所で定義する
    //     //         file_put_contents($envFilePath, $env);
    //     //     };
    //     //     $modifyENV(
    //     //         Path::append($webDirectoryPath, "data"),
    //     //         Path::append($webDirectoryPath, "app"),
    //     //         Path::append($webDirectoryPath, "logs"),
    //     //         Path::append($webDirectoryPath, ".env")
    //     //     );
    //     //     $modifyENV(
    //     //         Path::append($mobileDirectoryPath, "data"),
    //     //         Path::append($mobileDirectoryPath, "app"),
    //     //         Path::append($mobileDirectoryPath, "logs"),
    //     //         Path::append($mobileDirectoryPath, ".env")
    //     //     );
    //     //     $options = [];
    //     //     $optionFileNames = glob(Path::append($lesson->options_directory_path, "*.json"));
    //     //     foreach ($optionFileNames as $optionFileName) {
    //     //         $options[] = json_decode(file_get_contents($optionFileName));
    //     //         $option = json_decode(file_get_contents($optionFileName));
    //     //         $option->path = Path::append(
    //     //             Path::purchasedLessonOriginal($userId, $this->id, $lesson->id, "app"),
    //     //             substr($option->path, strlen($lesson->host_app_directory_path))
    //     //         );
    //     //         file_put_contents(
    //     //             Path::purchasedLessonMobile(
    //     //                 $userId,
    //     //                 $this->id,
    //     //                 $lesson->id,
    //     //                 Path::append("options", "$option->id.json")
    //     //             ),
    //     //             json_encode($option)
    //     //         );
    //     //     }
    //     //     $fileHandler = function ($path) use ($userId, $lesson, $options) {
    //     //         $option = null;
    //     //         foreach ($options as $o) {
    //     //             if ($o->path === $path) {
    //     //                 $option = $o;
    //     //                 break;
    //     //             }
    //     //         }
    //     //         $originalText = file_get_contents($path);
    //     //         $workText = $originalText;
    //     //         if ($option) {
    //     //             $offset = 0;
    //     //             foreach ($option->questions as $question) {
    //     //                 $workText =
    //     //                     substr($workText, 0, $question->startIndex - $offset) .
    //     //                     substr($workText, $question->endIndex - $offset);
    //     //                 $offset += ($question->endIndex - $question->startIndex);
    //     //             }
    //     //         }
    //     //         $newPathWeb = Path::purchasedLessonWeb(
    //     //             $userId,
    //     //             $this->id,
    //     //             $lesson->id,
    //     //             Path::append(
    //     //                 "app",
    //     //                 substr($path, strlen($lesson->host_app_directory_path))
    //     //             )
    //     //         );
    //     //         $newPathMobile = Path::purchasedLessonMobile(
    //     //             $userId,
    //     //             $this->id,
    //     //             $lesson->id,
    //     //             Path::append(
    //     //                 "app",
    //     //                 substr($path, strlen($lesson->host_app_directory_path))
    //     //             )
    //     //         );
    //     //         file_put_contents(
    //     //             $newPathWeb,
    //     //             $workText
    //     //         );
    //     //         file_put_contents(
    //     //             $newPathMobile,
    //     //             $workText
    //     //         );
    //     //     };
    //     //     FileTreeIterator::iterate(
    //     //         $lesson->host_app_directory_path,
    //     //         $fileHandler
    //     //     );
    //     // }
    // }
}
