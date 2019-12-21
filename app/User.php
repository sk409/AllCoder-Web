<?php

namespace App;

use App\ChatRoom;
use App\Lesson;
use App\Material;
use App\MaterialComment;
use App\LessonComment;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'password', "bio_text", "profile_image_path", 'email',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    public function materials()
    {
        return $this->hasMany(Material::class);
    }

    public function lessonRatings()
    {
        return $this->belongsToMany(Lesson::class, "lesson_ratings")->withPivot("value")->withTimestamps();
    }

    public function lessonComments()
    {
        return $this->hasMany(LessonComment::class);
    }

    public function materialComments()
    {
        return $this->hasMany(MaterialComment::class);
    }

    public function purchases()
    {
        return $this->belongsToMany(Material::class, "purchases");
    }

    public function completedLessons()
    {
        return $this->belongsToMany(Lesson::class, "completions")->withPivot(["material_id"]);
    }

    public function chatRooms()
    {
        return $this->belongsToMany(ChatRoom::class);
    }
}
