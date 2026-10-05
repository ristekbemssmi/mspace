<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Birdept;
use App\Models\Informasi;
use App\Models\InformasiAlumni;
use App\Models\InformasiBeasiswa;
use App\Models\InformasiHimpunan;
use App\Models\InformasiKegiatan;
use App\Models\InformasiMagang;
use App\Models\InformasiProker;
use App\Models\InformasiWisuda;
use App\Models\User;
use App\Services\CsvService;
use Illuminate\Support\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class InformasiController extends Controller
{
    protected CsvService $csvService;

    public function __construct(CsvService $csvService)
    {
        $this->csvService = $csvService;
    }

    public function index(Request $request): Response
    {
        $query = Informasi::with([
            'birdept',
            'units:unitId,name,abbreviation',
            'user:id,name,username',
            'beasiswa.syarat',
            'beasiswa.benefit',
            'kegiatan',
            'himpunan',
            'wisuda',
            'alumni',
            'magang',
            'proker',
        ]);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('source', 'like', "%{$search}%");
            });
        }

        if ($type = $request->input('category')) {
            $query->where('category', $type);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $information = $query->latest()->paginate(10)->withQueryString();

        $units = Birdept::select('unitId', 'name', 'abbreviation')->orderBy('name')->get();
        $users = $request->user()->hasAdminRole('admin')
            ? User::select('id', 'name', 'username')->orderBy('name')->get()
            : User::select('id', 'name', 'username')->whereKey($request->user()->id)->get();

        return Inertia::render('admin/informasi/index', [
            'information' => $information,
            'units' => $units,
            'users' => $users,
            'filters' => $request->only(['search', 'category', 'status']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'unitId' => 'required|exists:units,unitId',
            'unitIds' => 'nullable|array',
            'unitIds.*' => 'integer|distinct|exists:units,unitId',
            'title' => 'required|string',
            'description' => 'required|string',
            'category' => 'required|in:beasiswa,kegiatan,himpunan,wisuda,alumni,magang,proker',
            'source' => 'nullable|string',
            'status' => 'required|in:draft,published,archived',
            'publishedAt' => 'nullable|date',
            'expiresAt' => 'nullable|date',

            // Sub-type fields
            'beasiswa' => 'nullable|array',
            'kegiatan' => 'nullable|array',
            'himpunan' => 'nullable|array',
            'wisuda' => 'nullable|array',
            'alumni' => 'nullable|array',
            'magang' => 'nullable|array',
            'proker' => 'nullable|array',
        ]);

        if ($validated['status'] !== 'draft') {
            Gate::authorize('publish', Informasi::class);
        }

        $timing = $this->publicationTiming($validated);
        DB::beginTransaction();
        try {
            $info = Informasi::create([
                'unitId' => $validated['unitId'],
                'userId' => $request->user()->id,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'category' => $validated['category'],
                'source' => $validated['source'] ?? null,
                'status' => $validated['status'],
                ...$timing,
            ]);

            $this->saveSubTypeDetail($info, $validated);
            $this->syncProkerBirdepts($info, $validated);

            DB::commit();
            return redirect()->back()->with('success', 'Informasi berhasil dibuat.');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Gagal menyimpan informasi', ['exception' => $e]);
            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan informasi.']);
        }
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $info = Informasi::findOrFail($id);
        Gate::authorize('update', $info);

        $validated = $request->validate([
            'unitId' => 'required|exists:units,unitId',
            'unitIds' => 'nullable|array',
            'unitIds.*' => 'integer|distinct|exists:units,unitId',
            'title' => 'required|string',
            'description' => 'required|string',
            'category' => 'required|in:beasiswa,kegiatan,himpunan,wisuda,alumni,magang,proker',
            'source' => 'nullable|string',
            'status' => 'required|in:draft,published,archived',
            'publishedAt' => 'nullable|date',
            'expiresAt' => 'nullable|date',

            // Sub-type fields
            'beasiswa' => 'nullable|array',
            'kegiatan' => 'nullable|array',
            'himpunan' => 'nullable|array',
            'wisuda' => 'nullable|array',
            'alumni' => 'nullable|array',
            'magang' => 'nullable|array',
            'proker' => 'nullable|array',
        ]);

        if ($info->status !== 'draft' || $validated['status'] !== 'draft') {
            Gate::authorize('publish', Informasi::class);
        }

        $timing = $this->publicationTiming($validated);
        DB::beginTransaction();
        try {
            $info->update([
                'unitId' => $validated['unitId'],
                'title' => $validated['title'],
                'description' => $validated['description'],
                'category' => $validated['category'],
                'source' => $validated['source'] ?? null,
                'status' => $validated['status'],
                ...$timing,
            ]);

            $this->saveSubTypeDetail($info, $validated);
            $this->syncProkerBirdepts($info, $validated);

            DB::commit();
            return redirect()->back()->with('success', 'Informasi berhasil diperbarui.');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Gagal memperbarui informasi', ['exception' => $e]);
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui informasi.']);
        }
    }

    public function destroy(int $id): RedirectResponse
    {
        $info = Informasi::findOrFail($id);
        Gate::authorize('delete', $info);
        $info->delete();

        return redirect()->back()->with('success', 'Informasi berhasil dihapus.');
    }

    private function publicationTiming(array $data): array
    {
        $publishedAt = !empty($data['publishedAt'])
            ? Carbon::parse($data['publishedAt'], config('app.timezone'))
            : ($data['status'] === 'published' ? now() : null);
        $expiresAt = !empty($data['expiresAt'])
            ? Carbon::parse($data['expiresAt'], config('app.timezone'))->endOfDay()
            : null;

        if ($publishedAt && $expiresAt && $expiresAt->lessThan($publishedAt)) {
            throw ValidationException::withMessages([
                'expiresAt' => 'Tanggal kedaluwarsa harus setelah waktu publikasi.',
            ]);
        }

        return ['publishedAt' => $publishedAt, 'expiresAt' => $expiresAt];
    }

    protected function saveSubTypeDetail(Informasi $info, array $data): void
    {
        switch ($info->category) {
            case 'beasiswa':
                if (!empty($data['beasiswa'])) {
                    $b = $data['beasiswa'];
                    InformasiBeasiswa::updateOrCreate(
                        ['id' => $info->id],
                        [
                            'organizer' => $b['organizer'] ?? null,
                            'opensOn' => $b['opensOn'] ?? null,
                            'closesOn' => $b['closesOn'] ?? null,
                            'posterUrl' => $b['posterUrl'] ?? '',
                            'instagramUrl' => $b['instagramUrl'] ?? '',
                            'registrationUrl' => $b['registrationUrl'] ?? null,
                        ]
                    );
                }
                break;

            case 'kegiatan':
                if (!empty($data['kegiatan'])) {
                    $k = $data['kegiatan'];
                    InformasiKegiatan::updateOrCreate(
                        ['id' => $info->id],
                        [
                            'eventAt' => $k['eventAt'] ?? now(),
                            'location' => $k['location'] ?? '',
                            'organizer' => $k['organizer'] ?? '',
                        ]
                    );
                }
                break;

            case 'himpunan':
                if (!empty($data['himpunan'])) {
                    $h = $data['himpunan'];
                    InformasiHimpunan::updateOrCreate(
                        ['id' => $info->id],
                        [
                            'name' => $h['name'] ?? '',
                            'contact' => $h['contact'] ?? '',
                        ]
                    );
                }
                break;

            case 'wisuda':
                if (!empty($data['wisuda'])) {
                    $w = $data['wisuda'];
                    InformasiWisuda::updateOrCreate(
                        ['id' => $info->id],
                        [
                            'graduationPeriod' => $w['graduationPeriod'] ?? '',
                            'registrationSteps' => $w['registrationSteps'] ?? '',
                        ]
                    );
                }
                break;

            case 'alumni':
                if (!empty($data['alumni'])) {
                    $a = $data['alumni'];
                    InformasiAlumni::updateOrCreate(
                        ['id' => $info->id],
                        [
                            'name' => $a['name'] ?? '',
                            'cohort' => $a['cohort'] ?? '',
                            'topic' => $a['topic'] ?? '',
                        ]
                    );
                }
                break;

            case 'magang':
                if (!empty($data['magang'])) {
                    $m = $data['magang'];
                    InformasiMagang::updateOrCreate(
                        ['id' => $info->id],
                        [
                            'company' => $m['company'] ?? '',
                            'position' => $m['position'] ?? '',
                            'duration' => $m['duration'] ?? '',
                        ]
                    );
                }
                break;

            case 'proker':
                if (!empty($data['proker'])) {
                    $p = $data['proker'];
                    InformasiProker::updateOrCreate(
                        ['id' => $info->id],
                        [
                            'purpose' => $p['purpose'] ?? null,
                            'audience' => $p['audience'] ?? null,
                            'startsOn' => $p['startsOn'] ?? null,
                            'endsOn' => $p['endsOn'] ?? null,
                        ]
                    );
                }
                break;
        }
    }

    private function syncProkerBirdepts(Informasi $info, array $data): void
    {
        if ($info->category !== 'proker') {
            $info->units()->detach();

            return;
        }

        $ids = array_values(array_unique(array_filter(
            array_map('intval', $data['unitIds'] ?? []),
            fn (int $id) => $id !== (int) $data['unitId']
        )));
        $info->units()->sync($ids);
    }

    public function importCsv(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv,txt|max:10240',
            'target_table' => 'nullable|string',
        ]);

        $table = $request->input('target_table', 'information');
        $result = $this->csvService->importCsv($table, $request->file('file'));

        if (!$result['success']) {
            return redirect()->back()->withErrors(['csv' => $result['message']]);
        }

        return redirect()->back()->with('success', $result['message']);
    }

    public function downloadTemplate(Request $request): StreamedResponse
    {
        $table = $request->input('table', 'information');
        $csvContent = $this->csvService->generateTemplate($table);

        return response()->streamDownload(function () use ($csvContent) {
            echo $csvContent;
        }, "template_{$table}.csv", [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function exportCsv(Request $request): StreamedResponse
    {
        $table = $request->input('table', 'information');
        $csvContent = $this->csvService->exportCsv($table);

        return response()->streamDownload(function () use ($csvContent) {
            echo $csvContent;
        }, "export_{$table}_" . date('Y-m-d_H-i-s') . '.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
