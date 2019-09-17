<?php

namespace App;

use App\User;
use App\Lesson;
use App\MaterialComment;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{

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
}
