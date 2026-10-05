<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('sessions') || ! Schema::hasColumn('sessions', 'user_id')) {
            return;
        }

        $userId = collect(Schema::getColumns('sessions'))->firstWhere('name', 'user_id');

        if ($userId && ! $userId['nullable']) {
            Schema::table('sessions', fn (Blueprint $table) => $table->unsignedBigInteger('user_id')->nullable()->change());
        }
    }

    public function down(): void
    {
        // Guest sessions may already exist and cannot safely gain a required user ID.
    }
};
