<?php

namespace App;

use App\User;
use App\Material;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    
    protected $fillable = ["title", "description", "user_id"];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function materials()
    {
        return $this->belongsToMany(Material::class)->withPivot("index");
    }

}
