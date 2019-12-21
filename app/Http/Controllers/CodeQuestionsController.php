<?php

namespace App\Http\Controllers;

use App\CodeQuestion;
use Illuminate\Http\Request;

class CodeQuestionsController extends Controller
{
    public function store(Request $request)
    {
        // return $request->all();
        $request->validate([
            "file_path" => "required|max:256",
            "start_index" => "required",
            "end_index" => "required",
            "text" => "required|max:256",
            "score" => "required",
            "correct_comment" => "required|max:512",
            "incorrect_comment" => "required|max:512",
            "lesson_id" => "required",
        ]);
        $codeQuestion = CodeQuestion::create($request->all());
        return $codeQuestion->id;
    }

    public function update(Request $request)
    {
        // return $request->all();
        $request->validate([
            "id" => "required",
            "file_path" => "required|max:256",
            "start_index" => "required",
            "end_index" => "required",
            "text" => "required|max:256",
            "score" => "required",
            "correct_comment" => "required|max:512",
            "incorrect_comment" => "required|max:512",
            "lesson_id" => "required",
            "answered" => "required",
        ]);
        CodeQuestion::find($request->id)->fill($request->all())->save();
    }
}
