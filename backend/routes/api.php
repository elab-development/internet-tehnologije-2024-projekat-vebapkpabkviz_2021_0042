<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\QuizEventController;
use App\Http\Controllers\QuizEventTeamController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TeamUserController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WebServiceController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::resource('/users', UserController::class)->only(['index', 'show']);

Route::resource('/teams', TeamController::class)->only(['index', 'show']);

Route::resource('/seasons', SeasonController::class)->only(['index', 'show']);

Route::resource('/quiz-events', QuizEventController::class)->only(['index', 'show']);

Route::get('/scores/seasons/{seasonId}', [QuizEventTeamController::class, 'scoresInASeason'])->name('scores.seasons.show');
Route::get('/scores/seasons/{seasonId}/teams/{teamId}', [QuizEventTeamController::class, 'scoresInASeasonByATeam'])->name('scores.seasons.teams.show');

Route::get('/export-ical/{season_id}', [ExportController::class, 'exportICalendar'])->name('export-ical');

Route::get('/search/users', [SearchController::class, 'searchUsers'])->name('search.users');
Route::get('/search/teams', [SearchController::class, 'searchTeams'])->name('search.teams');
Route::get('/search/quiz-events', [SearchController::class, 'searchQuizEvents'])->name('search.quiz-events');
Route::get('/search/seasons', [SearchController::class, 'searchSeasons'])->name('search.seasons');

Route::get('/random-question', [WebServiceController::class, 'randomQuestion'])->name('random-question');

Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/profile', function(Request $request) {
        return response()->json(['data' =>  new UserResource(auth()->user())]);
    });

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::resource('/users', UserController::class)->only(['store'])->middleware('checkRole:admin');
    Route::match(['put', 'patch'],'/users/{user}', [UserController::class, 'update'])->name('users.update')->middleware('checkRole:admin');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy')->middleware('checkRole:admin');

    Route::resource('/teams', TeamController::class)->only(['store'])->middleware('checkRole:admin');
    Route::match(['put', 'patch'],'/teams/{team}', [TeamController::class, 'update'])->middleware('checkRole:admin');
    Route::delete('/teams/{team}', [TeamController::class, 'destroy'])->name('teams.destroy')->middleware('checkRole:admin');

    Route::resource('/seasons', SeasonController::class)->only(['store'])->middleware('checkRole:admin,moderator');
    Route::match(['put', 'patch'],'/seasons/{season}', [SeasonController::class, 'update'])->middleware('checkRole:admin,moderator');
    Route::delete('/seasons/{season}', [SeasonController::class, 'destroy'])->middleware('checkRole:admin,moderator');

    Route::resource('/quiz-events', QuizEventController::class)->only(['store'])->middleware('checkRole:admin,moderator');
    Route::match(['put', 'patch'],'/quiz-events/{quizEvent}', [QuizEventController::class, 'update'])->name('quit-events.update')->middleware('checkRole:admin,moderator');
    Route::delete('/quiz-events/{quizEvent}', [QuizEventController::class, 'destroy'])->name('quit-events.destroy')->middleware('checkRole:admin,moderator');

    Route::post('/scores', [QuizEventTeamController::class, 'store'])->name('scores.store')->middleware('checkRole:admin')->middleware('checkRole:admin,moderator');
    Route::put('scores/teams/{teamId}/quiz-events/{quizEventId}', [QuizEventTeamController::class, 'update'])->middleware('checkRole:admin,moderator');

    Route::post('/register/teams', [TeamController::class, 'registerTeam'])->name('register.teams')->middleware('checkRole:contestant');
    Route::resource('/teams.users', TeamUserController::class)->only(['index']);
});