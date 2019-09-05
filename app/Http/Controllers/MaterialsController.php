<?php

namespace App\Http\Controllers;

use Auth;
use App\Material;
use App\Lesson;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;

class MaterialsController extends Controller
{

    public function store(Request $request)
    {
        $material = Material::create($request->all());
        $this->establishRelationShipWithLessons($material, $request->lessonIds);
        return redirect()->route("dashboard.materials");
    }
    
    public function create(): Renderable {
        $material = new Material();
        $material->title = "";
        $material->description = "";
        $user = Auth::user();
        $lessons = Lesson::where("user_id", $user->id)->get();
        return view("materials/create", [
            "material" => $material,
            "lessons" => $lessons,
            "user" => $user,
            "pageTitle" => "新規教材作成",
            "method" => "post",
            "action" => route("materials.store"),
            "submitButtonText" => "作成"
        ]);
    }

    public function update(Request $request, int $id) {
        $material = Material::find($id);
        $material->lessons()->detach();
        $material->fill($request->all())->save();
        $this->establishRelationShipWithLessons($material, $request->lessonIds);
        return redirect()->route("dashboard.materials");
    }

    public function edit(int $id) {
        $material = Material::find($id);
        return view("materials/edit",[
            "material" => $material,
            "lessons" => $material->user->lessons,
            "user" => $material->user,
            "pageTitle" => "教材編集",
            "method" => "put",
            "action" => route("materials.update", $material->id),
            "submitButtonText" => "適用"
        ]);
    }

    private function establishRelationShipWithLessons($material, $lessonIds) {
        foreach ($lessonIds as $index => $lessonId) {
            $material->lessons()->attach(
                $lessonId,
                ["index" => $index]
            );
        }
    }

}
