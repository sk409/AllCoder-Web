<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Contracts\Support\Renderable;
use App\User;
use App\Lesson;

class DevelopmentController extends Controller
{
    
    public function index($lessonId): Renderable {
        $lesson = Lesson::find($lessonId);
        $user = User::find($lesson->user_id);
        return view("development", ["user" => $user, "lesson" => $lesson]);
    }

}
