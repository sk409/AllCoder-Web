<?php

namespace App;

// use App\Lesson;
// use App\File;
// use Illuminate\Database\Eloquent\Model;

class Folder /*extends Model*/
{

    public $path = "";
    public $name = "";
    public $childFiles = [];
    public $childFolders = [];

    public function __construct(string $path)
    {
        $this->path = $path;
        $this->name = basename($path);
    }

    public function appenChildFile($childFile)
    {
        $this->childFiles[] = $childFile;
    }

    public function appendChildFolder($childFolder)
    {
        $this->childFolders[] = $childFolder;
    }

    // protected $fillable = ["name", "parent_folder_id", "lesson_id"];

    // public function lesson()
    // {
    //     return $this->belongsTo(Lesson::class);
    // }

    // public function files()
    // {
    //     return $this->hasMany(File::class, "parent_folder_id");
    // }
}
