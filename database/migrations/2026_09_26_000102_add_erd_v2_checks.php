<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement("ALTER TABLE informasi ADD CONSTRAINT informasi_status_check CHECK (status IN ('draft', 'review', 'published', 'archived'))");
        DB::statement("ALTER TABLE informasi ADD CONSTRAINT informasi_type_check CHECK (jenis_informasi IN ('beasiswa', 'kegiatan', 'himpunan', 'wisuda', 'alumni', 'magang', 'proker', 'lomba'))");
        DB::statement("ALTER TABLE informasi ADD CONSTRAINT informasi_publication_check CHECK (status <> 'published' OR waktu_publikasi IS NOT NULL)");
        DB::statement('ALTER TABLE memberships ADD CONSTRAINT memberships_dates_check CHECK (ended_on IS NULL OR started_on IS NULL OR ended_on >= started_on)');
        DB::statement('ALTER TABLE informasi_proker ADD CONSTRAINT proker_dates_check CHECK (waktu_selesai IS NULL OR waktu_mulai IS NULL OR waktu_selesai >= waktu_mulai)');
        DB::statement('ALTER TABLE informasi_beasiswa ADD CONSTRAINT beasiswa_dates_check CHECK (tanggal_tutup IS NULL OR tanggal_buka IS NULL OR tanggal_tutup >= tanggal_buka)');
        DB::statement("ALTER TABLE documents ADD CONSTRAINT documents_visibility_check CHECK (visibility IN ('public', 'private'))");
        DB::statement("ALTER TABLE audit_events ADD CONSTRAINT audit_events_outcome_check CHECK (outcome IN ('success', 'failure', 'denied'))");
        DB::statement('ALTER TABLE wisuda_profiles ADD CONSTRAINT wisuda_profiles_ipk_check CHECK (ipk IS NULL OR (ipk >= 0 AND ipk <= 4))');
    }

    public function down(): void
    {
        throw new RuntimeException('ERD v2 constraints are part of the migrated schema; restore a verified backup to reverse.');
    }
};
