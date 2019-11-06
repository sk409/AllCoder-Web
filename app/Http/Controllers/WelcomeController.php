<?php

namespace App\Http\Controllers;

use App\Material;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;

class WelcomeController extends Controller
{


    public function welcome(): Renderable
    {
        $materials = Material::all();
        foreach ($materials as $material) {
            $material->rating = Material::rating($material);
        }
        return view("welcome", [
            "popularMaterials" => $materials,
        ]);
    }
}
