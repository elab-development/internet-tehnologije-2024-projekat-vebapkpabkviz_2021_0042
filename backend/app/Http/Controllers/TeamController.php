<?php

namespace App\Http\Controllers;

use App\Http\Resources\TeamResource;
use App\Http\Resources\UserResource;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $teams = Team::all();

        if (!$teams) {
            return response()->json(['message' => 'Teams not found'], 404);
        }

        return response()->json(['data' => TeamResource::collection($teams)], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());
        }

        try {
            $team = Team::create($request->only('name'));
        } 
        catch (QueryException $ex) {
            return response()->json(['message' => $ex->getMessage()], 500);
        }

        return response()->json(['data' => new TeamResource($team)], 201);

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Team  $team
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $team = Team::find($id);
        
        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }

        return response()->json(['data' => new TeamResource($team)], 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Team  $team
     * @return \Illuminate\Http\Response
     */
    public function edit(Team $team)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Team  $team
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());
        }

        $team = Team::find($id);

        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }

        try {
            $team->update($request->only('name'));
        } 
        catch (QueryException $ex) {
            return response()->json(['message' => $ex->getMessage()], 500);
        }

        return response()->json(['data' => new TeamResource($team)], 200);
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Team  $team
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $team = Team::find($id);

        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }

        try {
            $team->delete();
        } 
        catch (QueryException $ex) {
            return response()->json(['message' => $ex->getMessage()], 500);
        }

        return response()->json(['message' => 'Team deleted'], 204);
    }

    public function registerTeam(Request $request) {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:teams',
        ]);
    
        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
    
        try {
            DB::beginTransaction();
    
            $team = Team::create($request->only('name'));
    
            $userId = auth('sanctum')->user()->id;
            $user = User::find($userId);
            $user->team_id = $team->id;
            $user->save();
    
            DB::commit();
        } 
        catch (QueryException $ex) {
            DB::rollback();
            return response()->json(['message' => $ex->getMessage()], 500);
        }
    
        return response()->json(['data' => new TeamResource($team)], 201);
    }

    public function joinTeam($id) {

        try {
            DB::beginTransaction();
    
            $userId = auth('sanctum')->user()->id;
            $user = User::find($userId);
            $user->team_id = $id;
            $user->save();
    
            DB::commit();
        } 
        catch (QueryException $ex) {
            DB::rollback();
            return response()->json(['message' => $ex->getMessage()], 500);
        }
    
        return response()->json(['data' => new UserResource($user)], 200);
    }
}
