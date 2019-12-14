<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCodeQuestionClosesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('code_question_closes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string("text", 256);
            $table->string("comment", 512)->default("");
            $table->smallInteger("score")->unsigned();
            $table->bigInteger("code_question_id")->unsigned();
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
        Schema::dropIfExists('code_question_closes');
    }
}
