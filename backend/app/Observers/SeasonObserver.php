<?php

namespace App\Observers;

use App\Models\Season;
use Illuminate\Support\Facades\Cache;

class SeasonObserver
{
    /**
     * Handle the Season "created" event.
     *
     * @param  \App\Models\Season  $season
     * @return void
     */
    public function created(Season $season)
    {
        Cache::forget('seasons');
    }

    /**
     * Handle the Season "updated" event.
     *
     * @param  \App\Models\Season  $season
     * @return void
     */
    public function updated(Season $season)
    {
        Cache::forget('seasons');
    }

    /**
     * Handle the Season "deleted" event.
     *
     * @param  \App\Models\Season  $season
     * @return void
     */
    public function deleted(Season $season)
    {
        Cache::forget('seasons');
    }

    /**
     * Handle the Season "restored" event.
     *
     * @param  \App\Models\Season  $season
     * @return void
     */
    public function restored(Season $season)
    {
        //
    }

    /**
     * Handle the Season "force deleted" event.
     *
     * @param  \App\Models\Season  $season
     * @return void
     */
    public function forceDeleted(Season $season)
    {
        //
    }
}
