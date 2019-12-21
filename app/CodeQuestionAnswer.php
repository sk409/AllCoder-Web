<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CodeQuestionAnswer extends Model
{
    protected $fillable = ["text", "user_id", "material_id", "lesson_id", "code_question_id"];
}
