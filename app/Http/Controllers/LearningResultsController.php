<?php

namespace App\Http\Controllers;

use App\Error;
use App\LearningResult;
use Illuminate\Http\Request;

class LearningResultsController extends Controller
{
    public function index(Request $request)
    {
        return Controller::narrowDownFromConditions(
            $request->all(),
            "App\LearningResult"
        );
    }

    public function store(Request $request)
    {
        //return $request->all();
        $request->validate([
            "evaluation" => "required",
            "user_id" => "required",
            "material_id" => "required",
            "lesson_id" => "required",
            "code_question_id" => "required",
        ]);
        $parameters = $request->all();
        $parameters["count"] = 1;
        $learningResult = LearningResult::create($parameters);
        return $learningResult->id;
    }

    public function update(Request $request, int $id)
    {
        // return $request->all();
        $request->validate([
            "id" => "required",
            "evaluation" => "required",
            "count" => "required",
            "user_id" => "required",
            "material_id" => "required",
            "lesson_id" => "required",
            "code_question_id" => "required",
        ]);
        $learningResult = LearningResult::find($id);
        if (is_null($learningResult)) {
            Error::badRequest();
            return;
        }
        $learningResult->fill($request->all());
        $learningResult->save();
        // $learningResult->update($request->all());
    }
}
