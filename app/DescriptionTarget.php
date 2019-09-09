<?php

namespace App;

use App\Description;
use Illuminate\Database\Eloquent\Model;

class DescriptionTarget extends Model
{

    protected $fillable = ["start_index", "end_index", "description_id"];

    public function description()
    {
        return $this->belongsTo(Description::class);
    }
}
