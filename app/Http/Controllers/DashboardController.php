<?php

namespace App\Http\Controllers;

use App\CodeQuestion;
use App\LearningResult;
use App\Lesson;
use App\Material;
use App\User;
use DateTime;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Support\Facades\Auth;
use stdClass;

class DashboardController extends Controller
{

    public function __construct()
    {
        //
        $this->middleware('auth');
    }

    public function purchasedMaterials(): Renderable
    {
        $user = Auth::user();
        $materials = $user->purchases;
        return view("dashboard_purchased_materials", [
            "__header" => "abc",
            "user" => $user,
            "materials" => $materials,
            "activeIndex" => "1",
        ]);
    }

    public function createdMaterials(): Renderable
    {
        $user = Auth::user();
        $materials = $user->materials;
        return view('dashboard_created_materials', [
            "__header" => "",
            "user" => $user,
            "materials" => $materials,
            "activeIndex" => 2,
        ]);
    }

    public function lessons(): Renderable
    {
        $user = Auth::user();
        $lessons = Lesson::where("user_id", $user->id)->get()->all();
        return view('dashboard_lessons', [
            "__header" => "",
            "user" => $user, "lessons" => $lessons,
            "activeIndex" => 3,
        ]);
    }

    public function followings(): Renderable
    {
        return view("dashboard_followings", [
            "__header" => "",
            "user" => Auth::user(),
            "activeIndex" => 4,
        ]);
    }

    public function followers(): Renderable
    {
        return view("dashboard_followers", [
            "__header" => "",
            "user" => Auth::user(),
            "activeIndex" => 5,
        ]);
    }

    public function chatRooms(): Renderable
    {
        $user = User::find(Auth::user()->id);
        return view("dashboard_chat_rooms", [
            "__header" => "",
            "user" => $user,
            "activeIndex" => 6,
        ]);
    }

    public function review(): Renderable
    {
        $user = User::find(Auth::user()->id);
        $learningResults = LearningResult::where("user_id", $user->id)->get()->all();
        $review = [];
        foreach ($learningResults as $learningResult) {
            $interval = [1, 7, 16, 35];
            $index = min(count($interval) - 1, $learningResult->count);
            $optimalInteval = $interval[$index] * ($learningResult->evaluation - 1);
            $updatedAt = new DateTime($learningResult->update_at);
            //$now = new DateTime();
            ////////////////
            $now = new DateTime("2030-12-20 12:20:23");
            ////////////////
            $days = $updatedAt->diff($now)->days;
            if ($optimalInteval <= $days || $learningResult->evaluation == 1) {
                if (!array_key_exists($learningResult->material_id, $review)) {
                    $r = new stdClass;
                    $r->material = Material::find($learningResult->material_id);
                    $r->lessons = [];
                    $review[$learningResult->material_id] = $r;
                }
                $r = $review[$learningResult->material_id];
                if (!array_key_exists($learningResult->lesson_id, $r->lessons)) {
                    $lesson = new stdClass;
                    $lesson->object = Lesson::find($learningResult->lesson_id);
                    $lesson->codeQuestions = [];
                    $r->lessons[$learningResult->lesson_id] = $lesson;
                }
                $lesson = $r->lessons[$learningResult->lesson_id];
                $codeQuestion = CodeQuestion::find($learningResult->code_question_id);
                $lesson->codeQuestions[$codeQuestion->file_path][] = $codeQuestion;
            }
        }
        return view("dashboard_review", [
            "__header" => "",
            "user" => $user,
            "review" => $review,
            "activeIndex" => 7,
        ]);
    }
}
