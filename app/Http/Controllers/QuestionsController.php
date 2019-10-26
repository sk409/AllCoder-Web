<?php

namespace App\Http\Controllers;

use App\Lesson;
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
            "lesson_id" => "required",
        ]);
        $found = false;
        $lesson = Lesson::find($request->lesson_id);
        foreach (glob($lesson->host_options_directory_path . "/*.json") as $fileName) {
            $option = json_decode(file_get_contents($fileName));
            if ($option->path !== $request->path) {
                continue;
            }
            $question = new stdClass();
            $question->id = count($option->questions);
            $question->start_index = $request->start_index;
            $question->end_index = $request->end_index;
            $option->questions[] = $question;
            $text = json_encode($option);
            File::put($fileName, $text);
            $found = true;
            break;
        }
        if (!$found) {
            $lesson = Lesson::find($request->lesson_id);
            iterator_count(new FilesystemIterator($lesson->host_options_directory_path, FilesystemIterator::SKIP_DOTS));
            $fileName = $lesson->host_options_directory_path . "/" . iterator_count(new FilesystemIterator($lesson->host_options_directory_path, FilesystemIterator::SKIP_DOTS)) . ".json";
            $content = new stdClass();
            $content->path = $request->path;
            $content->questions = [];
            $question = new stdClass();
            $question->id = 0;
            $question->start_index = $request->start_index;
            $question->end_index = $request->end_index;
            $content->questions[] = $question;
            $text = json_encode($content);
            File::put($fileName, $text);
        }
    }

    // public function index(Request $request)
    // {
    //     return Controller::narrowDownFromConditions(
    //         $request->all(),
    //         "\App\Question"
    //     );
    // }

    // public function store(Request $request)
    // {
    //     $question = Question::create($request->all());
    //     return $question->id;
    // }

    // public function update(Request $request, int $id)
    // {
    //     Question::find($id)->fill($request->all())->save();
    // }

    // public function destroy(Request $request, int $id)
    // {
    //     Question::destroy($id);
    // }
}
