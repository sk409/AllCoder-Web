<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLessonsMaterialsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lesson_material', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->smallInteger("index");
            $table->bigInteger("lesson_id")->unsigned();
            $table->bigInteger("material_id")->unsigned();
            $table->foreign("lesson_id")->references("id")->on("lessons")->onUpdate("cascade")->onDelete("cascade");
            $table->foreign("material_id")->references("id")->on("materials")->onUpdate("cascade")->onDelete("cascade");
            $table->unique(["lesson_id", "material_id"]);
            $table->unique(["index", "material_id"]);
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
        Schema::dropIfExists('lessons_materials');
    }
}
