<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Material;
use App\User;
use Illuminate\Http\Request;

class UploadController extends Controller
{

    public function store(Request $request)
    {
        $fileUsage = $request->file_usage;
        $fileName = $request->file("file")->getClientOriginalName();
        $folder = "public/";
        if ($fileUsage === "userProfileImage") {
            $userId = $request->user_id;
            $path = "user-profile-images/" . $userId;
            $folder .= $path;
            $user = User::find($userId);
            if ($user) {
                $user->update(["profile_image_path" => "storage/" . $path . "/" . $fileName]);
            }
        } else if ($fileUsage === "materialThumbnailImage") {
            $materialId = $request->material_id;
            $path = "material-thumbnail-images/" . $materialId;
            $folder .= $path;
            $material = Material::find($materialId);
            if ($material) {
                $material->update(["thumbnail_image_path" => "storage/" . path . "/" . $fileName]);
            }
        }
        $request->file("file")->storeAs($folder, $fileName);
    }
}
