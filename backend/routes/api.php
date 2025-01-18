<?php

use App\Http\Controllers\QuizEventController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\QuizEventTeamController;
use App\Http\Controllers\TeamUserController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\WebServiceController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::resource('/users', UserController::class)->only(['index', 'show']);
Route::resource('/teams', TeamController::class)->only(['index', 'show']);
Route::resource('/seasons', SeasonController::class)->only(['index', 'show']);
Route::resource('/quiz-events', QuizEventController::class)->only(['index', 'show']);

Route::get('/search/users', [SearchController::class, 'searchUsers'])->name('search.users');
Route::get('/search/teams', [SearchController::class, 'searchTeams'])->name('search.teams');
Route::get('/search/quiz-events', [SearchController::class, 'searchQuizEvents'])->name('search.quiz-events');
Route::get('/search/seasons', [SearchController::class, 'searchSeasons'])->name('search.seasons');

Route::get('/export-ical/{seasonId}',[ExportController::class, 'exportICalendar'])->name('export-ical');

Route::get('/scores/seasons/{seasonId}', [QuizEventTeamController::class, 'scoresInASeason'])->name('scores.seasons.show');
Route::get('/scores/seasons/{seasonId}/teams/{teamId}', [QuizEventTeamController::class, 'scoresInASeasonByATeam'])->name('scores.seasons.teams.show');

Route::get('/random-question', [WebServiceController::class, 'randomQuestion'])->name('random-question');

Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/profile', function(Request $request) {
        return auth()->user();
    })->middleware('checkRole:admin,moderator');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/register/teams', [TeamController::class, 'registerTeam'])->name('register.teams');
    Route::resource('/teams.users', TeamUserController::class)->only(['index']);

    Route::resource('/users', UserController::class)->only(['store']);
    Route::match(['put', 'patch'],'/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');


    Route::resource('/seasons', SeasonController::class)->only(['store']);
    Route::match(['put', 'patch'],'/seasons/{season}', [SeasonController::class, 'update']);
    Route::delete('/seasons/{season}', [SeasonController::class, 'destroy']);


    Route::resource('/quiz-events', QuizEventController::class)->only(['store']);
    Route::match(['put', 'patch'],'/quiz-events/{quizEvent}', [QuizEventController::class, 'update'])->name('quit-events.update');
    Route::delete('/quiz-events/{quizEvent}', [QuizEventController::class, 'destroy'])->name('quit-events.destroy');


    Route::resource('/teams', TeamController::class)->only(['store']);
    Route::match(['put', 'patch'],'/teams/{team}', [TeamController::class, 'update']);
    Route::delete('/teams/{team}', [TeamController::class, 'destroy'])->name('teams.destroy');

    Route::post('/scores', [QuizEventTeamController::class, 'store'])->name('scores.store');
    Route::put('scores/teams/{teamId}/quiz-events/{quizEventId}', [QuizEventTeamController::class, 'update']);
});