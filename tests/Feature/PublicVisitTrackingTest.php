<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

test('public pages record page views with an anonymous visitor and resource IDs', function () {
    $unitId = DB::table('units')->insertGetId([
        'name' => 'Media Branding', 'abbreviation' => 'medbrand', 'type' => 'biro',
    ], 'unitId');
    $authorId = DB::table('users')->insertGetId([
        'username' => 'visit_author', 'password' => bcrypt('password'),
        'email' => 'visit@example.test', 'name' => 'Penulis', 'studentNumber' => '12345673',
    ]);
    $informationId = DB::table('information')->insertGetId([
        'unitId' => $unitId, 'userId' => $authorId, 'title' => 'Informasi dilihat',
        'slug' => 'informasi-dilihat', 'description' => 'Contoh', 'category' => 'kegiatan',
        'status' => 'published', 'publishedAt' => now()->subDay(),
    ]);

    $this->get('/')->assertOk();
    $visitorId = DB::table('siteVisits')->value('visitorId');
    $this->withCookie('mspace_visitor', $visitorId);
    $this->get('/informasi/informasi-dilihat')->assertOk();
    $this->get('/birdept/medbrand')->assertOk();
    $this->get('/informasi/tidak-ada')->assertNotFound();
    $this->withHeader('X-Inertia-Prefetch', 'true')->get('/')->assertOk();

    $visits = DB::table('siteVisits')->orderBy('id')->get();
    expect($visits)->toHaveCount(3);
    expect($visits->pluck('visitorId')->unique())->toHaveCount(1);
    expect($visits[1]->informationId)->toBe($informationId);
    expect($visits[2]->unitId)->toBe($unitId);
});
