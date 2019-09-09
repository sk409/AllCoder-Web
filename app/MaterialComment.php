<?php

namespace App;

use App\Material;
use Illuminate\Database\Eloquent\Model;

class MaterialComment extends Model
{
    public function material()
    {
        return $this->belongsTo(Material::class);
    }
}
