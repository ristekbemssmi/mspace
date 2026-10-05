<?php

require 'D:/herd/admin-mspace/vendor/autoload.php';
$app = require 'D:/herd/admin-mspace/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$tables = Illuminate\Support\Facades\DB::select("SELECT TABLE_NAME AS name, COLUMN_NAME AS col, COLUMN_TYPE AS type, IS_NULLABLE AS nullable FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() ORDER BY TABLE_NAME, ORDINAL_POSITION");
echo 'lower_case_table_names=', Illuminate\Support\Facades\DB::selectOne("SHOW VARIABLES LIKE 'lower_case_table_names'")->Value, PHP_EOL;
foreach ($tables as $column) {
    echo $column->name, '.', $column->col, ' ', $column->type, ' ', $column->nullable, PHP_EOL;
}
