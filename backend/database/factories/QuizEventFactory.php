<?php

namespace Database\Factories;

use App\Models\Season;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuizEvent>
 */
class QuizEventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $seasonId = fake()->numberBetween(1, 2);
        $season = Season::find($seasonId);
        return [
            'name' => fake()->sentence(3),
            'start_date_time' => fake()->dateTimeBetween($season->start_date, $season->end_date)
            ->setTime($this->faker->numberBetween(19, 22), $this->faker->randomElement([0, 15, 30, 45]), 0),
            'user_id' => fake()->numberBetween(2,3),
            'season_id' => $seasonId
        ];
    }
}
