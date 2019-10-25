<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Material;
use App\User;
use App\Utils\FileTreeBuilder;
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
                $stdLesson->root_folder = null;
                // $stdLesson->root_folder = null;
                // $folders = [];
                // foreach ($lesson->folders as $folder) {
                //     $stdFolder = new stdClass();
                //     $stdFolder->id = $folder->id;
                //     $stdFolder->name = $folder->name;
                //     $stdFolder->parent_folder_id = $folder->parent_folder_id;
                //     $stdFolder->created_at = $folder->created_at;
                //     $stdFolder->updated_at = $folder->updated_at;
                //     $stdFolder->child_folders = [];
                //     $stdFolder->child_files = [];
                //     foreach ($folder->files as $file) {
                //         $stdFile = new stdClass();
                //         $stdFile->id = $file->id;
                //         $stdFile->name = $file->name;
                //         $stdFile->text = $file->text;
                //         $stdFile->index = $file->index;
                //         $stdFile->created_at = $file->created_at;
                //         $stdFile->updated_at = $file->updated_at;
                //         $stdFile->descriptions = [];
                //         foreach ($file->descriptions as $description) {
                //             $stdDescription = new stdClass();
                //             $stdDescription->id = $description->id;
                //             $stdDescription->index = $description->index;
                //             $stdDescription->text = $description->text;
                //             $stdDescription->file_id = $description->file_id;
                //             $stdDescription->created_at = $description->created_at;
                //             $stdDescription->updated_at = $description->updated_at;
                //             $stdDescription->targets = [];
                //             foreach ($description->targets as $target) {
                //                 $stdTarget = new stdClass();
                //                 $stdTarget->id = $target->id;
                //                 $stdTarget->start_index = $target->start_index;
                //                 $stdTarget->end_index = $target->end_index;
                //                 $stdTarget->created_at = $target->created_at;
                //                 $stdTarget->updated_at = $target->updated_at;
                //                 $stdDescription->targets[] = $stdTarget;
                //             }
                //             usort($stdDescription->targets, function ($a, $b) {
                //                 return $a->start_index - $b->start_index;
                //             });
                //             $stdDescription->questions = [];
                //             foreach ($description->questions as $question) {
                //                 $stdQuestion = new stdClass();
                //                 $stdQuestion->id = $question->id;
                //                 $stdQuestion->index = $question->index;
                //                 $stdQuestion->created_at = $question->created_at;
                //                 $stdQuestion->updated_at = $question->updated_at;
                //                 $stdQuestion->input_buttons = [];
                //                 foreach ($question->inputButtons as $inputButton) {
                //                     $stdInputButton = new stdClass();
                //                     $stdInputButton->id = $inputButton->id;
                //                     $stdInputButton->index = $inputButton->index;
                //                     $stdInputButton->start_index = $inputButton->start_index;
                //                     $stdInputButton->end_index = $inputButton->end_index;
                //                     $stdInputButton->line_number = $inputButton->line_number;
                //                     $stdInputButton->created_at = $inputButton->created_at;
                //                     $stdInputButton->updated_at = $inputButton->updated_at;
                //                     $stdQuestion->input_buttons[] = $stdInputButton;
                //                 }
                //                 usort($stdQuestion->input_buttons, function ($a, $b) {
                //                     return $a->index - $b->index;
                //                 });
                //                 $stdDescription->questions[] = $stdQuestion;
                //             }
                //             usort($stdDescription->questions, function ($a, $b) {
                //                 return $a->index - $b->index;
                //             });
                //             $stdFile->descriptions[] = $stdDescription;
                //         }
                //         usort($stdFile->descriptions, function ($a, $b) {
                //             return $a->index - $b->index;
                //         });
                //         $stdFolder->child_files[] = $stdFile;
                //     }
                //     if ($stdFolder->parent_folder_id === null) {
                //         unset($stdFolder->parent_folder_id);
                //         $stdLesson->root_folder = $stdFolder;
                //     }
                //     $folders[] = $stdFolder;
                // }
                // $fileTreeBuilder = function ($current, $folders) use (&$fileTreeBuilder) {
                //     foreach ($folders as $folder) {
                //         if (!property_exists($folder, "parent_folder_id")) {
                //             continue;
                //         }
                //         if ($current->id !== $folder->parent_folder_id) {
                //             continue;
                //         }
                //         $fileTreeBuilder($folder, $folders);
                //         unset($folder->parent_folder_id);
                //         $current->child_folders[] = $folder;
                //     }
                // };
                // $fileTreeBuilder($stdLesson->root_folder, $folders);
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
                $stdMaterial->lessons[] = $stdLesson;
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
        Material::find($request->material_id)->purchases()->attach($request->user_id);
    }
}
