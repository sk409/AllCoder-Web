<?php

namespace App;

// use App\Description;
// use App\Folder;
// use Illuminate\Database\Eloquent\Model;

class File /*extends Model*/
{

    // protected $fillable = ["name", "text", "index", "parent_folder_id", "lesson_id"];

    // public function parentFolder()
    // {
    //     return $this->belongsTo(Folder::class, "parent_folder_id");
    // }

    // public function descriptions()
    // {
    //     return $this->hasMany(Description::class);
    // }

    public $path = "";
    public $text = "";
    public $option = null;

    public function __construct(string $path, string $text = "", $option = null)
    {
        $this->path = $path;
        $this->text = $text;
        $this->option = $option;
    }
}
