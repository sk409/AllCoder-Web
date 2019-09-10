<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Auth;
use Illuminate\Http\Request;

class LoginController extends Controller
{

    public function login(Request $request)
    {
        $credentials = $request->only(["email", "password"]);
        if (Auth::attempt($credentials)) {
            return Auth::user();
        }
        return "ERROR";
    }
}
