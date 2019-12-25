<?php

namespace App;

use App\ChatMessage;
use App\InvitationRequest;
use App\User;
use Illuminate\Database\Eloquent\Model;

class ChatRoom extends Model
{
    protected $fillable = ["name"];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function messages()
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function invitationRequests()
    {
        return $this->hasMany(InvitationRequest::class);
    }
}
