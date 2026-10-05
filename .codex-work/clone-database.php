<?php

require 'D:/herd/admin-mspace/vendor/autoload.php';
$app = require 'D:/herd/admin-mspace/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$db = Illuminate\Support\Facades\DB::connection();
$source = $db->getDatabaseName();
$target = 'mspace_schema_backup_'.date('Ymd_His');
foreach ([$source, $target] as $name) {
    if (! preg_match('/^[A-Za-z0-9_]+$/', $name)) {
        throw new RuntimeException('Unsafe database name');
    }
}

$pdo = $db->getPdo();
$tables = array_map(fn ($row) => array_values((array) $row)[0], $db->select('SHOW FULL TABLES WHERE Table_type = ?', ['BASE TABLE']));
$pdo->exec("CREATE DATABASE `{$target}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
$pdo->exec('SET FOREIGN_KEY_CHECKS=0');
try {
    foreach ($tables as $table) {
        if (! preg_match('/^[A-Za-z0-9_]+$/', $table)) {
            throw new RuntimeException('Unsafe table name');
        }
        $create = (array) $db->selectOne("SHOW CREATE TABLE `{$table}`");
        $ddl = $create['Create Table'];
        $pdo->exec("USE `{$target}`");
        $pdo->exec($ddl);
        $pdo->exec("INSERT INTO `{$target}`.`{$table}` SELECT * FROM `{$source}`.`{$table}`");
        $pdo->exec("USE `{$source}`");
        $sourceCount = (int) $db->selectOne("SELECT COUNT(*) AS n FROM `{$source}`.`{$table}`")->n;
        $targetCount = (int) $db->selectOne("SELECT COUNT(*) AS n FROM `{$target}`.`{$table}`")->n;
        if ($sourceCount !== $targetCount) {
            throw new RuntimeException("Backup count mismatch: {$table}");
        }
    }
} finally {
    $pdo->exec('SET FOREIGN_KEY_CHECKS=1');
    $pdo->exec("USE `{$source}`");
}

echo "Verified backup: {$target}; tables: ", count($tables), PHP_EOL;
