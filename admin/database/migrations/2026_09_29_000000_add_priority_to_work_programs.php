<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('workPrograms', function (Blueprint $table): void {
            $table->unsignedInteger('priority')->nullable();
        });

        // Preserve the order of the six programs previously featured on the home page.
        foreach (['M Care', 'MISSION 2.0', 'Mignight', 'SPECTRA', 'Pojok Seni', 'Tekno Karsa 2.0'] as $index => $title) {
            DB::table('workPrograms')
                ->whereIn('id', DB::table('information')->select('id')->where('category', 'proker')->where('title', $title))
                ->update(['priority' => $index + 1]);
        }
    }

    public function down(): void
    {
        Schema::table('workPrograms', function (Blueprint $table): void {
            $table->dropColumn('priority');
        });
    }
};
