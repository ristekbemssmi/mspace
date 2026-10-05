<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unitrequests', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('userId')->unique()->constrained('users')->cascadeOnDelete();
            $table->foreignId('requestedUnitId')->constrained('units', 'unitId');
            $table->string('requestedPosition', 255);
            $table->string('status', 20)->default('pending');
            $table->foreignId('reviewedBy')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unitrequests');
    }
};
