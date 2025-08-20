<?php

namespace App\Providers;

use App\Models\QuizEvent;
use App\Models\Season;
use App\Observers\QuizEventObserver;
use App\Observers\SeasonObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        QuizEvent::observe(QuizEventObserver::class);
        Season::observe(SeasonObserver::class);
    }
}
