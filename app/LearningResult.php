<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LearningResult extends Model
{
    // $table->bigIncrements('id');
    //         $table->smallInteger("evaluation")->unsigned();
    //         $table->smallInteger("count")->unsigned();
    //         $table->bigInteger("user_id")->unsigned();
    //         $table->bigInteger("material_id")->unsigned();
    //         $table->bigInteger("lesson_id")->unsigned();
    //         $table->bigInteger("code_question_id")->unsigned();
    //         $table->foreign("user_id")->references("id")->on("users");
    //         $table->foreign("material_id")->references("id")->on("materials");
    //         $table->foreign("lesson_id")->references("id")->on("lessons");
    //         $table->foreign("code_question_id")->references("id")->on("code_questions");
    //         $table->timestamps();
    protected $fillable = ["evaluation", "count", "user_id", "material_id", "lesson_id", "code_question_id"];
}
