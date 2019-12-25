<?php

namespace App;

use App\ChatRoom;
use App\User;
use Illuminate\Database\Eloquent\Model;

class InvitationRequest extends Model
{
    protected $fillable = ["sender_user_id", "receiver_user_id", "chat_room_id"];

    public function sender()
    {
        return $this->belongsTo(User::class, "sender_user_id");
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, "receiver_user_id");
    }

    public function room()
    {
        return $this->belongsTo(ChatRoom::class, "chat_room_id");
    }
}
