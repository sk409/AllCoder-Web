<?php

namespace App\Http\Controllers;

use App\Lesson;
use Illuminate\Http\Request;

class LessonRatingsController extends Controller
{

    public function update(Request $request)
    {
        $request->validate([
            "lesson_id" => "required",
            "user_id" => "required",
            "value" => "required",
        ]);
        $lesson = Lesson::find($request->lesson_id);
        $rate = $lesson->ratings->where("id", $request->user_id)->all();
        if (1 === count($rate)) {
            $lesson->ratings()->detach($request->user_id);
        }
        $lesson->ratings()->attach($request->user_id, ["value" => $request->value]);
    }
}
