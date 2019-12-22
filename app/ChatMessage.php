<?php

namespace App;

use App\User;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = ["text", "user_id", "chat_room_id"];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
