<?php

namespace App;


class Question
{

    public $id = 0;
    public $startIndex = 0;
    public $endIndex = 0;
    public $answer = "";
    public $input = "";

    public function __construct(
        int $id,
        $startIndex,
        $endIndex,
        string $answer,
        string $input
    ) {
        $this->id = $id;
        $this->startIndex = $startIndex;
        $this->endIndex = $endIndex;
        $this->answer = $answer;
        $this->input = $input;
    }
}

// use App\Description;
// use App\InputButton;
// use Illuminate\Database\Eloquent\Model;

// class Question extends Model
// {
//     protected $fillable = ["index", "description_id"];

//     public function description()
//     {
//         return $this->belongsTo(Description::class);
//     }

//     public function inputButtons()
//     {
//         return $this->hasMany(InputButton::class);
//     }
// }
