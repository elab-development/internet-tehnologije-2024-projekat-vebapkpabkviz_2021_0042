<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\QuizEvent;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            AdminSeeder::class,
            ModeratorSeeder::class,
            SeasonSeeder::class
        ]);

        $teams = Team::factory(5)->create();

        User::factory(10)->create();

        $quizEvents = QuizEvent::factory(15)->create();
        
        foreach ($quizEvents as $quizEvent) {
            foreach ($teams as $team) {
                $quizEvent->teams()->attach($team->id, [
                    'score' => rand(0,20),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
