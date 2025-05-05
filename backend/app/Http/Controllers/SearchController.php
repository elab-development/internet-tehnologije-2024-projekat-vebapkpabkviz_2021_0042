<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuizEventResource;
use App\Http\Resources\SeasonResource;
use App\Http\Resources\TeamResource;
use App\Http\Resources\UserResource;
use App\Models\QuizEvent;
use App\Models\Season;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function searchSeasons(Request $request)
    {
        $query = Season::query();

        //Search by name
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        //Paginate
        $page = $request->input('page', 1);
        $perPage = 5;

        $seasons = $query->orderBy('name')->paginate($perPage, ['*'], 'page', $page);

        if($seasons->isEmpty()){
            return response()->json(['message' => 'Quiz events not found'], 404);
        }
        return response()->json(['current_page' => $seasons->currentPage(), 'last_page' => $seasons->lastPage(), 'seasons' => SeasonResource::collection($seasons)], 200);
    }

    public function searchQuizEvents(Request $request)
    {
        $query = QuizEvent::query();

        //Search by name
        if ($request->has('name')) {
            $query->where('quiz_events.name', 'like', '%' . $request->input('name') . '%');
        }

        //Filter by period
        if($request->has('start_date') && $request->has('end_date')){
            $query->whereBetween('start_date_time', [$request->input('start_date'), $request->input('end_date')]);
        }

        //Paginate
        $page = $request->input('page', 1);
        $perPage = 5;

        $quizEvents = $query->orderBy('start_date_time')->paginate($perPage, ['*'], 'page', $page);

        if($quizEvents->isEmpty()){
            return response()->json(['message' => 'Quiz events not found'], 404);
        }
        return response()->json(['current_page' => $quizEvents->currentPage(), 'last_page' => $quizEvents->lastPage(), 'quiz events' => QuizEventResource::collection($quizEvents)], 200);
    }

    public function searchTeams(Request $request)
    {
        $query = Team::query();

        //Search by name
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        //Paginate
        $page = $request->input('page', 1);
        $perPage = 5;

        $teams = $query->orderBy('name')->paginate($perPage, ['*'], 'page', $page);

        if($teams->isEmpty()){
            return response()->json(['message' => 'Quiz events not found'], 404);
        }
        return response()->json(['current_page' => $teams->currentPage(), 'last_page' => $teams->lastPage(), 'teams' => TeamResource::collection($teams)], 200);
    }

    public function searchUsers(Request $request)
    {
        $query = User::query();

        //Search by username, email, full_name
        if ($request->has('username')) {
            $query->where('username', 'like', '%' . $request->input('username') . '%');
        }
        if ($request->has('email')) {
            $query->where('email', 'like', '%' . $request->input('email') . '%');
        }
        if ($request->has('full_name')) {
            $query->where('full_name', 'like', '%' . $request->input('full_name') . '%');
        }

        //filter by role
        if ($request->has('role')) {
            $query->where('role', 'like', '%' . $request->input('role') . '%');
        }

        $page = $request->input('page', 1);
        $perPage = 5;

        $users = $query->orderBy('full_name')->paginate($perPage, ['*'], 'page', $page);

        if($users->isEmpty()){
            return response()->json(['message' => 'Users not found'], 404);
        }
        return response()->json(['current_page' => $users->currentPage(), 'last_page' => $users->lastPage(), 'quiz events' => UserResource::collection($users)], 200);
    }
}
