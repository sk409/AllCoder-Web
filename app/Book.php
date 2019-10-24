<?php

namespace App;

use App\Lesson;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{

    protected $fillable = ["text", "lesson_id"];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
