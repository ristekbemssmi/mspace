<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The public ERD v2 migration already creates this pivot on the shared database.
        if (! Schema::hasTable('informasi_birdepts')) {
            Schema::create('informasi_birdepts', function (Blueprint $table): void {
                $table->foreignId('informasi_id')->constrained('informasi')->cascadeOnDelete();
                $table->foreignId('birdept_id')->references('idbirdept')->on('birdepts')->cascadeOnDelete();
                $table->primary(['informasi_id', 'birdept_id']);
            });
        }

    }

    public function down(): void
    {
        // The pivot is shared with the public application; do not delete it or its data.
    }
};
