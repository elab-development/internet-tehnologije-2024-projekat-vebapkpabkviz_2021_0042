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
        Schema::table('quiz_event_team', function (Blueprint $table) {
            $table->foreign('quiz_event_id')->references('id')->on('quiz_events')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('quiz_event_team', function (Blueprint $table) {
            $table->dropForeign('quiz_event_id');
        });
    }
};
