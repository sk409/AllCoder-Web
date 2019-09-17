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
        if ($request->has("user_id") && $request->file("thumbnail_image")) {
            $fileName = $request->file("thumbnail_image")->getClientOriginalName();
            $userId = $request->user_id;
            $materialId = $material->id;
            $path = "material-thumbnail-image/" . $userId . "/" . $materialId;
            $request->file("thumbnail_image")->storeAs("public/" . $path, $fileName);
            $material->update(["thumbnail_image_path" => "storage/" . $path . "/" . $fileName]);
        }
        $this->establishRelationshipWithLessons($material, $request->lessonIds);
        return redirect()->route("dashboard.materials");
    }

    public function create(): Renderable
    {
        $user = Auth::user();
        return view("materials/create", [
            "user" => $user,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $material = Material::find($id);
        $material->fill($request->all())->save();
        $material->lessons()->detach();
        $this->establishRelationshipWithLessons($material, $request->lessonIds);
        return redirect()->route("dashboard.materials");
    }

    public function edit(int $id)
    {
        $material = Material::find($id);
        return view("materials/edit", [
            "material" => $material,
            "lessons" => $material->user->lessons,
            "user" => $material->user,
        ]);
    }

    private function establishRelationshipWithLessons($material, $lessonIds)
    {
        foreach ($lessonIds as $index => $lessonId) {
            $material->lessons()->attach(
                $lessonId,
                ["index" => $index]
            );
        }
    }
}
