<?php

use App\Models\Birdept;
use App\Models\Informasi;
use App\Models\User;
use App\Services\VisitAnalytics;
use Illuminate\Support\Facades\DB;

test('visitor analytics separates unique people from page views and ranks public pages', function () {
    $this->travelTo(\Carbon\Carbon::parse('2026-09-29 12:00:00', 'Asia/Jakarta'));
    $user = User::factory()->create();
    $user->forceFill(['adminRole' => 'viewer'])->save();
    $unit = Birdept::create(['name' => 'Media Branding', 'abbreviation' => 'medbrand', 'type' => 'biro']);
    $information = Informasi::create([
        'unitId' => $unit->unitId, 'userId' => $user->id, 'title' => 'Berita populer',
        'description' => 'Contoh', 'category' => 'kegiatan', 'status' => 'published',
        'publishedAt' => now()->subDay(),
    ]);

    foreach ([
        ['visitor' => '11111111-1111-4111-8111-111111111111', 'when' => now(), 'informationId' => $information->id, 'unitId' => null],
        ['visitor' => '11111111-1111-4111-8111-111111111111', 'when' => now(), 'informationId' => $information->id, 'unitId' => null],
        ['visitor' => '22222222-2222-4222-8222-222222222222', 'when' => now(), 'informationId' => null, 'unitId' => $unit->unitId],
    ] as $visit) {
        DB::table('siteVisits')->insert([
            'visitorId' => $visit['visitor'], 'routeName' => 'public.test',
            'informationId' => $visit['informationId'], 'unitId' => $visit['unitId'],
            'visitedAt' => $visit['when'],
        ]);
    }

    $analytics = app(VisitAnalytics::class);
    expect($analytics->totals())->toBe(['visitors' => 2, 'views' => 3, 'visitorsToday' => 2]);
    expect($analytics->series()['day'][6]['views'])->toBe(3);
    expect($analytics->series()['day'][6]['visitors'])->toBe(2);
    expect($analytics->series()['week'][7]['views'])->toBe(3);
    expect($analytics->series()['month'][11]['views'])->toBe(3);
    expect((int) $analytics->topInformation()[0]->views)->toBe(2);
    expect((int) $analytics->topUnits()[0]->views)->toBe(1);

    $this->actingAs($user)->get(route('admin.dashboard'))->assertOk();
    $this->get(route('admin.informasi.index'))->assertOk();
    $this->get(route('admin.birdept.index'))->assertOk();
});
