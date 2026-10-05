<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('information', function (Blueprint $table): void {
            $table->string('category', 30)->change();
        });

        if (! Schema::hasTable('competitions')) {
            Schema::create('competitions', function (Blueprint $table): void {
                $table->foreignId('id')->primary()->constrained('information')->cascadeOnDelete();
                $table->string('organizer')->nullable();
                $table->string('registrationUrl', 2048)->nullable();
                $table->date('opensOn')->nullable();
                $table->date('closesOn')->nullable();
            });
        }
    }

    public function down(): void
    {
        // Existing lomba records and competition details must remain valid if rolled back.
    }
};
