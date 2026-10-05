<?php

use App\Models\Birdept;
use App\Models\Informasi;
use App\Models\UnitChangeRequest;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;

test('admin can change an existing role but cannot remove the last admin', function () {
    $admin = User::factory()->create(['adminRole' => 'admin']);
    $target = User::factory()->create(['adminRole' => 'viewer']);

    $payload = [
        'username' => $target->username, 'name' => $target->name,
        'email' => $target->email, 'studentNumber' => $target->studentNumber,
        'adminRole' => 'editor', 'is_bem' => false,
    ];

    $this->actingAs($admin)->put(route('admin.users.update', $target->id), $payload)->assertRedirect();
    expect($target->fresh()->adminRole)->toBe('editor');

    $this->put(route('admin.users.update', $admin->id), [
        ...$payload, 'username' => $admin->username, 'name' => $admin->name,
        'email' => $admin->email, 'studentNumber' => $admin->studentNumber,
    ])->assertForbidden();
    expect($admin->fresh()->adminRole)->toBe('admin');
});

test('admin cannot change another users password or redirect their recovery email', function () {
    $admin = User::factory()->create(['adminRole' => 'admin']);
    $target = User::factory()->create(['adminRole' => 'viewer']);
    $oldHash = $target->password;
    $payload = [
        'username' => $target->username, 'name' => $target->name,
        'email' => $target->email, 'studentNumber' => $target->studentNumber,
        'adminRole' => 'viewer', 'is_bem' => false,
    ];

    $this->actingAs($admin)->put(route('admin.users.update', $target->id), [
        ...$payload, 'password' => 'another-secret-password',
    ])->assertSessionHasErrors('password');
    $this->put(route('admin.users.update', $target->id), [
        ...$payload, 'email' => 'attacker@example.com',
    ])->assertForbidden();
    expect($target->fresh()->password)->toBe($oldHash);
    expect($target->fresh()->email)->toBe($target->email);
});

test('admin creates an account with private random password and emails setup links', function () {
    Notification::fake();
    $admin = User::factory()->create(['adminRole' => 'admin']);

    $this->actingAs($admin)->post(route('admin.users.store'), [
        'username' => 'newmember', 'name' => 'Anggota Baru',
        'email' => 'newmember@example.com', 'adminRole' => 'viewer', 'is_bem' => false,
    ])->assertRedirect()->assertSessionHasNoErrors();

    $created = User::where('email', 'newmember@example.com')->sole();
    expect($created->adminRole)->toBe('viewer');
    expect(Hash::check('password', $created->password))->toBeFalse();
    Notification::assertSentTo($created, ResetPassword::class);
    Notification::assertSentTo($created, VerifyEmail::class);
});

test('profile data is edited by its owner while birdept waits for admin approval', function () {
    $unit = Birdept::create(['name' => 'Media Branding', 'abbreviation' => 'Medbrand', 'type' => 'biro']);
    $otherUnit = Birdept::create(['name' => 'Riset dan Teknologi', 'abbreviation' => 'Rizztek', 'type' => 'biro']);
    $editor = User::factory()->create(['adminRole' => 'editor']);
    $editor->userBem()->create(['unitId' => $unit->unitId, 'position' => 'Staf']);
    $admin = User::factory()->create(['adminRole' => 'admin']);

    $this->actingAs($editor)->patch(route('profile.update'), [
        'name' => 'Nama Baru', 'email' => $editor->email,
        'username' => $editor->username, 'studentNumber' => 'G12345678',
        'phone' => '08123456789', 'studyProgram' => 'Matematika',
        'unitId' => $otherUnit->unitId, 'adminRole' => 'admin',
    ])->assertRedirect(route('profile.edit'));
    expect($editor->fresh()->name)->toBe('Nama Baru');
    expect($editor->fresh()->adminRole)->toBe('editor');
    expect($editor->fresh()->userBem->unitId)->toBe($unit->unitId);

    $this->post(route('profile.birdept-request'), [
        'requestedUnitId' => $otherUnit->unitId, 'requestedPosition' => 'Koordinator',
    ])->assertRedirect();
    $change = UnitChangeRequest::where('userId', $editor->id)->sole();
    expect($change->status)->toBe('pending');
    expect($editor->fresh()->userBem->unitId)->toBe($unit->unitId);

    $this->actingAs($admin)->get(route('admin.approvals'))->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('unitRequests.0.user.name', $editor->name)
            ->where('unitRequests.0.requested_unit.abbreviation', $otherUnit->abbreviation));

    $this->actingAs($admin)->post(route('admin.approvals.birdept', $change->id), [
        'decision' => 'approve',
    ])->assertRedirect();
    expect($editor->fresh()->userBem->unitId)->toBe($otherUnit->unitId);
    expect($editor->fresh()->userBem->position)->toBe('Koordinator');
    expect(Gate::forUser($editor->fresh())->allows('createForUnit', [Informasi::class, $otherUnit->unitId, 'proker']))->toBeTrue();
    expect(Gate::forUser($editor->fresh())->allows('createForUnit', [Informasi::class, $unit->unitId, 'proker']))->toBeFalse();
    $this->post(route('admin.approvals.birdept', $change->id), ['decision' => 'approve'])->assertStatus(409);

    $this->actingAs($editor)->post(route('profile.birdept-request'), [
        'requestedUnitId' => $unit->unitId, 'requestedPosition' => 'Staf',
    ])->assertRedirect();
    $this->actingAs($admin)->post(route('admin.approvals.birdept', $change->id), [
        'decision' => 'reject',
    ])->assertRedirect();
    expect($editor->fresh()->userBem->unitId)->toBe($otherUnit->unitId);
});

test('viewer cannot approve birdept changes', function () {
    $viewer = User::factory()->create(['adminRole' => 'viewer']);
    $user = User::factory()->create(['adminRole' => 'editor']);
    $unit = Birdept::create(['name' => 'Media Branding', 'abbreviation' => 'Medbrand', 'type' => 'biro']);
    $change = UnitChangeRequest::create([
        'userId' => $user->id, 'requestedUnitId' => $unit->unitId,
        'requestedPosition' => 'Staf', 'status' => 'pending',
    ]);

    $this->actingAs($viewer)->post(route('admin.approvals.birdept', $change->id), [
        'decision' => 'approve',
    ])->assertForbidden();
    expect($user->fresh()->userBem)->toBeNull();
});
