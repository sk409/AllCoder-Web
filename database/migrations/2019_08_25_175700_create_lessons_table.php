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
            $table->string("container_name", 64);
            $table->bigInteger("user_id")->unsigned();
            $table->bigInteger("nginx_port_number")->unsigned();
            $table->bigInteger("gotty_port_number")->unsigned();
            $table->foreign("user_id")->references("id")->on("users")->onUpdate("cascade")->onDelete("cascade");
            $table->foreign("nginx_port_number")->references("id")->on("ports")->onUpdate("cascade");
            $table->foreign("gotty_port_number")->references("id")->on("ports")->onUpdate("cascade");
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
