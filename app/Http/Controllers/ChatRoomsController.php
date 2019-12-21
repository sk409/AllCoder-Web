<?php

namespace App\Http\Controllers;

use App\ChatRoom;
use App\User;
use App\Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatRoomsController extends Controller
{
    public function create()
    {
        $user = User::find(Auth::user()->id);
        if (is_null($user)) {
            Error::notFound();
        }
        return view("chat_room_create", [
            "user" => $user
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            "name" => "required|max:128",
        ]);
        ChatRoom::create($request->all());
    }
}
