<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

test('category pages show published information with their category details', function () {
    $unit = DB::table('units')->insertGetId([
        'name' => 'Riset dan Teknologi', 'abbreviation' => 'rizztek', 'type' => 'biro',
    ], 'unitId');
    $author = DB::table('users')->insertGetId([
        'username' => 'category-author', 'password' => bcrypt('secret-password'),
        'email' => 'category-author@example.test', 'name' => 'Penulis', 'studentNumber' => '12345681',
    ]);

    $cases = [
        ['kegiatan', 'activities', 'informasi-kegiatan', 'Seminar Data', ['eventAt' => now()->addDay(), 'location' => 'Aula SSMI', 'organizer' => 'BEM SSMI'], 'Aula SSMI'],
        ['alumni', 'alumni', 'informasi-alumni', 'Cerita Alumni', ['name' => 'Nadia', 'cohort' => '2020', 'topic' => 'Karier Data'], 'Karier Data'],
        ['wisuda', 'graduations', 'informasi-wisuda', 'Wisuda Oktober', ['graduationPeriod' => 'Oktober 2026', 'registrationSteps' => 'Isi formulir'], 'Oktober 2026'],
        ['magang', 'internships', 'informasi-magang', 'Magang Analis', ['company' => 'Perusahaan Data', 'position' => 'Data Analyst', 'duration' => '3 bulan'], 'Perusahaan Data'],
    ];

    foreach ($cases as [$category, $table, $route, $title, $detail, $detailText]) {
        $id = DB::table('information')->insertGetId([
            'unitId' => $unit, 'userId' => $author, 'title' => $title,
            'description' => "Deskripsi {$title}", 'category' => $category,
            'status' => 'published', 'publishedAt' => now()->subHour(), 'expiresAt' => now()->addWeek(),
        ]);
        DB::table($table)->insert(['id' => $id, ...$detail]);

        $this->get(route($route))->assertOk()->assertSee($title)->assertSee($detailText);
        $this->get(route('informasi.show', $id))->assertOk()->assertSee($detailText);
    }

    DB::table('information')->insert([
        'unitId' => $unit, 'userId' => $author, 'title' => 'Kegiatan rahasia',
        'description' => 'Belum terbit', 'category' => 'kegiatan', 'status' => 'draft',
    ]);
    $this->get(route('informasi-kegiatan'))->assertOk()->assertDontSee('Kegiatan rahasia');
});

test('scholarship page uses the shared category item contract', function () {
    $unit = DB::table('units')->insertGetId([
        'name' => 'Riset dan Teknologi', 'abbreviation' => 'rizztek', 'type' => 'biro',
    ], 'unitId');
    $author = DB::table('users')->insertGetId([
        'username' => 'scholarship-author', 'password' => bcrypt('secret-password'),
        'email' => 'scholarship-author@example.test', 'name' => 'Penulis', 'studentNumber' => '12345682',
    ]);
    $id = DB::table('information')->insertGetId([
        'unitId' => $unit, 'userId' => $author, 'title' => 'Beasiswa Unggulan',
        'description' => 'Bantuan biaya kuliah', 'category' => 'beasiswa',
        'status' => 'published', 'publishedAt' => now()->subHour(), 'expiresAt' => now()->addWeek(),
    ]);
    DB::table('scholarships')->insert([
        'id' => $id, 'organizer' => 'Yayasan Pendidikan',
        'opensOn' => now()->toDateString(), 'closesOn' => now()->addDays(5)->toDateString(),
        'posterUrl' => '', 'instagramUrl' => '', 'registrationUrl' => '',
    ]);

    $this->get(route('informasi-beasiswa'))->assertOk()
        ->assertSee('Beasiswa Unggulan')
        ->assertSee('Riset dan Teknologi')
        ->assertSee('Yayasan Pendidikan');
});
