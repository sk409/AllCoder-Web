<?php

namespace App\Http\Controllers;

use App\Material;
use Illuminate\Http\Request;

class MaterialPurchaseController extends Controller
{

    public function show($id)
    {
        $material = Material::find($id);
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
