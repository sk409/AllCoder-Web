<?php

namespace App\Http\Controllers;

use Auth;
use App\Material;
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
        return redirect()->route("dashboard.purchased_materials");
    }

    public function create(): Renderable
    {
        $user = Auth::user();
        return view("material_create", [
            "user" => $user,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $material = Material::find($id);
        $material->fill($request->all())->save();
        $material->lessons()->detach();
        $this->establishRelationshipWithLessons($material, $request->lessonIds);
        return redirect()->route("dashboard.created_materials");
    }

    public function edit(int $id)
    {
        $material = Material::find($id);
        return view("material_edit", [
            "material" => $material,
            "user" => $material->user,
        ]);
    }

    public function show(int $id)
    {
        $material = Material::find($id);
        return view("material_show", [
            "material" => $material
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
