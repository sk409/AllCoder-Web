<?php

namespace App\Http\Controllers;

use App\Description;
use Illuminate\Http\Request;

class DescriptionsController extends Controller
{
    
    public function store(Request $request) {
        $parameters = $request->all();
        if ($request->has("text") && is_null($request->text)) {
            $parameters["text"] = "";
        }
        $description = Description::create($parameters);
        return $description->id;
    }

    public function update(Request $request, int $id) {
        $parameters = $request->all();
        if ($request->has("text") && is_null($request->text)) {
            $parameters["text"] = "";
        }
        Description::find($id)->fill($parameters)->save();
    }

    public function fetch(Request $request) {
        return Controller::narrowDownFromConditions(
            $request,
            "\App\Description::all",
            "\App\Description::where"
        );
    }

}
