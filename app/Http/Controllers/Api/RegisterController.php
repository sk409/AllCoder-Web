<?php

namespace App\Http\Controllers\Api;

use App\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\UserRegistrationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use stdClass;

class RegisterController extends Controller
{

    public function register(UserRegistrationRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        return $user->id;
    }
}
