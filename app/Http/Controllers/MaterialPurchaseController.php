<?php

namespace App\Http\Controllers;

use App\Lesson;
use App\Material;
use Illuminate\Http\Request;

class MaterialPurchaseController extends Controller
{

    public function show($id)
    {
        $material = Material::find($id);
        $material->rating = Material::rating($material);
        foreach ($material->lessons as $lesson) {
            $lesson->rating = Lesson::rating($lesson);
        }
        return view("material_purchase_show", [
            "material" => $material
        ]);
    }

    public function purchase(Request $request, $id)
    {
        //return $request->all();
        $request->validate([
            "user_id" => "required",
        ]);
        $material = Material::find($id);
        return $material->purchase($request->user_id);
    }
}
