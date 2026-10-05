<?php

require 'D:/herd/admin-mspace/vendor/autoload.php';
$app = require 'D:/herd/admin-mspace/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$db = Illuminate\Support\Facades\DB::connection();
$trial = 'mspace_schema_backup_20260927_003339';
$recovery = 'mspace_schema_backup_20260927_004025';
if ($db->getDatabaseName() === $trial || $db->getDatabaseName() === $recovery) {
    throw new RuntimeException('Refusing to operate while connected to a backup');
}
$exists = fn (string $name) => (bool) $db->selectOne('SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?', [$name]);
if (! $exists($recovery)) {
    throw new RuntimeException('Recovery database is missing');
}
if ($exists($trial)) {
    $db->statement("DROP DATABASE `{$trial}`");
}
echo 'Removed migrated test clone; original recovery copy retained', PHP_EOL;
