<?php

namespace App;

use App\ChatRoom;
use App\User;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = ["text", "user_id", "chat_room_id"];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function room()
    {
        return $this->belongsTo(ChatRoom::class, "chat_room_id");
    }
}
