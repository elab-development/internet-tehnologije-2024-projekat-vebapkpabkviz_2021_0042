<?php

namespace Database\Seeders;

use App\Models\Season;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SeasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Season::create([
            'name'=>'2024/2025',
            'start_date'=>'2024-10-01',
            'end_date'=>'2025-07-01'
        ]);

        Season::create([
            'name'=>'2023/2024',
            'start_date'=>'2023-10-01',
            'end_date'=>'2024-07-01'
        ]);
    }
}
