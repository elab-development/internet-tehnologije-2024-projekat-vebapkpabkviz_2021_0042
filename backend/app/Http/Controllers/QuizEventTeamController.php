<?php

namespace App\Http\Controllers;

use App\Models\QuizEvent;
use App\Models\Season;
use App\Models\Team;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
    
        $teamScoresForSeason = DB::table('teams')
            ->join('quiz_event_team', 'teams.id', '=', 'quiz_event_team.team_id')
            ->join('quiz_events', 'quiz_event_team.quiz_event_id', '=', 'quiz_events.id')
            ->where('quiz_events.season_id', $id)
            ->selectRaw('teams.name as team, sum(quiz_event_team.score) as total_score')
            ->groupBy('teams.id', 'teams.name')
            ->orderByDesc('total_score')
            ->get();
    
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
    
        $scores = DB::table('quiz_events')
            ->join('quiz_event_team', 'quiz_events.id', '=', 'quiz_event_team.quiz_event_id')
            ->where('quiz_event_team.team_id', $teamId)
            ->where('quiz_events.season_id', $seasonId)
            ->orderBy('quiz_events.start_date_time')
            ->select('quiz_events.id as quiz_event_id', 'quiz_events.name as quiz_event_name', 'quiz_events.start_date_time as quiz_event_start_date_time', 'quiz_event_team.score')
            ->get();
    
        return response()->json([
            'season_name' => $seasonName,
            'team_name' => $teamName,
            'scores' => $scores,
        ], 200);
    }

    public function store(Request $request){

        $validator = Validator::make($request->all(), [
            'team_id' => 'required',
            'quiz_event_id' => 'required',
            'score' => 'required|integer',
        ]);
        
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
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
            DB::beginTransaction();
        
            $quizEvent->teams()->attach($team, ['score' => $request->score]);
        
            DB::commit();
        } catch (QueryException $ex) {
            DB::rollback();
            return response()->json(['message' => $ex->getMessage()], 500);
        }
        
        return response()->json(['message' => 'Score record created successfully'], 201);

    }

    public function update(Request $request, $teamId, $quizEventId)
    {
        $validator = Validator::make($request->all(), [
            'score' => 'required|integer',
        ]);
        
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
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
            DB::beginTransaction();
        
            $quizEvent->teams()->updateExistingPivot($team, ['score' => $request->score]);
        
            DB::commit();
        } catch (QueryException $ex) {
            DB::rollback();
            return response()->json(['message' => $ex->getMessage()], 500);
        }
        
        return response()->json(['message' => 'Score record updated successfully'], 201);
    }
}
