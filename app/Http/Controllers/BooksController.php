<?php

namespace App\Http\Controllers;

use App\Book;
use Illuminate\Http\Request;

class BooksController extends Controller
{

    public function index(Request $request)
    {
        return Controller::narrowDownFromConditions(
            $request->all(),
            "\App\Book"
        );
    }

    public function store(Request $request)
    {
        // $request->validate([
        //     "text" => "required",
        //     "lesson_id" => "required",
        // ]);
        $parameters = $request->all();
        if (is_null($parameters["text"])) {
            $parameters["text"] = "";
        }
        Book::create($parameters);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            "text" => "required",
            "lesson_id" => "required"
        ]);
        $parameters = $request->all();
        if (is_null($parameters["text"])) {
            $parameters["text"] = "";
        }
        Book::find($id)->fill($parameters)->save();
    }
}
