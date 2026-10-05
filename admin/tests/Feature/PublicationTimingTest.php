<?php

use App\Models\Birdept;
use App\Models\Informasi;
use App\Models\User;

test('publication time is retained and a date-only expiry lasts through the selected day', function () {
    $admin = User::factory()->create();
    $admin->forceFill(['adminRole' => 'admin'])->save();
    $unit = Birdept::create(['name' => 'Media Branding', 'abbreviation' => 'Medbrand', 'type' => 'biro']);

    $payload = [
        'unitId' => $unit->unitId,
        'title' => 'Jadwal publikasi',
        'description' => 'Konten terjadwal',
        'category' => 'kegiatan',
        'status' => 'published',
        'publishedAt' => '2026-10-12T14:30',
        'expiresAt' => '2026-10-12',
    ];

    $this->actingAs($admin)->post(route('admin.informasi.store'), $payload)->assertSessionHasNoErrors();
    $item = Informasi::sole();
    expect($item->publishedAt->format('Y-m-d H:i:s'))->toBe('2026-10-12 14:30:00');
    expect($item->expiresAt->format('Y-m-d H:i:s'))->toBe('2026-10-12 23:59:59');

    $this->actingAs($admin)->put(route('admin.informasi.update', $item->id), [
        ...$payload,
        'publishedAt' => '2026-10-12T16:45',
    ])->assertSessionHasNoErrors();
    expect($item->fresh()->publishedAt->format('H:i:s'))->toBe('16:45:00');

    $editor = User::factory()->create();
    $editor->forceFill(['adminRole' => 'editor'])->save();
    $this->actingAs($editor)->delete(route('admin.informasi.destroy', $item->id))->assertForbidden();
    $this->actingAs($admin)->delete(route('admin.informasi.destroy', $item->id))->assertRedirect();
    expect(Informasi::count())->toBe(0);
    expect(Informasi::withTrashed()->sole()->deletedAt)->not->toBeNull();
    expect(app(\App\Services\CsvService::class)->exportCsv('information'))->not->toContain('Jadwal publikasi');
});
