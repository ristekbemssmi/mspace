<?php

use App\Models\Birdept;
use App\Models\Informasi;
use App\Models\User;

test('admin can set, edit, and clear proker priority', function () {
    $editor = User::factory()->create();
    $editor->forceFill(['adminRole' => 'editor'])->save();
    $birdept = Birdept::create(['name' => 'Media Branding', 'abbreviation' => 'Medbrand', 'type' => 'biro']);
    $editor->userBem()->create(['unitId' => $birdept->unitId, 'position' => 'Staf']);

    $payload = [
        'unitId' => $birdept->unitId,
        'title' => 'Proker prioritas',
        'description' => 'Program unggulan',
        'category' => 'proker',
        'status' => 'draft',
        'proker' => ['priority' => 2],
    ];

    $this->actingAs($editor)->post(route('admin.informasi.store'), $payload)->assertRedirect();
    $info = Informasi::sole();
    expect($info->proker->priority)->toBe(2);

    $this->actingAs($editor)->put(route('admin.informasi.update', $info->id), [
        ...$payload,
        'proker' => ['priority' => 1],
    ])->assertRedirect();
    expect($info->fresh()->proker->priority)->toBe(1);

    $this->actingAs($editor)->put(route('admin.informasi.update', $info->id), [
        ...$payload,
        'proker' => ['priority' => null],
    ])->assertRedirect();
    expect($info->fresh()->proker->priority)->toBeNull();

    $this->actingAs($editor)->put(route('admin.informasi.update', $info->id), [
        ...$payload,
        'proker' => ['priority' => 0],
    ])->assertSessionHasErrors('proker.priority');
});
