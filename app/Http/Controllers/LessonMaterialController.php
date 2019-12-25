<?php

namespace App\Http\Controllers;

use App\Lesson;
use App\Material;
use App\StatusCode;
use Illuminate\Http\Request;

class LessonMaterialController extends Controller
{
    public function index(Request $request)
    {
        $lesson = Lesson::find($request->lesson_id);
        $material = Material::find($request->material_id);
        if ($request->has("lesson_id") && $request->has("material_id")) {
            return $lesson->materials->where("id", $material->id)->all();
        } else if ($request->has("lesson_id")) {
            return $lesson->materials->all();
        } else if ($request->has("material_id")) {
            return $material->lessons->all();
        }
        return response("", StatusCode::badRequest());
    }
}
