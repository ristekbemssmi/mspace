<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('siteVisits')) {
            return;
        }

        Schema::create('siteVisits', function (Blueprint $table): void {
            $table->id();
            $table->uuid('visitorId');
            $table->string('routeName', 100);
            $table->foreignId('informationId')->nullable()->constrained('information')->nullOnDelete();
            $table->foreignId('unitId')->nullable()->constrained('units', 'unitId')->nullOnDelete();
            $table->timestamp('visitedAt');
            $table->index(['visitedAt', 'visitorId']);
            $table->index(['informationId', 'visitedAt']);
            $table->index(['unitId', 'visitedAt']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('siteVisits');
    }
};
