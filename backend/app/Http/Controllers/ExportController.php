<?php

namespace App\Http\Controllers;

use App\Models\QuizEvent;
use App\Models\User;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Spatie\IcalendarGenerator\Components\Calendar;
use Spatie\IcalendarGenerator\Components\Event;

class ExportController extends Controller
{
    public function exportICalendar(Request $request)
    {
        $seasonId = $request->season_id;

        // Fetch quiz events based on season_id
        $quizEvents = QuizEvent::whereHas('season', function ($query) use ($seasonId) {
            $query->where('id', $seasonId);
        })->orderBy('start_date_time')->get();

        if ($quizEvents->isEmpty()) {
            return response()->json(['message' => 'No quiz events found for the specified season.']);
        }

        
        $calendar = Calendar::create('Quiz Events');

        foreach ($quizEvents as $event) {

            $organizer = User::select('email', 'full_name')->where('id', $event->user_id)->first();

            $startsAtString = $event->start_date_time;

            $startsAt = new DateTime($startsAtString);
            $endsAt = clone $startsAt;
            
            $endsAt->modify('+3 hours');

            $icalEvent = Event::create($event->name)->startsAt($startsAt)->endsAt($endsAt)->organizer($organizer->email, $organizer->full_name);
            $calendar->event($icalEvent);
        }
    
        $calendarContent = $calendar->get();

        $fileName = 'quiz_events.ics';

        return Response::make($calendarContent)
            ->header('Content-Type', 'text/calendar')
            ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"');
    }

}
