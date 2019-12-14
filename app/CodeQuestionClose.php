<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CodeQuestionClose extends Model
{
    protected $fillable = ["text", "comment", "score", "code_question_id"];
}
