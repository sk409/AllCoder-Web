<?php

namespace App\Http\Controllers;

use Auth;
use App\Lesson;
use App\Material;
use App\Http\Requests\LessonCreationRequest;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;

class LessonsController extends Controller
{

    public function create(): Renderable
    {
        $lesson = new Lesson();
        return view("lessons.create", [
            "lesson" => $lesson,
            "user" => Auth::user(),
        ]);
    }

    public function store(LessonCreationRequest $request)
    {
        $lesson = Lesson::create($request->all());
        return redirect("development/" . $lesson->id);
    }
}
