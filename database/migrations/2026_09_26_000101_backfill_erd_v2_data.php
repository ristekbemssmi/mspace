<?php

use App\Services\LegacyErdBackfillService;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        app(LegacyErdBackfillService::class)->run();
    }

    public function down(): void
    {
        throw new RuntimeException('ERD v2 backfill cannot be safely reversed. Restore a verified backup instead.');
    }
};
