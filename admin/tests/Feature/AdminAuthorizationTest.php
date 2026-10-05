<?php

use App\Models\Birdept;
use App\Models\Informasi;
use App\Models\User;

test('ordinary accounts cannot use dashboard actions', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('admin.users.index'))->assertForbidden();
    $this->actingAs($user)->get(route('admin.users.export-csv'))->assertForbidden();
    $this->actingAs($user)->post(route('admin.csv-hub.process'))->assertForbidden();
});

test('viewer can read content but cannot modify or export it', function () {
    $viewer = User::factory()->create();
    $viewer->forceFill(['adminRole' => 'viewer'])->save();

    $this->actingAs($viewer)->get(route('admin.informasi.index'))->assertOk();
    $this->actingAs($viewer)->get(route('admin.users.index'))->assertForbidden();
    $this->actingAs($viewer)->post(route('admin.faqs.store'))->assertForbidden();
    $this->actingAs($viewer)->get(route('admin.informasi.export-csv'))->assertForbidden();
});

test('editor can create a draft only under their own author identity', function () {
    $editor = User::factory()->create();
    $editor->forceFill(['adminRole' => 'editor'])->save();
    $other = User::factory()->create();
    $birdept = Birdept::create([
        'name' => 'Media Branding',
        'abbreviation' => 'medbrand',
        'type' => 'biro',
    ]);
    $editor->userBem()->create(['unitId' => $birdept->unitId, 'position' => 'Staf']);

    $payload = [
        'unitId' => $birdept->unitId,
        'userId' => $other->id,
        'title' => 'Contoh draft',
        'description' => 'Deskripsi contoh',
        'category' => 'proker',
        'status' => 'draft',
    ];

    $this->actingAs($editor)->post(route('admin.informasi.store'), $payload)->assertRedirect();
    expect(Informasi::sole()->userId)->toBe($editor->id);

    $this->actingAs($editor)->post(route('admin.informasi.store'), [
        ...$payload,
        'title' => 'Publikasi terlarang',
        'status' => 'published',
    ])->assertForbidden();
    $this->actingAs($editor)->get(route('admin.csv-hub.export', 'users'))->assertForbidden();
});

test('account export omits credentials and two factor secrets', function () {
    $admin = User::factory()->create();
    $admin->forceFill(['adminRole' => 'admin'])->save();

    $response = $this->actingAs($admin)->get(route('admin.users.export-csv'));
    $response->assertOk();
    $csv = $response->streamedContent();

    expect($csv)->toContain('username,name,email,studentNumber');
    expect($csv)->not->toContain('password', 'remember_token', 'two_factor_secret', 'two_factor_recovery_codes');

    $this->actingAs($admin)->delete(route('admin.users.destroy', $admin->id))->assertForbidden();
});

test('editor edits drafts in their birdept regardless of author', function () {
    $author = User::factory()->create();
    $author->forceFill(['adminRole' => 'editor'])->save();
    $other = User::factory()->create();
    $other->forceFill(['adminRole' => 'editor'])->save();
    $birdept = Birdept::create([
        'name' => 'Media Branding',
        'abbreviation' => 'medbrand',
        'type' => 'biro',
    ]);
    $otherUnit = Birdept::create(['name' => 'Riset dan Teknologi', 'abbreviation' => 'Rizztek', 'type' => 'biro']);
    $author->userBem()->create(['unitId' => $birdept->unitId, 'position' => 'Staf']);
    $other->userBem()->create(['unitId' => $otherUnit->unitId, 'position' => 'Staf']);
    $info = Informasi::create([
        'unitId' => $birdept->unitId,
        'userId' => $author->id,
        'title' => 'Draft asli',
        'description' => 'Isi asli',
        'category' => 'proker',
        'status' => 'draft',
        'publishedAt' => now(),
    ]);

    $payload = [
        'unitId' => $birdept->unitId,
        'title' => 'Draft diubah',
        'description' => 'Isi diubah',
        'category' => 'proker',
        'status' => 'draft',
    ];

    $this->actingAs($other)->put(route('admin.informasi.update', $info->id), $payload)->assertForbidden();
    $this->actingAs($author)->put(route('admin.informasi.update', $info->id), $payload)->assertRedirect();
    expect($info->fresh()->title)->toBe('Draft diubah');

    $colleague = User::factory()->create(['adminRole' => 'editor']);
    $colleague->userBem()->create(['unitId' => $birdept->unitId, 'position' => 'Staf']);
    $this->actingAs($colleague)->put(route('admin.informasi.update', $info->id), [
        ...$payload, 'title' => 'Diubah rekan birdept',
    ])->assertRedirect();
    expect($info->fresh()->title)->toBe('Diubah rekan birdept');
});
test('viewer responses do not expose another account contact details', function () {
    $viewer = User::factory()->create();
    $viewer->forceFill(['adminRole' => 'viewer'])->save();
    User::factory()->create(['email' => 'private-author@example.test']);

    $this->actingAs($viewer)->get(route('admin.dashboard'))
        ->assertOk()
        ->assertDontSee('private-author@example.test');
    $this->actingAs($viewer)->get(route('admin.informasi.index'))
        ->assertOk()
        ->assertDontSee('private-author@example.test');
});
