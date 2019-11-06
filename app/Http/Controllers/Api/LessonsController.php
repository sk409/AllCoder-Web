<?php

namespace App\Http\Controllers\Api;

use App\File;
use App\Folder;
use App\Http\Controllers\Controller;
use App\Material;
use App\Path;
use App\Utils\FileTreeBuilder;
use App\Utils\FileTreeIterator;
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
        $stdLesson->ratings = [];
        foreach ($lesson->ratings as $rating) {
            $stdLesson->ratings[] = $rating->value;
        }
        $stdLesson->ratings = array_filter($stdLesson->ratings); //なぜ?
        if (!is_null($lessonId)) {
            $stdLesson->root_folder = new Folder("");
            $options = [];
            $optionFileNames = glob(
                Path::purchasedLessonOptions($userId, $materialId, $lesson->id, "*.json")
            );
            foreach ($optionFileNames as $optionFileName) {
                $option = json_decode(file_get_contents($optionFileName));
                $options[] = $option;
            }
            FileTreeBuilder::build(
                Path::purchasedLessonOriginal($userId, $materialId, $lesson->id, ""),
                $stdLesson->root_folder,
                true,
                $options
            );
            $fileHandler = function (File $file) use ($userId, $materialId, $lesson) {
                $originalPath = Path::purchasedLessonOriginal($userId, $materialId, $lesson->id, "");
                $workPath = Path::purchasedLessonWork($userId, $materialId, $lesson->id, "");
                $file->path = $workPath . substr($file->path, strlen($originalPath));
            };
            FileTreeIterator::iterateFileTreeItem(
                $stdLesson->root_folder,
                $fileHandler
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
