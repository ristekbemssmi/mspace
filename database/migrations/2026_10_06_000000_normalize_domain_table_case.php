<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const TABLES = [
        'studyPrograms', 'scholarshipRequirements', 'scholarshipBenefits',
        'studentAssociations', 'workPrograms', 'workProgramLinks',
        'informationUnits', 'informationDocuments', 'workProgramCommittees',
        'organizationMembers', 'generalUsers', 'featuredPrograms',
        'workProgramParticipants', 'graduationProfiles', 'userRoles',
        'documentVersions', 'contentRevisions', 'auditEvents',
        'informationImages', 'siteVisits',
    ];

    public function up(): void
    {
        // Imported databases already use lowercase names. Fresh installations on
        // case-sensitive MySQL may still contain the historical camelCase names.
        if (! in_array(Schema::getConnection()->getDriverName(), ['mysql', 'mariadb'], true)) {
            return;
        }
        if ((int) DB::selectOne('SELECT @@lower_case_table_names AS mode')->mode !== 0) {
            return;
        }

        foreach (self::TABLES as $name) {
            $lowercase = strtolower($name);
            $existing = Schema::getTableListing();

            if (in_array($name, $existing, true) && in_array($lowercase, $existing, true)) {
                throw new RuntimeException("Both {$name} and {$lowercase} exist; resolve the duplicate before migrating.");
            }

            if (in_array($name, $existing, true)) {
                Schema::rename($name, $lowercase);
            }
        }
    }

    public function down(): void
    {
        throw new RuntimeException('Restore a database backup to reverse table name normalization.');
    }
};
