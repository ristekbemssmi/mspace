<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\TwoFactorAuthenticationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class SecurityController extends Controller
{
    /**
     * Show the user's security settings page.
     */
    public function edit(TwoFactorAuthenticationRequest $request): Response
    {
        $props = [
            'status' => $request->session()->get('status'),
            'email' => $request->user()->email,
            'canManageTwoFactor' => Features::canManageTwoFactorAuthentication(),
        ];

        if (Features::canManageTwoFactorAuthentication()) {
            $request->ensureStateIsValid();

            $props['twoFactorEnabled'] = $request->user()->hasEnabledTwoFactorAuthentication();
            $props['requiresConfirmation'] = Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm');
        }

        return Inertia::render('settings/security', $props);
    }

    /**
     * Send a reset link to the authenticated account only.
     */
    public function sendResetLink(Request $request): RedirectResponse
    {
        try {
            $status = Password::broker(config('fortify.passwords'))->sendResetLink([
                'email' => $request->user()->email,
            ]);
        } catch (\Throwable $exception) {
            report($exception);

            return back()->withErrors(['email' => 'Email belum dapat dikirim. Hubungi administrator untuk memeriksa konfigurasi email.']);
        }

        return $status === Password::RESET_LINK_SENT
            ? back()->with('status', 'Tautan ganti password telah dikirim ke email terdaftar. Periksa kotak masuk atau spam.')
            : back()->withErrors(['email' => __($status)]);
    }
}
