<?php

namespace App;

use App\User;
use App\Lesson;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    
    protected $fillable = ["title", "description", "price", "thumbnail_image_blob", "user_id"];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function lessons()
    {
        return $this->belongsToMany(Lesson::class)->withPivot("index");
    }

}
