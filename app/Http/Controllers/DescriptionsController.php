<?php

namespace App\Http\Controllers;

use App\Description;
use Illuminate\Http\Request;

class DescriptionsController extends Controller
{

    public function index(Request $request)
    {
        return Controller::narrowDownFromConditions(
            $request->all(),
            "\App\Description"
        );
    }

    public function store(Request $request)
    {
        $parameters = $request->all();
        if ($request->has("text") && is_null($request->text)) {
            $parameters["text"] = "";
        }
        $description = Description::create($parameters);
        return $description->id;
    }

    public function update(Request $request, int $id)
    {
        $parameters = $request->all();
        if ($request->has("text") && is_null($request->text)) {
            $parameters["text"] = "";
        }
        Description::find($id)->fill($parameters)->save();
    }
}
