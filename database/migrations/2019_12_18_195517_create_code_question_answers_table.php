<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCodeQuestionAnswersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('code_question_answers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string("text", 512);
            $table->bigInteger("user_id")->unsigned();
            $table->bigInteger("material_id")->unsigned();
            $table->bigInteger("lesson_id")->unsigned();
            $table->bigInteger("code_question_id")->unsigned();
            $table->foreign("user_id")->references("id")->on("users");
            $table->foreign("material_id")->references("id")->on("materials");
            $table->foreign("lesson_id")->references("id")->on("lessons");
            $table->foreign("code_question_id")->references("id")->on("code_questions");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('code_question_answers');
    }
}
