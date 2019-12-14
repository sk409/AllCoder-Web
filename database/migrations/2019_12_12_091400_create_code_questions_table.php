<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCodeQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('code_questions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string("file_path", 256);
            $table->integer("start_index")->unsigned();
            $table->integer("end_index")->unsigned();
            $table->string("text", 256);
            $table->string("correct_comment", 512)->default("");
            $table->smallInteger("score")->unsigned();
            $table->string("incorrect_comment", 512)->default("");
            $table->bigInteger("lesson_id")->unsigned();
            $table->foreign("lesson_id")->references("id")->on("lessons");
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
        Schema::dropIfExists('code_questions');
    }
}
