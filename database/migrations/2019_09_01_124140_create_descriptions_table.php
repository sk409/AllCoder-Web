<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDescriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('descriptions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->smallInteger("index")->unsigned();
            $table->string("text", 512);
            $table->bigInteger("file_id")->unsigned();
            $table->timestamps();
            $table->foreign("file_id")->references("id")->on("files")->onUpdate("cascade")->onDelete("cascade");
            $table->unique(["index", "file_id"]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('descriptions');
    }
}
