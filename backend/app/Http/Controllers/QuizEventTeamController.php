<?php

namespace App\Http\Controllers;

use App\Models\QuizEvent;
use App\Models\Season;
use App\Models\Team;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuizEventTeamController extends Controller
{

    public function show($quizEventId, $teamId){
        $team = Team::find($teamId);
        if (!$team) {
            return response()->json(['error' => 'Team not found'], 404);
        }

        $quizEvent = QuizEvent::find($quizEventId);
        if (!$quizEvent) {
            return response()->json(['error' => 'Season not found'], 404);
        }

        $teamName = $team->name;
        $seasonName = $quizEvent->name;

        $score = $team->quizEvents()
            ->where('id', $quizEventId)
            ->withPivot('score')
            ->get();

        return response()->json([
            'quiz_event_name' => $seasonName,
            'team_name' => $teamName,
            'score' => $score,
        ], 200);
    }

    public function scoresInASeason($id){

        $season = Season::find($id);

        if (!$season) {
            return response()->json(['message' => 'Season not found'], 404);
        }

        $teamScoresForSeason = $season->quizEvents()
        ->with(['teams' => function ($query) {
            $query->withPivot('score');
        }])
        ->get()
        ->flatMap(function ($quizEvent) {
            return $quizEvent->teams;
        })
        ->groupBy('id')
        ->map(function ($team) {
            $totalScore = $team->sum('pivot.score');
            return [
                'team' => $team->first()->name,
                'total_score' => $totalScore,
            ];
        })
        ->sortByDesc('total_score');

        return response()->json(['season' => $season->name, 'data' => $teamScoresForSeason], 200);
    }

    public function scoresInASeasonByATeam($seasonId, $teamId){
        $team = Team::find($teamId);
        if (!$team) {
            return response()->json(['error' => 'Team not found'], 404);
        }

        $season = Season::find($seasonId);
        if (!$season) {
            return response()->json(['error' => 'Season not found'], 404);
        }

        $teamName = $team->name;
        $seasonName = $season->name;

        $scores = $team->quizEvents()
            ->where('season_id', $seasonId)
            ->withPivot('score')
            ->orderBy('start_date_time')
            ->get();

        $formattedScores = $scores->map(function ($quizEvent) {
            return [
                'quiz_event_id' => $quizEvent->id,
                'quiz_event_name' => $quizEvent->name,
                'quiz_event_start_date_time' => $quizEvent->start_date_time,
                'score' => $quizEvent->pivot->score,
            ];
        });

        return response()->json([
            'season_name' => $seasonName,
            'team_name' => $teamName,
            'scores' => $formattedScores,
        ], 200);
    }

    public function store(Request $request){

        $validator = Validator::make($request->all(), [
            'team_id' => 'required',
            'quiz_event_id' => 'required',
            'score' => 'required|integer',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());
        }

        $team = Team::find($request->team_id);
        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }
        

        $quizEvent = QuizEvent::find($request->quiz_event_id);
        if (!$quizEvent) {
            return response()->json(['message' => 'Quiz event not found'], 404);
        }

        try {
            $quizEvent->teams()->attach($team, ['score' => $request->score]);
        } 
         catch (QueryException $ex) {
            return response()->json(['message' => $ex->getMessage()], 500);
        }

        return response()->json(['message' => 'Score record created successfully'], 201);

    }

    public function update(Request $request, $teamId, $quizEventId)
    {
        $validator = Validator::make($request->all(), [
            'score' => 'required|integer',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());
        }

        $team = Team::find($teamId);
        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }
        

        $quizEvent = QuizEvent::find($quizEventId);
        if (!$quizEvent) {
            return response()->json(['message' => 'Quiz event not found'], 404);
        }

        try {
            $quizEvent->teams()->updateExistingPivot($team, ['score' => $request->score]);
        } 
         catch (QueryException $ex) {
            return response()->json(['message' => $ex->getMessage()], 500);
        }

        return response()->json(['message' => 'Score record updated successfully'], 201);
    }
}
