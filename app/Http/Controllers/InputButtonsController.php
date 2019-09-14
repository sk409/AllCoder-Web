<?php

namespace App\Http\Controllers;

use App\InputButton;
use Illuminate\Http\Request;

class InputButtonsController extends Controller
{

    public function index(Request $request)
    {
        return Controller::narrowDownFromConditions(
            $request->all(),
            "\App\InputButton"
        );
    }

    public function store(Request $request)
    {
        $inputButton = InputButton::create($request->all());
        return $inputButton->id;
    }
}
