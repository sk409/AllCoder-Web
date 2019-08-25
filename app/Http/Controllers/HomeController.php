<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Contracts\Support\Renderable;
use Auth;
use App\Lesson;

class HomeController extends Controller
{
    
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function materials(): Renderable
    {
        $user = Auth::user();
        $materials = [];
        return view('home/materials', ["user" => $user, "materials" => $materials]);
    }

    public function lessons(): Renderable {
        $user = Auth::user();
        $lessons = Lesson::where("user_id", $user->id)->get()->all();
        return view('home/lessons', ["user" => $user, "lessons" => $lessons]);
    }

}
