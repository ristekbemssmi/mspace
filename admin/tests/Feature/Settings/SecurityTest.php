<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

test('security page is displayed', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('security.edit'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/security')
            ->where('canManageTwoFactor', true)
            ->where('twoFactorEnabled', false),
        );
});

test('security page allows email recovery without current password', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    $user = User::factory()->create();

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $response = $this->actingAs($user)
        ->get(route('security.edit'));

    $response->assertOk();
});

test('security page does not require password confirmation when disabled', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    $user = User::factory()->create();

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => false,
    ]);

    $this->actingAs($user)
        ->get(route('security.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/security'),
        );
});

test('security page renders without two factor when feature is disabled', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    config(['fortify.features' => []]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('security.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/security')
            ->where('canManageTwoFactor', false)
            ->missing('twoFactorEnabled')
            ->missing('requiresConfirmation'),
        );
});

test('reset link is sent only to the signed in account', function () {
    Notification::fake();
    $user = User::factory()->create();
    $other = User::factory()->create();
    $this->actingAs($user)->from(route('security.edit'))
        ->post(route('security.password.email'), ['email' => $other->email])
        ->assertRedirect(route('security.edit'))->assertSessionHasNoErrors()->assertSessionHas('status');
    Notification::assertSentTo($user, ResetPassword::class);
    Notification::assertNotSentTo($other, ResetPassword::class);
});

test('guest cannot request a dashboard password reset', function () {
    $this->post(route('security.password.email'))->assertRedirect(route('login'));
});

test('reset link requests are throttled by the password broker', function () {
    Notification::fake();
    $user = User::factory()->create();
    $this->actingAs($user)->post(route('security.password.email'))->assertSessionHasNoErrors();
    $this->post(route('security.password.email'))->assertSessionHasErrors('email');
    Notification::assertCount(1);
});

test('mail failure is shown as a form error', function () {
    $user = User::factory()->create();
    Password::shouldReceive('broker')->once()->andReturnSelf();
    Password::shouldReceive('sendResetLink')->once()->andThrow(new RuntimeException('Mail transport unavailable'));
    $this->actingAs($user)->post(route('security.password.email'))->assertSessionHasErrors('email');
});
