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
            "user_id" => "required",
        ]);
        $chatRoom = ChatRoom::create($request->all());
        $user = User::find($request->user_id);
        $user->chatRooms()->attach($chatRoom->id);
    }

    public function show(int $id)
    {
        $chatRoom = ChatRoom::find($id);
        if (is_null($chatRoom)) {
            Error::notFound();
        }
        $user = User::find(Auth::user()->id);
        $attended = false;
        foreach ($user->chatRooms->all() as $c) {
            if ($chatRoom->id === $c->id) {
                $attended = true;
                break;
            }
        }
        if (!$attended) {
            Error::notFound();
        }
        return view("chat_room_show", [
            "user" => $user,
            "chatRoom" => $chatRoom,
        ]);
    }
}
