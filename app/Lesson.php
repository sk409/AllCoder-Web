<?php

namespace App;

use App\Folder;
use App\LessonComment;
use App\LessonPort;
use App\Material;
use App\User;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{

    public static function rating(Lesson $lesson): float
    {
        $total = count($lesson->ratings);
        if ($total === 0) {
            return 0;
        }
        $sum = 0;
        foreach ($lesson->ratings as $rate) {
            $sum += $rate->pivot->value;
        }
        return $sum / $total;
    }

    protected $fillable = [
        "title",
        "description",
        "book",
        "console_port",
        "docker_container_id",
        "docker_image_name",
        // "container_name",
        // "preview_port_number",
        // "console_port_number",
        // "host_app_directory_path",
        // "host_logs_directory_path",
        // "container_app_directory_path",
        // "container_logs_directory_path",
        // "lesson_directory_path",
        // "options_directory_path",
        // "data_directory_path",
        "user_id"
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function materials()
    {
        return $this->belongsToMany(Material::class)->withPivot("index")->withTimestamps();
    }

    public function ratings()
    {
        return $this->belongsToMany(User::class, "lesson_ratings")->withPivot("value")->withTimestamps();
    }

    public function comments()
    {
        return $this->hasMany(LessonComment::class);
    }

    public function folders()
    {
        return $this->hasMany(Folder::class);
    }

    public function ports()
    {
        return $this->hasMany(LessonPort::class);
    }
}
