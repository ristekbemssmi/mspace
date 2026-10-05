<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('ordinary authenticated users see the approval page and cannot visit admin dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('access.pending'));
    $this->get(route('admin.dashboard'))->assertForbidden();
});

test('authorized staff can visit the dashboard', function () {
    $user = User::factory()->create();
    $user->forceFill(['adminRole' => 'viewer'])->save();

    $this->actingAs($user)->get(route('dashboard'))->assertRedirect(route('admin.dashboard'));
    $this->get(route('admin.dashboard'))->assertOk();
});
