<?php

namespace App\Http\Controllers\Api;

use App\Folder;
use App\Http\Controllers\Controller;
use App\Material;
use App\Path;
use App\Utils\FileTreeBuilder;
use Illuminate\Http\Request;
use stdClass;

class LessonsController extends Controller
{

    public static function convert(
        $materialId,
        $lessonId,
        $userId = null
    ) {
        $material = Material::find($materialId);
        $lesson = null;
        foreach ($material->lessons as $l) {
            if ($l->id == $lessonId) {
                $lesson = $l;
                break;
            }
        }
        if (is_null($lesson)) {
            return null;
        }
        $stdLesson = new stdClass();
        $stdLesson->id = $lesson->id;
        $stdLesson->index = $lesson->pivot->index;
        $stdLesson->title = $lesson->title;
        $stdLesson->description = $lesson->description;
        $stdLesson->book = $lesson->book;
        $stdLesson->created_at = $lesson->created_at;
        $stdLesson->updated_at = $lesson->updated_at;
        $stdLesson->evaluations = [];
        foreach ($lesson->evaluations as $evaluatsion) {
            $stdLesson->evaluations[] = $evaluatsion->value;
        }
        $stdLesson->evaluations = array_filter($stdLesson->evaluations); //なぜ?
        if (!is_null($lessonId)) {
            $stdLesson->root_folder = new Folder("");
            $options = [];
            foreach (glob($lesson->host_options_directory_path . "/*.json") as $fileName) {
                $option = json_decode(file_get_contents($fileName));
                $option->path = Path::purchasedLessonOriginal(
                    $userId,
                    $materialId,
                    $lessonId,
                    ltrim(substr($option->path, strlen($lesson->host_app_directory_path)), "/")
                );
                $options[] = $option;
            }
            FileTreeBuilder::build(
                Path::purchasedLessonOriginal($userId, $materialId, $lesson->id, ""),
                $stdLesson->root_folder,
                true,
                $options
            );
        }
        $stdLesson->comments = [];
        foreach ($lesson->comments()->where("parent_comment_id", null)->limit(5)->get() as $comment) {
            $stdComment = new stdClass();
            $stdComment->id = $comment->id;
            $stdComment->content = $comment->content;
            $stdComment->user_id = $comment->user_id;
            $stdComment->created_at = $comment->created_at;
            $stdComment->updated_at = $comment->updated_at;
            $stdLesson->comments[] = $stdComment;
        }
        return $stdLesson;
    }

    public function index(Request $request)
    {
        if ($request->has("user_id") && $request->has("material_id") && $request->has("lesson_id")) {
            $stdLesson = LessonsController::convert(
                $request->material_id,
                $request->lesson_id,
                $request->user_id
            );
            return json_encode([$stdLesson]);
        } else {
            return Controller::narrowDownFromConditions($request->all(), "App\Lesson");
        }
    }
}
