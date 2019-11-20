<?php

namespace App\Http\Controllers;

use App\Lesson;
use App\Path;
use App\Question;
use FilesystemIterator;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;
use stdClass;

class QuestionsController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            "path" => "required",
            "start_index" => "required",
            "end_index" => "required",
            "answer" => "required",
            "lesson_id" => "required",
        ]);
        $parameters = $request->all();
        if ($request->has("input") && is_null($request->input)) {
            $parameters["input"] = "";
        }
        $found = false;
        $lesson = Lesson::find($parameters["lesson_id"]);
        $optionsFileName = glob(Path::lessonQuestion($lesson->id, "*.json"));
        foreach ($optionsFileName as $fileName) {
            $option = json_decode(file_get_contents($fileName));
            if ($option->path !== $parameters["path"]) {
                continue;
            }
            $question = new Question(
                count($option->questions),
                $parameters["start_index"],
                $parameters["end_index"],
                $parameters["answer"],
                $parameters["input"]
            );
            $option->questions[] = $question;
            $text = json_encode($option);
            File::put($fileName, $text);
            $found = true;
            break;
        }
        if (!$found) {
            $optionCount = iterator_count(
                new FilesystemIterator(
                    Path::lessonQuestion($lesson->id),
                    FilesystemIterator::SKIP_DOTS
                )
            );
            $fileName = Path::append(Path::lessonQuestion($lesson->id), "$optionCount.json");
            $option = new stdClass();
            $option->id = $optionCount;
            $option->path = $parameters["path"];
            $option->questions = [];
            $question = new Question(
                0,
                $parameters["start_index"],
                $parameters["end_index"],
                $parameters["answer"],
                $parameters["input"]
            );
            $option->questions[] = $question;
            $text = json_encode($option);
            File::put($fileName, $text);
        }
    }

    //     // public function index(Request $request)
    //     // {
    //     //     return Controller::narrowDownFromConditions(
    //     //         $request->all(),
    //     //         "\App\Question"
    //     //     );
    //     // }

    //     // public function store(Request $request)
    //     // {
    //     //     $question = Question::create($request->all());
    //     //     return $question->id;
    //     // }

    //     // public function update(Request $request, int $id)
    //     // {
    //     //     Question::find($id)->fill($request->all())->save();
    //     // }

    //     // public function destroy(Request $request, int $id)
    //     // {
    //     //     Question::destroy($id);
    //     // }
}
