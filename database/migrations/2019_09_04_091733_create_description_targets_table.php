<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDescriptionTargetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('description_targets', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->smallInteger("start_index")->unsigned();
            $table->smallInteger("end_index")->unsigned();
            $table->bigInteger("description_id")->unsigned();
            $table->timestamps();
            $table->foreign("description_id")->references("id")->on("descriptions")->onUpdate("cascade")->onDelete("cascade");
            $table->unique(["start_index", "end_index", "description_id"]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('description_targets');
    }
}
