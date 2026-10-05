<?php

use App\Models\User;

test('new accounts cannot approve themselves or enter admin modules', function () {
    $account = User::factory()->create();

    $this->actingAs($account)->get('/admin/approvals')->assertForbidden();
    $this->post("/admin/approvals/{$account->id}", ['role' => 'admin'])->assertForbidden();
    $this->get('/admin/informasi')->assertForbidden();
    expect($account->fresh()->adminRole)->toBeNull();
});

test('only an admin can approve a pending account', function () {
    $pending = User::factory()->create();
    $editor = User::factory()->create();
    $editor->forceFill(['adminRole' => 'editor'])->save();

    $this->actingAs($editor)->post("/admin/approvals/{$pending->id}", ['role' => 'viewer'])->assertForbidden();
    expect($pending->fresh()->adminRole)->toBeNull();

    $admin = User::factory()->create();
    $admin->forceFill(['adminRole' => 'admin'])->save();
    $this->actingAs($admin)->post("/admin/approvals/{$pending->id}", ['role' => 'viewer'])->assertRedirect();
    expect($pending->fresh()->adminRole)->toBe('viewer');
});

test('approval rejects invalid roles', function () {
    $pending = User::factory()->create();
    $admin = User::factory()->create();
    $admin->forceFill(['adminRole' => 'admin'])->save();

    $this->actingAs($admin)->post("/admin/approvals/{$pending->id}", ['role' => 'superadmin'])->assertSessionHasErrors('role');
    expect($pending->fresh()->adminRole)->toBeNull();
});
