<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class ChatRoomUserController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            "user_id" => "required",
            "chat_room_id" => "required",
        ]);
        $user = User::find($request->user_id);
        $user->chatRooms()->attach($request->chat_room_id);
    }
}
