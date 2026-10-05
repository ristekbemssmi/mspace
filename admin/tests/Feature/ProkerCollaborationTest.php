<?php

use App\Models\Birdept;
use App\Models\Informasi;
use App\Models\User;

test('a proker can be managed by a primary birdept and a collaborator', function () {
    $editor = User::factory()->create();
    $editor->forceFill(['adminRole' => 'editor'])->save();
    $primary = Birdept::create(['name' => 'Media Branding', 'abbreviation' => 'Medbrand', 'type' => 'biro']);
    $collaborator = Birdept::create(['name' => 'Riset dan Teknologi', 'abbreviation' => 'Rizztek', 'type' => 'biro']);

    $payload = [
        'unitId' => $primary->unitId,
        'unitIds' => [$collaborator->unitId],
        'title' => 'Proker bersama',
        'description' => 'Dikerjakan oleh dua birdept',
        'category' => 'proker',
        'status' => 'draft',
    ];

    $this->actingAs($editor)->post(route('admin.informasi.store'), $payload)->assertRedirect();
    $info = Informasi::sole();
    expect($info->unitId)->toBe($primary->unitId);
    expect($info->units()->pluck('units.unitId')->all())->toBe([$collaborator->unitId]);

    $this->actingAs($editor)->put(route('admin.informasi.update', $info->id), [
        ...$payload,
        'unitIds' => [],
    ])->assertRedirect();
    expect($info->fresh()->units()->count())->toBe(0);

    $this->actingAs($editor)->put(route('admin.informasi.update', $info->id), [
        ...$payload,
        'unitIds' => [999999],
    ])->assertSessionHasErrors('unitIds.0');
});
