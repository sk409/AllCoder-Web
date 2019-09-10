<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UsersController extends Controller
{

    public function index(Request $request)
    {
        $users = Controller::narrowDownFromConditions(
            $request->all(),
            "\App\User"
        );
        return $users;
    }
}
