<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInvitationRequests extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invitation_requests', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger("sender_user_id")->unsigned();
            $table->bigInteger("receiver_user_id")->unsigned();
            $table->bigInteger("chat_room_id")->unsigned();
            $table->foreign("sender_user_id")->references("id")->on("users");
            $table->foreign("receiver_user_id")->references("id")->on("users");
            $table->foreign("chat_room_id")->references("id")->on("chat_rooms");
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
        Schema::dropIfExists('invitation_requests');
    }
}
