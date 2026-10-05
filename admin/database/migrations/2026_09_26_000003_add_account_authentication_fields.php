<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'email_verified_at')) {
            Schema::table('users', fn (Blueprint $table) => $table->timestamp('email_verified_at')->nullable());
        }

        Schema::table('users', function (Blueprint $table): void {
            $table->string('nim')->nullable()->change();
        });
    }

    public function down(): void
    {
        // Existing accounts without NIM prevent a safe reverse to NOT NULL.
    }
};
