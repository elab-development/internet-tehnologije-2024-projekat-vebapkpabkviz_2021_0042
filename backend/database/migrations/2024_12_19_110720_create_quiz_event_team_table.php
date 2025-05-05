<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quiz_event_team', function (Blueprint $table) {
            $table->unsignedBigInteger('quiz_event_id');
            $table->unsignedBigInteger('team_id');
            $table->primary(['quiz_event_id', 'team_id']);
            $table->integer('score');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('quiz_event_team');
    }
};
