<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Auth;
use App\Material;
use App\Lesson;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;

class MaterialsController extends Controller
{

    public function index(Request $request) {
        return Controller::narrowDownFromConditions(
            $request,
            "\App\Material::all",
            "\App\Material::where"
        );
    }

}
