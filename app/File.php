<?php

namespace App;

use App\Folder;
use App\Question;
use App\Description;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{

    protected $fillable = ["name", "text", "index", "parent_folder_id", "lesson_id"];

    public function parentFolder()
    {
        return $this->belongsTo(Folder::class, "parent_folder_id");
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function descriptions()
    {
        return $this->hasMany(Description::class);
    }
}
