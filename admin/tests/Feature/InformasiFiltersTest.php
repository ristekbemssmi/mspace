<?php

use App\Models\Birdept;
use App\Models\Informasi;
use App\Models\User;
use Illuminate\Support\Facades\DB;

test('information list searches category and birdept and filters dates and visits', function () {
    $editor = User::factory()->create();
    $editor->forceFill(['adminRole' => 'editor'])->save();
    $unit = Birdept::create(['name' => 'Riset dan Teknologi', 'abbreviation' => 'rizztek', 'type' => 'biro']);

    $first = Informasi::create([
        'unitId' => $unit->unitId, 'userId' => $editor->id, 'title' => 'Seminar Kampus',
        'description' => 'Agenda publik', 'category' => 'kegiatan', 'status' => 'published',
        'publishedAt' => '2026-10-01 08:00:00', 'expiresAt' => '2026-10-20 23:59:59',
    ]);
    $second = Informasi::create([
        'unitId' => $unit->unitId, 'userId' => $editor->id, 'title' => 'Lowongan Magang',
        'description' => 'Informasi karier', 'category' => 'magang', 'status' => 'published',
        'publishedAt' => '2026-09-01 08:00:00', 'expiresAt' => '2026-10-10 23:59:59',
    ]);
    foreach ([$first, $first, $second] as $index => $info) {
        DB::table('siteVisits')->insert([
            'visitorId' => '00000000-0000-4000-8000-'.str_pad((string) ($index + 1), 12, '0', STR_PAD_LEFT),
            'routeName' => 'informasi.show', 'informationId' => $info->id,
            'visitedAt' => now(),
        ]);
    }

    $this->actingAs($editor)->get(route('admin.informasi.index', ['search' => 'kegiatan']))
        ->assertOk()->assertInertia(fn ($page) => $page->where('information.total', 1)->where('information.data.0.id', $first->id));
    $this->actingAs($editor)->get(route('admin.informasi.index', ['search' => 'rizztek']))
        ->assertOk()->assertInertia(fn ($page) => $page->where('information.total', 2));
    $this->actingAs($editor)->get(route('admin.informasi.index', [
        'dateField' => 'publishedAt', 'dateFrom' => '2026-10-01', 'dateTo' => '2026-10-05',
        'visitsMin' => 2, 'sortBy' => 'title', 'sortDirection' => 'asc',
    ]))->assertOk()->assertInertia(fn ($page) => $page->where('information.total', 1)->where('information.data.0.id', $first->id));
    $this->actingAs($editor)->get(route('admin.informasi.index', [
        'sortBy' => 'title', 'sortDirection' => 'asc',
    ]))->assertOk()->assertInertia(fn ($page) => $page->where('information.data.0.id', $second->id));
});
