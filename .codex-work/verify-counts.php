<?php

require 'D:/herd/admin-mspace/vendor/autoload.php';
$app = require 'D:/herd/admin-mspace/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$db = Illuminate\Support\Facades\DB::connection();
$backup = 'mspace_schema_backup_20260927_004025';
$current = $db->getDatabaseName();
$migration = file_get_contents('D:/herd/mspace/database/migrations/2026_09_27_010000_standardize_domain_schema.php');
preg_match('/private const TABLES = \[(.*?)\];/s', $migration, $block);
preg_match_all("/'([^']+)'\\s*=>\\s*'([^']+)'/", $block[1], $pairs, PREG_SET_ORDER);
$map = [];
foreach ($pairs as $pair) {
    $map[$pair[1]] = $pair[2];
}
$checked = 0;
foreach ($db->select("SHOW FULL TABLES FROM `{$backup}` WHERE Table_type = 'BASE TABLE'") as $row) {
    $old = array_values((array) $row)[0];
    if (in_array($old, ['migrations', 'sessions', 'cache', 'cache_locks', 'jobs', 'job_batches', 'failed_jobs', 'password_reset_tokens'], true)) {
        continue;
    }
    $new = $map[$old] ?? $old;
    $before = (int) $db->selectOne("SELECT COUNT(*) AS n FROM `{$backup}`.`{$old}`")->n;
    $after = (int) $db->selectOne("SELECT COUNT(*) AS n FROM `{$current}`.`{$new}`")->n;
    if ($before !== $after) {
        throw new RuntimeException("Count mismatch: {$old} / {$new}: {$before} / {$after}");
    }
    $checked++;
}
echo "Verified data counts for {$checked} domain tables", PHP_EOL;
