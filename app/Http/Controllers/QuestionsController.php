<?php

namespace App\Http\Controllers;

use App\Question;
use Illuminate\Http\Request;

class QuestionsController extends Controller
{
    
    public function store(Request $request) {
        $question = Question::create($request->all());
        return $question->id;
    }

    public function update(Request $request, int $id) {
        Question::find($id)->fill($request->all())->save();
    }
    
    public function destroy(Request $request, int $id) {
        Question::destroy($id);
    }

    public function fetch(Request $request)
    {
        return Controller::narrowDownFromConditions(
            $request,
            "\App\Question::all",
            "\App\Question::where"
        );
    }

}
