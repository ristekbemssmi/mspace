<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Birdept;
use App\Models\UnitChangeRequest;
use App\Models\User;
use App\Models\UserBem;
use App\Services\CsvService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UserController extends Controller
{
    protected CsvService $csvService;

    public function __construct(CsvService $csvService)
    {
        $this->csvService = $csvService;
    }

    public function index(Request $request): Response
    {
        $query = User::with(['userBem.birdept']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('studentNumber', 'like', "%{$search}%");
            });
        }

        if ($studyProgram = $request->input('studyProgram')) {
            $query->where('studyProgram', $studyProgram);
        }

        if ($request->has('is_bem') && $request->input('is_bem') !== null) {
            $isBem = filter_var($request->input('is_bem'), FILTER_VALIDATE_BOOLEAN);
            if ($isBem) {
                $query->has('userBem');
            } else {
                $query->doesntHave('userBem');
            }
        }

        $users = $query->latest()->paginate(15)->withQueryString();
        $units = Birdept::select('unitId', 'name', 'abbreviation')->orderBy('name')->get();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'units' => $units,
            'filters' => $request->only(['search', 'studyProgram', 'is_bem']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'username' => 'required|string|unique:users,username',
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'studentNumber' => 'nullable|string|unique:users,studentNumber',
            'password' => 'prohibited',
            'adminRole' => 'required|in:viewer,editor,admin',
            'phone' => 'nullable|string',
            'studyProgram' => 'nullable|string',
            'is_bem' => 'boolean',
            'unitId' => 'nullable|required_if:is_bem,true|exists:units,unitId',
            'position' => 'nullable|required_if:is_bem,true|string',
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'studentNumber' => $validated['studentNumber'] ?? null,
            'password' => Hash::make(Str::random(64)),
            'phone' => $validated['phone'] ?? null,
            'studyProgram' => $validated['studyProgram'] ?? null,
        ]);
        $user->forceFill(['adminRole' => $validated['adminRole']])->save();

        if (! empty($validated['is_bem']) && ! empty($validated['unitId'])) {
            UserBem::create([
                'id' => $user->id,
                'unitId' => $validated['unitId'],
                'position' => $validated['position'],
            ]);
        }

        try {
            $status = Password::sendResetLink(['email' => $user->email]);
            if ($status === Password::RESET_LINK_SENT) {
                $user->sendEmailVerificationNotification();
            }
        } catch (\Throwable $exception) {
            report($exception);

            return back()->withErrors(['email' => 'Akun dibuat, tetapi email pengaturan password gagal dikirim. Pengguna dapat meminta tautan dari halaman lupa password.']);
        }

        return $status === Password::RESET_LINK_SENT
            ? back()->with('success', 'Akun dibuat. Tautan pengaturan password dan verifikasi email dikirim ke pengguna.')
            : back()->withErrors(['email' => 'Akun dibuat, tetapi tautan pengaturan password belum terkirim. Pengguna dapat meminta tautan dari halaman lupa password.']);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $user = User::findOrFail($id);
        $oldUnitId = $user->userBem?->unitId;
        $oldPosition = $user->userBem?->position;

        $validated = $request->validate([
            'username' => 'required|string|unique:users,username,'.$id,
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,'.$id,
            'studentNumber' => 'nullable|string|unique:users,studentNumber,'.$id,
            'password' => 'prohibited',
            'adminRole' => 'required|in:viewer,editor,admin',
            'phone' => 'nullable|string',
            'studyProgram' => 'nullable|string',
            'is_bem' => 'boolean',
            'unitId' => 'nullable|required_if:is_bem,true|exists:units,unitId',
            'position' => 'nullable|required_if:is_bem,true|string',
        ]);

        abort_if($validated['email'] !== $user->email, 403);
        $userPayload = [
            'username' => $validated['username'],
            'name' => $validated['name'],
            'email' => $user->email,
            'studentNumber' => $validated['studentNumber'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'studyProgram' => $validated['studyProgram'] ?? null,
        ];

        abort_if($user->adminRole === 'admin' && $validated['adminRole'] !== 'admin'
            && User::where('adminRole', 'admin')->count() <= 1, 403);

        $user->update($userPayload);
        $user->forceFill(['adminRole' => $validated['adminRole']])->save();

        if (! empty($validated['is_bem']) && ! empty($validated['unitId'])) {
            UserBem::updateOrCreate(
                ['id' => $user->id],
                [
                    'unitId' => $validated['unitId'],
                    'position' => $validated['position'],
                ]
            );
        } else {
            UserBem::where('id', $user->id)->delete();
        }

        if ($oldUnitId !== $user->fresh()->userBem?->unitId
            || $oldPosition !== $user->fresh()->userBem?->position) {
            UnitChangeRequest::where('userId', $user->id)->where('status', 'pending')->update([
                'status' => 'rejected', 'reviewedBy' => $request->user()->id,
            ]);
        }

        return redirect()->back()->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        abort_if($request->user()->id === $user->id, 403);
        abort_if($user->adminRole === 'admin' && User::where('adminRole', 'admin')->count() <= 1, 403);

        $user->delete();

        return redirect()->back()->with('success', 'User berhasil dihapus.');
    }

    public function importCsv(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv,txt|max:10240',
            'target_table' => 'nullable|string|in:users,organizationMembers',
        ]);

        $table = $request->input('target_table', 'users');
        $result = $this->csvService->importCsv($table, $request->file('file'));

        if (! $result['success']) {
            return redirect()->back()->withErrors(['csv' => $result['message']]);
        }

        return redirect()->back()->with('success', $result['message']);
    }

    public function downloadTemplate(Request $request): StreamedResponse
    {
        $table = $request->input('table', 'users');
        $csvContent = $this->csvService->generateTemplate($table);

        return response()->streamDownload(function () use ($csvContent) {
            echo $csvContent;
        }, "template_{$table}.csv", [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function exportCsv(Request $request): StreamedResponse
    {
        $table = $request->input('table', 'users');
        $csvContent = $this->csvService->exportCsv($table);

        return response()->streamDownload(function () use ($csvContent) {
            echo $csvContent;
        }, "export_{$table}_".date('Y-m-d_H-i-s').'.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
