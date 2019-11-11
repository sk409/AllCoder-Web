<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Auth;
use App\Lesson;

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
            "user" => $user, "lessons" => $lessons,
            "activeIndex" => 3,
        ]);
    }
}
