<?php

use App\Models\Birdept;
use App\Models\Informasi;
use App\Models\User;

test('editor creation follows category ownership and cannot impersonate another birdept', function () {
    $units = collect([
        'Adkesmah' => 'Advokasi dan Kesejahteraan Mahasiswa',
        'PSDMK' => 'Pengembangan Sumber Daya Mahasiswa dan Karir',
        'Akpres' => 'Akademik dan Prestasi',
        'Medbrand' => 'Media Branding',
    ])->mapWithKeys(fn ($name, $abbreviation) => [
        $abbreviation => Birdept::create(['name' => $name, 'abbreviation' => $abbreviation, 'type' => 'departemen']),
    ]);

    $expected = [
        'Adkesmah' => ['beasiswa', 'kegiatan', 'proker'],
        'PSDMK' => ['wisuda', 'alumni', 'magang', 'kegiatan', 'proker'],
        'Akpres' => ['lomba', 'kegiatan', 'proker'],
        'Medbrand' => ['kegiatan', 'proker'],
    ];
    $categories = ['beasiswa', 'kegiatan', 'himpunan', 'wisuda', 'alumni', 'magang', 'proker', 'lomba'];

    foreach ($expected as $abbreviation => $allowed) {
        $editor = User::factory()->create(['adminRole' => 'editor']);
        $editor->userBem()->create(['unitId' => $units[$abbreviation]->unitId, 'position' => 'Staf']);

        foreach ($categories as $category) {
            $payload = [
                'unitId' => $units[$abbreviation]->unitId,
                'title' => "{$abbreviation} {$category}",
                'description' => 'Isi informasi',
                'category' => $category,
                'status' => 'draft',
            ];
            $response = $this->actingAs($editor)->post(route('admin.informasi.store'), $payload);
            in_array($category, $allowed, true) ? $response->assertRedirect() : $response->assertForbidden();
        }

        $this->post(route('admin.informasi.store'), [
            'unitId' => $units['Medbrand']->unitId === $units[$abbreviation]->unitId
                ? $units['Akpres']->unitId : $units['Medbrand']->unitId,
            'title' => 'Meniru birdept lain', 'description' => 'Isi',
            'category' => 'kegiatan', 'status' => 'draft',
        ])->assertForbidden();
    }

    $unassigned = User::factory()->create(['adminRole' => 'editor']);
    $this->actingAs($unassigned)->post(route('admin.informasi.store'), [
        'unitId' => $units['Medbrand']->unitId,
        'title' => 'Tanpa birdept', 'description' => 'Isi',
        'category' => 'kegiatan', 'status' => 'draft',
    ])->assertForbidden();
});

test('editor can update published content in their birdept without changing status or moving it', function () {
    $unit = Birdept::create(['name' => 'Media Branding', 'abbreviation' => 'Medbrand', 'type' => 'biro']);
    $otherUnit = Birdept::create(['name' => 'Riset dan Teknologi', 'abbreviation' => 'Rizztek', 'type' => 'biro']);
    $author = User::factory()->create(['adminRole' => 'admin']);
    $editor = User::factory()->create(['adminRole' => 'editor']);
    $editor->userBem()->create(['unitId' => $unit->unitId, 'position' => 'Staf']);
    $info = Informasi::create([
        'unitId' => $unit->unitId, 'userId' => $author->id,
        'title' => 'Kegiatan lama', 'description' => 'Isi lama',
        'category' => 'kegiatan', 'status' => 'published', 'publishedAt' => now(),
    ]);
    $payload = [
        'unitId' => $unit->unitId, 'title' => 'Kegiatan diperbarui',
        'description' => 'Isi baru', 'category' => 'kegiatan', 'status' => 'published',
    ];

    $this->actingAs($editor)->put(route('admin.informasi.update', $info->id), $payload)->assertRedirect();
    expect($info->fresh()->title)->toBe('Kegiatan diperbarui');
    $this->put(route('admin.informasi.update', $info->id), [...$payload, 'status' => 'archived'])->assertForbidden();
    $this->put(route('admin.informasi.update', $info->id), [...$payload, 'unitId' => $otherUnit->unitId])->assertForbidden();
    $this->put(route('admin.informasi.update', $info->id), [...$payload, 'category' => 'proker'])->assertForbidden();
});
