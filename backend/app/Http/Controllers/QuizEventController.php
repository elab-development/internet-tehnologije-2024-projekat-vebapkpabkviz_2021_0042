<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuizEventResource;
use App\Models\QuizEvent;
use App\Models\Season;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class QuizEventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cacheKey = 'quiz_events';

        $quizEvents = Cache::remember($cacheKey, 60 * 60 * 24, function () {
            return QuizEvent::all();
        });

        if (!$quizEvents) {
            return response()->json(['message' => 'Quiz events not found'], 404);
        }

        return response()->json(['data' => QuizEventResource::collection($quizEvents)], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'            => 'required|string',
            'start_date_time' => 'required|date_format:Y-m-d H:i:s',
            'user_id'         => 'required|integer',
            'season_id'       => 'required|integer|exists:seasons,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // ✅ Provera datuma u okviru sezone
        $season = Season::find($request->season_id);
        $eventDate = Carbon::createFromFormat('Y-m-d H:i:s', $request->start_date_time);

        if ($eventDate->lt(Carbon::parse($season->start_date)->startOfDay()) ||
            $eventDate->gt(Carbon::parse($season->end_date)->endOfDay())) {
            return response()->json([
                'start_date_time' => ["The event date must be within the season dates ({$season->start_date} - {$season->end_date})."]
            ], 400);
        }

        try {
            DB::beginTransaction();

            $quizEvent = new QuizEvent();
            $quizEvent->name            = $request->name;
            $quizEvent->start_date_time = $request->start_date_time;
            $quizEvent->user_id         = $request->user_id;
            $quizEvent->season_id       = $request->season_id;
            $quizEvent->save();

            DB::commit();
            Cache::forget('quiz_events');
        } catch (QueryException $ex) {
            DB::rollback();
            return response()->json(['message' => $ex->getMessage()], 500);
        }

        return response()->json(['data' => new QuizEventResource($quizEvent)], 201);
    }

    /**
     * Display the specified resource.
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name'            => 'string',
            'start_date_time' => 'date_format:Y-m-d H:i:s',
            'user_id'         => 'integer',
            'season_id'       => 'integer|exists:seasons,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $quizEvent = QuizEvent::find($id);
        if (!$quizEvent) {
            return response()->json(['message' => 'Quiz event not found'], 404);
        }

        // ✅ Provera datuma u okviru sezone ako je prosleđen novi datum
        $seasonId = $request->season_id ?? $quizEvent->season_id;
        $season = Season::find($seasonId);

        if ($request->filled('start_date_time')) {
            $eventDate = Carbon::createFromFormat('Y-m-d H:i:s', $request->start_date_time);
            if ($eventDate->lt(Carbon::parse($season->start_date)->startOfDay()) ||
                $eventDate->gt(Carbon::parse($season->end_date)->endOfDay())) {
                return response()->json([
                    'start_date_time' => ["The event date must be within the season dates ({$season->start_date} - {$season->end_date})."]
                ], 400);
            }
        }

        try {
            $quizEvent->update($request->all());
            Cache::forget('quiz_events');
        } catch (QueryException $ex) {
            return response()->json(['message' => $ex->getMessage()], 500);
        }

        return response()->json(['data' => new QuizEventResource($quizEvent)], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $quizEvent = QuizEvent::find($id);

        if (!$quizEvent) {
            return response()->json(['message' => 'Quiz event not found'], 404);
        }

        try {
            DB::beginTransaction();
            $quizEvent->delete();
            DB::commit();
            Cache::forget('quiz_events');
        } catch (QueryException $ex) {
            DB::rollback();
            return response()->json(['message' => $ex->getMessage()], 500);
        }

        return response()->json(['message' => 'Quiz event deleted'], 204);
    }
}
