<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLessonRatingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lesson_ratings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->tinyInteger("value")->unsigned();
            $table->bigInteger("user_id")->unsigned();
            $table->bigInteger("lesson_id")->unsigned();
            $table->foreign("user_id")->references("id")->on("users")->onUpdate("cascade")->onDelete("cascade");
            $table->foreign("lesson_id")->references("id")->on("lessons")->onUpdate("cascade")->onDelete("cascade");
            $table->unique(["user_id", "lesson_id"]);
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
        Schema::dropIfExists('lesson_ratings');
    }
}
