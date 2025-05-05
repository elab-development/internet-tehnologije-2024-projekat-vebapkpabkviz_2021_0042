<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuizEventResource;
use App\Models\QuizEvent;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuizEventController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $quizEvent = QuizEvent::all();

        if (!$quizEvent) {
            return response()->json(['message' => 'Quiz events not found'], 404);
        }

        return response()->json(['data' => QuizEventResource::collection($quizEvent)], 200);
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
            'start_date_time' => 'required|date_format:Y-m-d H:i:s',
            'user_id' => 'required|integer',
            'season_id' => 'required|integer'
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());
        }
        
        try {
            $quizEvent = new QuizEvent();
            $quizEvent->name = $request->name;
            $quizEvent->start_date_time = $request->start_date_time;
            $quizEvent->user_id = $request->user_id;
            $quizEvent->season_id = $request->season_id;
            $quizEvent->save();
        } 
         catch (QueryException $ex) {
            return response()->json(['message' => $ex->getMessage()], 500);
        }

        return response()->json(['data' => new QuizEventResource($quizEvent)], 201);

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\QuizEvent  $quizEvent
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $quizEvent = QuizEvent::find($id);
        
        if (!$quizEvent) {
            return response()->json(['message' => 'Quiz event not found'], 404);
        }

        return response()->json(['data' => new QuizEventResource($quizEvent)], 200);
    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\QuizEvent  $quizEvent
     * @return \Illuminate\Http\Response
     */
    public function edit(QuizEvent $quizEvent)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\QuizEvent  $quizEvent
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string',
            'start_date_time' => 'date_format:Y-m-d H:i:s',
            'user_id' => 'integer',
            'season_id' => 'integer'

        ]);

        if($validator->fails()){
            return response()->json($validator->errors());
        }

        $quizEvent = QuizEvent::find($id);

        if (!$quizEvent) {
            return response()->json(['message' => 'Quiz event not found'], 404);
        }

        try {
            $quizEvent->update($request->all());
        } 
        catch (QueryException $ex) {
            return response()->json(['message' => $ex->getMessage()], 500);
        }

        return response()->json(['data' => new QuizEventResource($quizEvent)], 200);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\QuizEvent  $quizEvent
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $quizEvent = QuizEvent::find($id);

        if (!$quizEvent) {
            return response()->json(['message' => 'Quiz event not found'], 404);
        }

        try {
            $quizEvent->delete();
        } 
        catch (QueryException $ex) {
            return response()->json(['message' => $ex->getMessage()], 500);
        }

        return response()->json(['message' => 'Quiz event deleted'], 204);
    }
}
