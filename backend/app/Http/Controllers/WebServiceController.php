<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class WebServiceController extends Controller
{
    public function randomQuestion()
    {
        try {
            // retry: 3 pokušaja, backoff 500ms, timeout 8s
            $resp = Http::retry(3, 500)
                ->timeout(8)
                ->get('https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple');

            if (!$resp->ok()) {
                return $this->fallbackOrError();
            }

            $data = $resp->json();

            // OpenTDB uspeh => response_code === 0 i postoji results[0]
            if (($data['response_code'] ?? 1) !== 0 || empty($data['results'][0])) {
                return $this->fallbackOrError();
            }

            $item = $data['results'][0];

            $normalized = [
                'question'           => $item['question'],
                'correct_answer'     => $item['correct_answer'],
                'incorrect_answers'  => $item['incorrect_answers'],
            ];

            // zapamti poslednje validno pitanje kao fallback (npr. 10 min)
            Cache::put('last_ok_question', $normalized, 600);

            return response()->json($normalized, 200);

        } catch (\Throwable $e) {
            // mrežni/SSL/JSON exception -> fallback
            return $this->fallbackOrError();
        }
    }

    private function fallbackOrError()
    {
        if (Cache::has('last_ok_question')) {
            // vrati poslednje dobro pitanje umesto 502
            return response()->json(Cache::get('last_ok_question'), 200);
        }

        // kao poslednja linija odbrane – lokalni “backup”
        $backup = [
            'question' => 'Which country does Austria not border?',
            'correct_answer' => 'Netherlands',
            'incorrect_answers' => ['Germany', 'Italy', 'Switzerland'],
        ];
        return response()->json($backup, 200);

        // Ako želiš ipak grešku:
        // return response()->json(['message' => 'Upstream error'], 502);
    }
}