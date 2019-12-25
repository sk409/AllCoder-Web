<?php

namespace App\Http\Controllers;

use App\CodeQuestionAnswer;
use Illuminate\Http\Request;

class CodeQuestionAnswersController extends Controller
{
    public function index(Request $request)
    {
        return Controller::narrowDownFromConditions(
            $request->all(),
            "\App\CodeQuestionAnswer"
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            "text" => "required|max:512",
            "user_id" => "required",
            "material_id" => "required",
            "lesson_id" => "required",
            "code_question_id" => "required",
        ]);
        CodeQuestionAnswer::create($request->all());
    }
}
