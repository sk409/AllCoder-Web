<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\LessonsController;
use App\Material;
use App\Path;
use App\User;
use Illuminate\Http\Request;
use stdClass;

class MaterialsController extends Controller
{

    public static function convert($materials)
    {
        $result = [];
        foreach ($materials as $material) {
            $stdMaterial = new stdClass();
            $stdMaterial->id = $material->id;
            $stdMaterial->title = $material->title;
            $stdMaterial->description = $material->description;
            $stdMaterial->thumbnail_image_path = $material->thumbnail_image_path;
            $stdMaterial->price = $material->price;
            $stdMaterial->created_at = $material->created_at;
            $stdMaterial->updated_at = $material->updated_at;
            $stdMaterial->lessons = [];
            foreach ($material->lessons as $lesson) {
                $stdMaterial->lessons[] = LessonsController::convert(
                    $material->id,
                    $lesson->id
                );
            }
            usort($stdMaterial->lessons, function ($a, $b) {
                return $a->index - $b->index;
            });
            $stdMaterial->comments = [];
            foreach ($material->comments()->where("parent_comment_id", null)->limit(5)->get() as $comment) {
                $stdComment = new stdClass();
                $stdComment->id = $comment->id;
                $stdComment->content = $comment->content;
                $stdComment->user_id = $comment->user_id;
                $stdComment->created_at = $comment->created_at;
                $stdComment->updated_at = $comment->updated_at;
                $stdMaterial->comments[] = $stdComment;
            }
            $result[] = $stdMaterial;
        }
        return $result;
    }

    public function index(Request $request)
    {

        if ($request->has("user_id") && $request->has("purchased")) {
            $materials = User::find($request->user_id)->purchases;
            if ($materials->count() == 0) {
                return [];
            }
            return MaterialsController::convert($materials);
        }

        $conditions = [];
        $columns = ["id", "title", "description", "price", "user_id", "created_at", "updated_at"];
        foreach ($columns as $column) {
            if (!$request->has($column)) {
                continue;
            }
            $conditions[$column] = $request[$column];
        }
        $materials = Controller::narrowDownFromConditions(
            $conditions,
            "\App\Material"
        );
        return MaterialsController::convert($materials);
    }

    public function purchase(Request $request)
    {
        $request->validate([
            "material_id" => "required",
            "user_id" => "required",
        ]);
        $material = Material::find($request->material_id);
        $material->purchase($request->user_id);
    }
}
