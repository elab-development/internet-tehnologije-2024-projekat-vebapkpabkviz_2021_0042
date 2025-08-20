<?php

namespace App\Http\Controllers;

use App\Http\Resources\TeamResource;
use App\Http\Resources\UserResource;
use App\Models\Team;
use Illuminate\Http\Request;

class TeamUserController extends Controller
{
    public function index($id){
        $team = Team::find($id);

        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }
        $users = $team->users;

        return response()->json(['team' => new TeamResource($team), 'data' => UserResource::collection($users)], 200);
    }
}
