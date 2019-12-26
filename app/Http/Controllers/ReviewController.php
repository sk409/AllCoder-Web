<?php

namespace App\Http\Controllers;

use App\CodeQuestion;
use App\Error;
use App\LearningResult;
use App\Lesson;
use App\Material;
use App\Path;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function review(Request $request)
    {
        $request->validate([
            "user_id" => "required",
            "material_id" => "required",
            "lesson_id" => "required",
            "code_question_ids" => "required",
            "file_path" => "required|max:256",
        ]);
        $user = User::find($request->user_id);
        if ($user->id !== Auth::user()->id) {
            Error::badRequest();
            return;
        }
        $material = Material::find($request->material_id);
        $lesson = Lesson::find($request->lesson_id);
        $codeQuestions = [];
        foreach ($request->code_question_ids as $codeQuestionId) {
            $codeQuestion = CodeQuestion::find($codeQuestionId);
            $codeQuestionAnswers = $codeQuestion->answers()
                ->where("user_id", $request->user_id)
                ->where("material_id", $request->material_id)
                ->where("lesson_id", $request->lesson_id)
                ->get()->all();
            if (1 !== count($codeQuestionAnswers)) {
                continue;
            }
            $codeQuestionAnswer = $codeQuestionAnswers[0];
            if ($codeQuestion->text !== $codeQuestionAnswer->text) {
                continue;
            }
            $codeQuestions[] = $codeQuestion;
        }
        usort($codeQuestions, function ($a, $b) {
            return $a->start_index - $b->start_index;
        });
        foreach ($lesson->codeQuestions->all() as $c1) {
            // if (in_array($c1->id, $request->code_question_ids, true)) {
            //     continue;
            // }
            $answers = $c1->answers()
                ->where("user_id", $request->user_id)
                ->where("material_id", $request->material_id)
                ->where("lesson_id", $request->lesson_id)
                ->get()->all();
            //echo json_encode($answers[0]);
            if (1 === count($answers)) {
                $answer = $answers[0];
                if ($answer->text === $c1->text) {
                    continue;
                }
            }
            foreach ($codeQuestions as $c2) {
                if ($c2->start_index < $c1->start_index) {
                    break;
                }
                $c2->start_index -= strlen($c1->text);
                $c2->end_index -= strlen($c1->text);
            }
        }
        $lessonDirectoryPathPurchased = Path::purchasedLesson($user->id, $material->id, $lesson->id, "");
        $infoFilePath = Path::append($lessonDirectoryPathPurchased, "info.json");
        $info = json_decode(file_get_contents($infoFilePath));
        $output = [];
        exec("docker container exec -it $info->docker_container_id cat $request->file_path", $output);
        $fileText = implode("\n", $output);
        $newText = "";
        $startIndex = 0;
        foreach ($codeQuestions as $codeQuestion) {
            $newText .= substr($fileText, $startIndex, $codeQuestion->start_index - $startIndex);
            $startIndex = $codeQuestion->end_index;
            $codeQuestion->answers()
                ->where("user_id", $request->user_id)
                ->where("material_id", $request->material_id)
                ->where("lesson_id", $request->lesson_id)
                ->delete();
        }
        $newText .= substr($fileText, $startIndex, strlen($fileText) - $startIndex);
        // return htmlspecialchars($newText);
        $tmpFilePath = storage_path(uniqid());
        file_put_contents($tmpFilePath, $newText);
        $output = [];
        exec("docker container cp $tmpFilePath $info->docker_container_id:$request->file_path", $output);
        return redirect("/development/learning?user_id=$request->user_id&material_id=$request->material_id&lesson_id=$request->lesson_id&file_path=$request->file_path");
    }
}
