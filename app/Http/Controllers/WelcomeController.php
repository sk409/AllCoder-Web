<?php

namespace App\Http\Controllers;

use App\Material;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;

class WelcomeController extends Controller
{


    public function welcome(Request $request): Renderable
    {
        return view("welcome", [
            "popularMaterials" => Material::all(),
        ]);
    }
}
