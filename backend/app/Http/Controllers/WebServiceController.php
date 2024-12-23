<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WebServiceController extends Controller
{
    public function randomQuestion(){
        $response = Http::get('https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple');
        $data = $response->json();
        $question = $data['results'][0]['question'];
        $correctAnwer = $data['results'][0]['correct_answer'];
        $incorrectAnswers = $data['results'][0]['incorrect_answers'];
        return response()->json(['Question' => $question, 'correct_answer' => $correctAnwer, 'incorrect_answer' => $incorrectAnswers]);
    }
}
