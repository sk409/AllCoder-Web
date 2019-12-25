<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class FollowersController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            "follower_user_id" => "required",
            "following_user_id" => "required",
        ]);
        if ($request->follower_user_id === $request->following_user_id) {
            return;
        }
        $follower = User::find($request->follower_user_id);
        $follower->followings()->attach($request->following_user_id);
        $following = User::find($request->following_user_id);
        $following->followers()->attach($request->follower_user_id);
    }
}
