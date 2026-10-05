<?php

use App\Models\Birdept;
use App\Models\Informasi;
use App\Models\User;

test('editor can create and update a competition with its details', function () {
    $editor = User::factory()->create();
    $editor->forceFill(['adminRole' => 'editor'])->save();
    $unit = Birdept::create(['name' => 'Akademik dan Prestasi', 'abbreviation' => 'Akpres', 'type' => 'departemen']);
    $editor->userBem()->create(['unitId' => $unit->unitId, 'position' => 'Staf']);

    $payload = [
        'unitId' => $unit->unitId,
        'title' => 'Lomba Sains Data',
        'description' => 'Kompetisi terbuka bagi mahasiswa',
        'category' => 'lomba',
        'status' => 'draft',
        'lomba' => [
            'organizer' => 'Panitia Sains Data',
            'registrationUrl' => 'https://example.org/daftar',
            'opensOn' => '2026-10-07',
            'closesOn' => '2026-10-21',
        ],
    ];

    $this->actingAs($editor)->post(route('admin.informasi.store'), $payload)->assertRedirect();
    $info = Informasi::sole();
    expect($info->category)->toBe('lomba');
    expect($info->lomba->organizer)->toBe('Panitia Sains Data');

    $this->actingAs($editor)->get(route('admin.informasi.index', ['category' => 'lomba']))
        ->assertOk()->assertSee('Lomba Sains Data');

    $this->actingAs($editor)->put(route('admin.informasi.update', $info->id), [
        ...$payload,
        'lomba' => [...$payload['lomba'], 'closesOn' => '2026-10-28'],
    ])->assertRedirect();
    expect($info->fresh()->lomba->closesOn)->toBe('2026-10-28');

    $this->actingAs($editor)->put(route('admin.informasi.update', $info->id), [
        ...$payload,
        'lomba' => [...$payload['lomba'], 'registrationUrl' => 'javascript:alert(1)'],
    ])->assertSessionHasErrors('lomba.registrationUrl');
});
