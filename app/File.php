<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{

    protected $fillable = ["name", "text", "parent_folder_id", "lesson_id"];

}
