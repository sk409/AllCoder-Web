<?php

// namespace App\Http\Controllers\Api;

// use App\Material;
// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;

// class LessonsController extends Controller
// {

//     public function index(Request $request)
//     {
//         if ($request->has("material_id")) {
//             return Material::find($request->material_id)->lessons()->get();
//         }
//         return Controller::narrowDownFromConditions(
//             $request->all(),
//             "\App\Material::all",
//             "\App\Material::where"
//         );
//     }
// }
