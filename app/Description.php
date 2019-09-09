<?php

namespace App;

use App\Question;
use App\DescriptionTarget;
use Illuminate\Database\Eloquent\Model;

class Description extends Model
{
    protected $fillable = ["index", "text", "file_id"];

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function targets()
    {
        return $this->hasMany(DescriptionTarget::class);
    }
}
