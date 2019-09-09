<?php

namespace App;

use App\File;
use App\Description;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ["start_index", "end_index", "file_id"];

    public function file()
    {
        return $this->belongsTo(File::class);
    }

    public function description()
    {
        return $this->belongsTo(Description::class);
    }
}
