<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UnitChangeRequest;
use App\Models\UserBem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class UnitChangeApprovalController extends Controller
{
    public function update(Request $request, int $unitRequest): RedirectResponse
    {
        if (! Schema::hasTable('unitrequests')) {
            return back()->withErrors(['birdept' => 'Persetujuan birdept belum tersedia. Jalankan migrasi dashboard admin.']);
        }

        $decision = $request->validate(['decision' => 'required|in:approve,reject'])['decision'];

        DB::transaction(function () use ($unitRequest, $decision, $request): void {
            $record = UnitChangeRequest::query()->lockForUpdate()->findOrFail($unitRequest);
            abort_unless($record->status === 'pending', 409);

            if ($decision === 'approve') {
                UserBem::updateOrCreate(['id' => $record->userId], [
                    'unitId' => $record->requestedUnitId,
                    'position' => $record->requestedPosition,
                ]);
            }

            $record->update([
                'status' => $decision === 'approve' ? 'approved' : 'rejected',
                'reviewedBy' => $request->user()->id,
            ]);
            Log::info('Permintaan birdept ditinjau', [
                'actor_id' => $request->user()->id,
                'subject_id' => $record->userId,
                'unit_id' => $record->requestedUnitId,
                'decision' => $decision,
            ]);
        });

        return back()->with('success', 'Permintaan birdept berhasil ditinjau.');
    }
}
