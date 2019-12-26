<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLearningResultsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('learning_results', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->smallInteger("evaluation")->unsigned();
            $table->smallInteger("count")->unsigned();
            $table->bigInteger("user_id")->unsigned();
            $table->bigInteger("material_id")->unsigned();
            $table->bigInteger("lesson_id")->unsigned();
            $table->bigInteger("code_question_id")->unsigned();
            $table->foreign("user_id")->references("id")->on("users");
            $table->foreign("material_id")->references("id")->on("materials");
            $table->foreign("lesson_id")->references("id")->on("lessons");
            $table->foreign("code_question_id")->references("id")->on("code_questions");
            $table->unique(["user_id", "material_id", "lesson_id", "code_question_id"])->name("unique_uid_mid_lid_cqid");
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
        Schema::dropIfExists('learning_results');
    }
}
