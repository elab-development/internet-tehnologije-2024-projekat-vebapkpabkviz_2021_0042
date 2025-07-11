<?php

namespace App\Http\Controllers;

use App\Http\Resources\SeasonResource;
use App\Models\Season;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Validator;

class SeasonController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $seasons = Season::all();

        if (!$seasons) {
            return response()->json(['message' => 'Seasons not found'], 404);
        }

        return response()->json(['data' => SeasonResource::collection($seasons)], 200);

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
            'name' => 'required|string|unique:seasons',
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());
        }

        $dateS = Date::createFromFormat('Y-m-d', $request->start_date);
        $dateE = Date::createFromFormat('Y-m-d', $request->end_date);

        if ($dateS > $dateE) {
            return response()->json(['message'=>'start_date must be before end_date']);
        }
        
        try {
            $season = new Season();
            $season->name = $request->name;
            $season->start_date = $request->start_date;
            $season->end_date = $request->end_date;
            $season->save();
        } 
         catch (QueryException $ex) {
            return response()->json(['message' => $ex->getMessage()], 500);
        }

        return response()->json(['data' => new SeasonResource($season)], 201);

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Season  $season
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $season = Season::find($id);
        
        if (!$season) {
            return response()->json(['message' => 'Season not found'], 404);
        }

        return response()->json(['data' => new SeasonResource($season)], 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Season  $season
     * @return \Illuminate\Http\Response
     */
    public function edit(Season $season)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Season  $season
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|unique:seasons',
            'start_date' => 'date_format:Y-m-d',
            'end_date' => 'date_format:Y-m-d',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());
        }

        $season = Season::find($id);

        if (!$season) {
            return response()->json(['message' => 'Season not found'], 404);
        }

        try {
            $season->update($request->all());
        } 
        catch (QueryException $ex) {
            return response()->json(['message' => $ex->getMessage()], 500);
        }

        return response()->json(['data' => new SeasonResource($season)], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Season  $season
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $season = Season::find($id);

        if (!$season) {
            return response()->json(['message' => 'Season not found'], 404);
        }

        try {
            $season->delete();
        } 
        catch (QueryException $ex) {
            return response()->json(['message' => $ex->getMessage()], 500);
        }

        return response()->json(['message' => 'Season deleted'], 204);
    }
}
