<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Contracts\Support\Renderable;
use Auth;
use App\Lesson;
use App\Http\Requests\CreateLessonRequest;

class LessonsController extends Controller
{
    
    public function create(): Renderable {
        $lesson = new Lesson();
        return view("lessons.create", [
            "lesson" => $lesson,
            "user" => Auth::user(),
        ]);
    }

    public function store(CreateLessonRequest $request) {
        $user = Auth::user();
        $lesson = Lesson::create($request->all());
        return redirect("development/" . $lesson->id);
    }

}
