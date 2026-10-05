<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('informationImages', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('informationId')->constrained('information')->cascadeOnDelete();
            $table->string('storagePath')->unique();
            $table->string('originalName');
            $table->string('mimeType', 20)->default('image/webp');
            $table->unsignedInteger('sizeBytes');
            $table->unsignedSmallInteger('width');
            $table->unsignedSmallInteger('height');
            $table->unsignedSmallInteger('sortOrder')->default(0);
            $table->timestamp('createdAt')->nullable();
            $table->timestamp('updatedAt')->nullable();
            $table->index(['informationId', 'sortOrder']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('informationImages');
    }
};
