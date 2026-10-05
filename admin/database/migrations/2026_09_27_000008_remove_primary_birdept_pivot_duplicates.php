<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('informasi_birdepts')) {
            return;
        }

        DB::table('informasi')->where('jenis_informasi', 'proker')
            ->select(['id', 'idbirdept'])->orderBy('id')->chunkById(500, function ($rows): void {
                foreach ($rows as $row) {
                    DB::table('informasi_birdepts')
                        ->where('informasi_id', $row->id)
                        ->where('birdept_id', $row->idbirdept)
                        ->delete();
                }
            });
    }

    public function down(): void
    {
        // Duplicate owner links are intentionally not restored.
    }
};
