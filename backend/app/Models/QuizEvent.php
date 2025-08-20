<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'start_date_time',
        'user_id',
        'season_id'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function season(){
        return $this->belongsTo(Season::class);
    }

    public function teams(){
        return $this->belongsToMany(Team::class)->withPivot('score')->withTimestamps();
    }
}
