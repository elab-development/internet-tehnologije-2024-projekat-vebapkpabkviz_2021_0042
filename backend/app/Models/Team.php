<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    public function users(){
        return $this->hasMany(User::class);
    }

    public function quizEvents(){
        return $this->belongsToMany(QuizEvent::class)->withPivot('score')->withTimestamps();
    }
}
