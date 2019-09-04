<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DescriptionTarget extends Model
{
    
    protected $fillable = ["start_index", "end_index", "description_id"];

}
