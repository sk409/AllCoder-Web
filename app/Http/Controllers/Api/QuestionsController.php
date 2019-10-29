<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Lesson;
use App\Path;
use Illuminate\Http\Request;

class QuestionsController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            "user_id" => "required",
            "material_id" => "required",
            "lesson_id" => "required",
            "question_id" => "required",
            "input" => "required",
        ]);
        $lesson = Lesson::find($request->lesson_id);
        if (is_null($lesson)) {
            return;
        }
        $found = false;
        $optionFileNames = glob(
            Path::purchasedLessonOptions(
                $request->user_id,
                $request->material_id,
                $request->lesson_id,
                "*.json"
            )
        );
        foreach ($optionFileNames as $optionFileName) {
            $option = json_decode(file_get_contents($optionFileName));
            foreach ($option->questions as $index => $question) {
                if ($question->id == $request->question_id) {
                    $option->questions[$index]->input = $request->input;
                    file_put_contents($optionFileName, json_encode($option));
                    $found = true;
                    break;
                }
            }
            if ($found) {
                break;
            }
        }
    }
}
