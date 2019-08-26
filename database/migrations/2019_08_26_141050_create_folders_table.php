<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFoldersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('folders', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string("name", 128);
            $table->bigInteger("parent_folder_id")->unsigned()->nullable(true);
            $table->bigInteger("lesson_id")->unsigned();
            $table->timestamps();
            $table->foreign("parent_folder_id")->references("id")->on("folders")->onUpdate("cascade")->onDelete("cascade");
            $table->foreign("lesson_id")->references("id")->on("lessons")->onUpdate("cascade")->onDelete("cascade");
            $table->unique(["name", "parent_folder_id", "lesson_id"]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('folders');
    }
}
