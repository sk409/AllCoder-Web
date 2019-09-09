<?php

namespace App;

use App\User;
use App\Material;
use App\Folder;
use App\LessonComment;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{

    protected $fillable = ["title", "description", "user_id"];

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
