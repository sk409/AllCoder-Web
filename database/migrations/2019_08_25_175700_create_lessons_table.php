<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLessonsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string("title", 128);
            $table->string("description", 1024)->default("");
            $table->text("book");
            $table->string("container_name", 64);
            $table->smallInteger("preview_port_number")->unsigned()->nullable();
            $table->smallInteger("console_port_number")->unsigned()->nullable();
            $table->string("host_app_directory_path", 256);
            $table->string("host_logs_directory_path", 256);
            $table->string("host_options_directory_path", 256);
            $table->string("container_app_directory_path", 256);
            $table->string("container_logs_directory_path", 256);
            $table->string("compose_directory_path", 256);
            $table->bigInteger("user_id")->unsigned();
            $table->foreign("user_id")->references("id")->on("users")->onUpdate("cascade")->onDelete("cascade");
            $table->unique(["title", "user_id"]);
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
        Schema::dropIfExists('lessons');
    }
}
