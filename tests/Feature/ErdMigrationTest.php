<?php

use App\Services\ErdBackfillService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

test('ERD v2 preserves legacy content and backfills people, membership, slugs, and baseline revisions once', function () {
    expect(Schema::hasTable('people'))->toBeTrue();
    expect(Schema::hasTable('documents'))->toBeTrue();
    expect(Schema::hasTable('auditEvents'))->toBeTrue();

    $birdeptId = DB::table('units')->insertGetId([
        'name' => 'Media Branding',
        'abbreviation' => 'medbrand',
        'type' => 'biro',
    ], 'unitId');
    $userId = DB::table('users')->insertGetId([
        'username' => 'editor1',
        'password' => bcrypt('secret-password'),
        'email' => 'editor@example.test',
        'name' => 'Editor Satu',
        'studentNumber' => '12345678',
        'studyProgram' => 'Ilmu Komputer',
    ]);
    DB::table('organizationMembers')->insert(['id' => $userId, 'unitId' => $birdeptId, 'position' => 'Staff']);
    $infoId = DB::table('information')->insertGetId([
        'unitId' => $birdeptId,
        'userId' => $userId,
        'title' => 'Kegiatan M Space',
        'description' => 'Informasi kegiatan',
        'status' => 'published',
        'category' => 'proker',
        'publishedAt' => now(),
    ]);

    $service = app(ErdBackfillService::class);
    $service->run();
    $service->run();

    $this->assertDatabaseCount('people', 1);
    $this->assertDatabaseCount('memberships', 1);
    $this->assertDatabaseCount('contentRevisions', 1);
    $this->assertDatabaseHas('information', ['id' => $infoId, 'slug' => 'kegiatan-m-space-'.$infoId]);
    $this->assertDatabaseHas('users', ['id' => $userId, 'studyProgramId' => DB::table('studyPrograms')->where('name', 'Ilmu Komputer')->value('id')]);
});
