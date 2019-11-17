<?php

namespace App;

use App\Lesson;
use Illuminate\Database\Eloquent\Model;

class LessonPort extends Model
{

    protected $fillable = ["port", "lesson_id"];

    public function lesson() {
        return $this->belongsTo(Lesson::class);
    }
}
