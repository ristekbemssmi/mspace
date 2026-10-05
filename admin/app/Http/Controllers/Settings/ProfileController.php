<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\Birdept;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $unitRequestsAvailable = Schema::hasTable('unitrequests');
        $user = $request->user()->load($unitRequestsAvailable
            ? ['userBem.birdept', 'unitChangeRequest.requestedUnit']
            : ['userBem.birdept']);
        $unitRequest = $unitRequestsAvailable ? $user->unitChangeRequest : null;

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'unitRequestsAvailable' => $unitRequestsAvailable,
            'status' => $request->session()->get('status'),
            'profile' => [
                ...$user->only(['name', 'email', 'username', 'studentNumber', 'phone', 'studyProgram', 'email_verified_at']),
                'birdept' => $user->userBem?->birdept?->only(['unitId', 'name', 'abbreviation']),
                'position' => $user->userBem?->position,
                'unitRequest' => $unitRequest ? [
                    'requestedUnitId' => $unitRequest->requestedUnitId,
                    'requestedPosition' => $unitRequest->requestedPosition,
                    'status' => $unitRequest->status,
                    'unitName' => $unitRequest->requestedUnit?->name,
                ] : null,
            ],
            'units' => Birdept::select('unitId', 'name', 'abbreviation')->orderBy('name')->get(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
