<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMaterialComments extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('material_comments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string("content", 1024);
            $table->bigInteger("parent_comment_id")->unsigned()->nullable();
            $table->bigInteger("user_id")->unsigned();
            $table->bigInteger("material_id")->unsigned();
            $table->foreign("parent_comment_id")->references("id")->on("lesson_comments")->onUpdate("cascade")->onDelete("cascade");
            $table->foreign("user_id")->references("id")->on("users")->onUpdate("cascade")->onDelete("cascade");
            $table->foreign("material_id")->references("id")->on("materials")->onUpdate("cascade")->onDelete("cascade");
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
        Schema::dropIfExists('material_comments');
    }
}
