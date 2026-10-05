<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('information') || ! Schema::hasColumn('information', 'expiresAt')) {
            return;
        }

        DB::table('information')->select(['id', 'expiresAt'])
            ->whereNotNull('expiresAt')
            ->orderBy('id')
            ->chunkById(250, function ($rows): void {
                foreach ($rows as $row) {
                    $expiry = Carbon::parse($row->expiresAt, config('app.timezone'));
                    if ($expiry->format('H:i:s') === '00:00:00') {
                        DB::table('information')->where('id', $row->id)
                            ->update(['expiresAt' => $expiry->endOfDay()->format('Y-m-d H:i:s')]);
                    }
                }
            });
    }

    public function down(): void
    {
        // This conversion cannot distinguish original midnight intent from date-only input.
    }
};
