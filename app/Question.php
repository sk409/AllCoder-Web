<?php

namespace App;

use App\Description;
use App\InputButton;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ["index", "description_id"];

    public function description()
    {
        return $this->belongsTo(Description::class);
    }

    public function inputButtons()
    {
        return $this->hasMany(InputButton::class);
    }
}
