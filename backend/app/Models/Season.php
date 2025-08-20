<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Season extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'start_date',
        'end_date'
    ];

    public function quizEvents(){
        return $this->hasMany(QuizEvent::class);
    }
}
