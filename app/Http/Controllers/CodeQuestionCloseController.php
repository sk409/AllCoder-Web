<?php

namespace App\Http\Controllers;

use App\CodeQuestionClose;
use Illuminate\Http\Request;

class CodeQuestionCloseController extends Controller
{
    public function store(Request $request)
    {
        // return $request->all();
        $request->validate([
            "text" => "required|max:256",
            "comment" => "required|max:512",
            "score" => "required",
            "code_question_id" => "required",
        ]);
        $codeQuestionClose = CodeQuestionClose::create($request->all());
        return $codeQuestionClose->id;
    }
}
