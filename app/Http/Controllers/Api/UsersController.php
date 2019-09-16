<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\MaterialsController;
use stdClass;

class UsersController extends Controller
{

    public function index(Request $request)
    {
        $users = Controller::narrowDownFromConditions(
            $request->all(),
            "\App\User"
        );
        $stdUsers = [];
        foreach ($users as $user) {
            $stdUser = new stdClass();
            $stdUser->id = $user->id;
            $stdUser->name = $user->name;
            $stdUser->bio_text = $user->bio_text;
            $stdUser->email = $user->email;
            $stdUser->created_at = $user->created_at;
            $stdUser->updated_at = $user->updated_at;
            $stdUsers[] = $stdUser;
        }
        foreach ($users as $index => $user) {
            $stdUsers[$index]->purchased_materials = MaterialsController::convert($user->purchases);
            $stdUsers[$index]->created_materials = MaterialsController::convert($user->materials);
            $stdUsers[$index]->lessonCompletions = [];
            foreach ($user->completedLessons as $completedLesson) {
                $lessonCompletion = new stdClass();
                $lessonCompletion->material_id = $completedLesson->pivot->material_id;
                $lessonCompletion->lesson_id = $completedLesson->id;
                $stdUsers[$index]->lessonCompletions[] = $lessonCompletion;
            }
        }
        return $stdUsers;
    }
}
