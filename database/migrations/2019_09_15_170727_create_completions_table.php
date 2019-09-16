<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompletionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('completions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger("user_id")->unsigned();
            $table->bigInteger("material_id")->unsigned();
            $table->bigInteger("lesson_id")->unsigned();
            $table->timestamps();
            $table->foreign("user_id")->references("id")->on("users")->onUpdate("cascade")->onDelete("cascade");
            $table->foreign("material_id")->references("id")->on("materials")->onUpdate("cascade")->onDelete("cascade");
            $table->foreign("lesson_id")->references("id")->on("lessons")->onUpdate("cascade")->onDelete("cascade");
            $table->unique(["user_id", "material_id", "lesson_id"]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('completions');
    }
}
