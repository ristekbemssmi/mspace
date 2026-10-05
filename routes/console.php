<?php

use App\Services\ErdBackfillService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('erd:backfill', function (ErdBackfillService $service): void {
    foreach ($service->run() as $table => $count) {
        $this->line("{$table}: {$count} new rows");
    }
})->purpose('Synchronize legacy M-SPACE rows into additive ERD v2 tables');

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
