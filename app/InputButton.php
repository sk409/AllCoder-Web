<?php

namespace App;

use App\Question;
use Illuminate\Database\Eloquent\Model;

class InputButton extends Model
{

    protected $fillable = ["index", "start_index", "end_index", "question_id"];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
