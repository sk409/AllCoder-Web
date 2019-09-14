<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInputButtonsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('input_buttons', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->smallInteger("index")->unsigned();
            $table->smallInteger("start_index")->unsigned();
            $table->smallInteger("end_index")->unsigned();
            $table->bigInteger("question_id")->unsigned();
            $table->timestamps();
            $table->unique(["question_id", "index"]);
            $table->foreign("question_id")->references("id")->on("questions")->onUpdate("cascade")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('input_buttons');
    }
}
