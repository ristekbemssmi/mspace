<?php

$project = $argv[1] ?? 'admin';
$base = $project === 'public' ? 'D:/herd/mspace' : 'D:/herd/admin-mspace';
require $base.'/vendor/autoload.php';
$app = require $base.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$schema = Illuminate\Support\Facades\Schema::getFacadeRoot();
foreach (['users' => ['adminRole', 'createdAt'], 'units' => ['unitId', 'name'], 'information' => ['title', 'category', 'publishedAt', 'expiresAt'], 'informationUnits' => ['informationId', 'unitId']] as $table => $columns) {
    if (! $schema->hasTable($table)) {
        throw new RuntimeException("Missing table: {$table}");
    }
    foreach ($columns as $column) {
        if (! $schema->hasColumn($table, $column)) {
            throw new RuntimeException("Missing column: {$table}.{$column}");
        }
    }
}

$count = App\Models\Informasi::count();
$sample = App\Models\Informasi::with('birdept')->first();
if ($sample && ! $sample->birdept) {
    throw new RuntimeException('Information unit relation failed');
}
echo $project, ': information=', $count, ', users=', App\Models\User::count(), ', relation=ok', PHP_EOL;
echo 'expirations=', Illuminate\Support\Facades\DB::table('information')->whereNotNull('expiresAt')->count(), ', midnight=', Illuminate\Support\Facades\DB::table('information')->whereRaw("TIME(expiresAt) = '00:00:00'")->count(), PHP_EOL;
echo 'appTimezone=', config('app.timezone'), ', dbTimezone=', Illuminate\Support\Facades\DB::selectOne('SELECT @@session.time_zone AS tz')->tz, PHP_EOL;
echo 'dbOffsetSeconds=', Illuminate\Support\Facades\DB::selectOne('SELECT TIMESTAMPDIFF(SECOND, UTC_TIMESTAMP(), NOW()) AS offsetSeconds')->offsetSeconds, PHP_EOL;
