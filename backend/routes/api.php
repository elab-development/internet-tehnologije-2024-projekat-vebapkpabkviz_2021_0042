<?php

use App\Http\Controllers\QuizEventController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::resource('/users', UserController::class)->only(['index', 'show']);
Route::resource('/users', UserController::class)->only(['store']);
Route::match(['put', 'patch'],'/users/{user}', [UserController::class, 'update'])->name('users.update');
Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

Route::resource('/seasons', SeasonController::class)->only(['index', 'show']);
Route::resource('/seasons', SeasonController::class)->only(['store']);
Route::match(['put', 'patch'],'/seasons/{season}', [SeasonController::class, 'update']);
Route::delete('/seasons/{season}', [SeasonController::class, 'destroy']);

Route::resource('/quiz-events', QuizEventController::class)->only(['index', 'show']);
Route::resource('/quiz-events', QuizEventController::class)->only(['store']);
Route::match(['put', 'patch'],'/quiz-events/{quizEvent}', [QuizEventController::class, 'update'])->name('quit-events.update');
Route::delete('/quiz-events/{quizEvent}', [QuizEventController::class, 'destroy'])->name('quit-events.destroy');

Route::resource('/teams', TeamController::class)->only(['index', 'show']);
Route::resource('/teams', TeamController::class)->only(['store']);
Route::match(['put', 'patch'],'/teams/{team}', [TeamController::class, 'update']);
Route::delete('/teams/{team}', [TeamController::class, 'destroy'])->name('teams.destroy');