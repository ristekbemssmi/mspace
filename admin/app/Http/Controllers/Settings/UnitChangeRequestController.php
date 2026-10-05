<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\UnitChangeRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class UnitChangeRequestController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        if (! Schema::hasTable('unitrequests')) {
            return back()->withErrors(['requestedUnitId' => 'Pengajuan birdept sementara belum tersedia. Hubungi Admin.']);
        }

        $data = $request->validate([
            'requestedUnitId' => 'required|integer|exists:units,unitId',
            'requestedPosition' => 'required|string|max:255',
        ]);

        $user = $request->user();
        $user->load('userBem');
        if ((int) $user->userBem?->unitId === (int) $data['requestedUnitId']
            && $user->userBem?->position === $data['requestedPosition']) {
            return back()->with('status', 'Data birdept dan jabatan sudah sesuai.');
        }

        UnitChangeRequest::updateOrCreate(['userId' => $user->id], [
            'requestedUnitId' => $data['requestedUnitId'],
            'requestedPosition' => $data['requestedPosition'],
            'status' => 'pending',
            'reviewedBy' => null,
        ]);

        return back()->with('status', 'Permintaan perubahan birdept dikirim untuk persetujuan Admin.');
    }
}
