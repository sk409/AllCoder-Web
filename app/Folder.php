<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    
    protected $fillable = ["name", "parent_folder_id", "lesson_id"];

}
