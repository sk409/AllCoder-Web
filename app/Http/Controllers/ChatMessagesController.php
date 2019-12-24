<?php

namespace App\Http\Controllers;

use App\ChatMessage;
use App\Events\NewChatMessage;
use Illuminate\Http\Request;

class ChatMessagesController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            "text" => "required|max:512",
            "user_id" => "required",
            "chat_room_id" => "required",
        ]);
        $chatMessage = ChatMessage::create($request->all());
        $event =  new NewChatMessage($chatMessage);
        broadcast($event);
        return $chatMessage->id;
    }
}
