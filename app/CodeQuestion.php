<?php

namespace App;

use App\CodeQuestionClose;
use Illuminate\Database\Eloquent\Model;

class CodeQuestion extends Model
{
    protected $fillable = ["file_path", "start_index", "end_index", "text", "score", "correct_comment", "incorrect_comment", "lesson_id"];

    public function closes()
    {
        return $this->hasMany(CodeQuestionClose::class);
    }
}
