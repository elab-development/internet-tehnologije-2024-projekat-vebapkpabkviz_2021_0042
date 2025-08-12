<?php

namespace App\Observers;

use App\Models\QuizEvent;
use Illuminate\Support\Facades\Cache;

class QuizEventObserver
{
    /**
     * Handle the QuizEvent "created" event.
     *
     * @param  \App\Models\QuizEvent  $quizEvent
     * @return void
     */
    public function created(QuizEvent $quizEvent)
    {
        Cache::forget('quiz_events');
    }

    /**
     * Handle the QuizEvent "updated" event.
     *
     * @param  \App\Models\QuizEvent  $quizEvent
     * @return void
     */
    public function updated(QuizEvent $quizEvent)
    {
        Cache::forget('quiz_events');
    }

    /**
     * Handle the QuizEvent "deleted" event.
     *
     * @param  \App\Models\QuizEvent  $quizEvent
     * @return void
     */
    public function deleted(QuizEvent $quizEvent)
    {
        Cache::forget('quiz_events');
    }

    /**
     * Handle the QuizEvent "restored" event.
     *
     * @param  \App\Models\QuizEvent  $quizEvent
     * @return void
     */
    public function restored(QuizEvent $quizEvent)
    {
        //
    }

    /**
     * Handle the QuizEvent "force deleted" event.
     *
     * @param  \App\Models\QuizEvent  $quizEvent
     * @return void
     */
    public function forceDeleted(QuizEvent $quizEvent)
    {
        //
    }
}
