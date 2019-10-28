<?php

namespace App;

use App\Folder;
use App\Material;
use App\LessonComment;
use App\User;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{

    protected $fillable = [
        "title",
        "description",
        "book",
        "container_name",
        "preview_port_number",
        "console_port_number",
        "host_app_directory_path",
        "host_logs_directory_path",
        "host_options_directory_path",
        "container_app_directory_path",
        "container_logs_directory_path",
        "compose_directory_path",
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

    public function evaluations()
    {
        return $this->belongsToMany(User::class, "lesson_evaluations")->withPivot("value")->withTimestamps();
    }

    public function comments()
    {
        return $this->hasMany(LessonComment::class);
    }

    public function folders()
    {
        return $this->hasMany(Folder::class);
    }
}
