<?php

namespace App;

use App\Lesson;
use Illuminate\Database\Eloquent\Model;

class LessonComment extends Model
{

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
