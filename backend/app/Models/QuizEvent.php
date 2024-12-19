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
}
