<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Birdept;
use App\Models\Informasi;
use App\Models\InformationImage;
use App\Models\InformasiAlumni;
use App\Models\InformasiBeasiswa;
use App\Models\InformasiHimpunan;
use App\Models\InformasiKegiatan;
use App\Models\InformasiLomba;
use App\Models\InformasiMagang;
use App\Models\InformasiProker;
use App\Models\InformasiWisuda;
use App\Models\User;
use App\Services\CsvService;
use App\Services\InformationImageService;
use Illuminate\Support\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
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
        $visits = DB::table('sitevisits')
            ->whereNotNull('informationId')
            ->selectRaw('informationId, COUNT(*) AS publicVisits, COUNT(DISTINCT visitorId) AS uniqueVisitors')
            ->groupBy('informationId');
        $query = Informasi::query()
            ->leftJoinSub($visits, 'visits', 'information.id', '=', 'visits.informationId')
            ->select('information.*')
            ->selectRaw('COALESCE(visits.publicVisits, 0) AS publicVisits, COALESCE(visits.uniqueVisitors, 0) AS uniqueVisitors')
            ->with([
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
            'lomba',
            'images:id,informationId,originalName,sortOrder',
        ]);

        $filters = $request->validate([
            'search' => 'nullable|string|max:255',
            'category' => 'nullable|in:beasiswa,kegiatan,himpunan,wisuda,alumni,magang,proker,lomba',
            'status' => 'nullable|in:draft,published,archived',
            'dateField' => 'nullable|in:publishedAt,expiresAt',
            'dateFrom' => 'nullable|date',
            'dateTo' => 'nullable|date|after_or_equal:dateFrom',
            'visitMetric' => 'nullable|in:publicVisits,uniqueVisitors',
            'visitsMin' => 'nullable|integer|min:0',
            'visitsMax' => 'nullable|integer|min:0|gte:visitsMin',
            'sortBy' => 'nullable|in:publicVisits,uniqueVisitors,publishedAt,expiresAt,createdAt,title,category',
            'sortDirection' => 'nullable|in:asc,desc',
        ]);

        if ($search = trim($filters['search'] ?? '')) {
            $term = '%'.addcslashes($search, '%_\\').'%';
            $query->where(function ($q) use ($term) {
                foreach (['title', 'description', 'source', 'category', 'status'] as $column) {
                    $q->orWhere("information.{$column}", 'like', $term);
                }
                foreach (['birdept', 'units'] as $relation) {
                    $q->orWhereHas($relation, fn ($related) => $related
                        ->where('name', 'like', $term)
                        ->orWhere('abbreviation', 'like', $term));
                }
                $q->orWhereHas('user', fn ($related) => $related
                    ->where('name', 'like', $term)
                    ->orWhere('username', 'like', $term));
                foreach ([
                    'beasiswa' => ['organizer', 'posterUrl', 'instagramUrl', 'registrationUrl'],
                    'kegiatan' => ['location', 'organizer'],
                    'himpunan' => ['name', 'contact'],
                    'wisuda' => ['graduationPeriod', 'registrationSteps'],
                    'alumni' => ['name', 'cohort', 'topic'],
                    'magang' => ['company', 'position', 'duration'],
                    'proker' => ['purpose', 'audience', 'priority'],
                    'lomba' => ['organizer', 'registrationUrl'],
                ] as $relation => $columns) {
                    $q->orWhereHas($relation, function ($related) use ($columns, $term) {
                        foreach ($columns as $index => $column) {
                            $method = $index === 0 ? 'where' : 'orWhere';
                            $related->{$method}($column, 'like', $term);
                        }
                    });
                }
                $q->orWhereHas('beasiswa.syarat', fn ($related) => $related
                    ->where('requirement', 'like', $term)->orWhere('description', 'like', $term));
                $q->orWhereHas('beasiswa.benefit', fn ($related) => $related
                    ->where('benefit', 'like', $term)->orWhere('description', 'like', $term));
            });
        }

        if (!empty($filters['category'])) $query->where('information.category', $filters['category']);
        if (!empty($filters['status'])) $query->where('information.status', $filters['status']);

        $dateField = $filters['dateField'] ?? 'publishedAt';
        if (!empty($filters['dateFrom'])) $query->whereDate("information.{$dateField}", '>=', $filters['dateFrom']);
        if (!empty($filters['dateTo'])) $query->whereDate("information.{$dateField}", '<=', $filters['dateTo']);

        $visitMetric = $filters['visitMetric'] ?? 'publicVisits';
        if (isset($filters['visitsMin']) && $filters['visitsMin'] !== '') {
            $query->whereRaw("COALESCE(visits.{$visitMetric}, 0) >= ?", [(int) $filters['visitsMin']]);
        }
        if (isset($filters['visitsMax']) && $filters['visitsMax'] !== '') {
            $query->whereRaw("COALESCE(visits.{$visitMetric}, 0) <= ?", [(int) $filters['visitsMax']]);
        }

        $sortBy = $filters['sortBy'] ?? 'publicVisits';
        $sortDirection = $filters['sortDirection'] ?? 'desc';
        $sortColumn = in_array($sortBy, ['publicVisits', 'uniqueVisitors'], true)
            ? "COALESCE(visits.{$sortBy}, 0)"
            : "information.{$sortBy}";
        $query->orderByRaw("{$sortColumn} {$sortDirection}")->orderByDesc('information.id');
        $information = $query
            ->paginate(10)->withQueryString();

        $units = Birdept::select('unitId', 'name', 'abbreviation')->orderBy('name')->get();
        $users = $request->user()->hasAdminRole('admin')
            ? User::select('id', 'name', 'username')->orderBy('name')->get()
            : User::select('id', 'name', 'username')->whereKey($request->user()->id)->get();

        return Inertia::render('admin/informasi/index', [
            'information' => $information,
            'units' => $units,
            'users' => $users,
            'filters' => $filters,
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
            'category' => 'required|in:beasiswa,kegiatan,himpunan,wisuda,alumni,magang,proker,lomba',
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
            'proker.priority' => 'nullable|integer|min:1',
            'lomba' => 'nullable|array',
            'lomba.organizer' => 'nullable|string|max:255',
            'lomba.registrationUrl' => 'nullable|url|max:2048',
            'lomba.opensOn' => 'nullable|date',
            'lomba.closesOn' => 'nullable|date|after_or_equal:lomba.opensOn',
            'images' => 'nullable|array|max:5',
            'images.*' => 'required|file|mimes:jpg,jpeg,png,webp|max:5120|dimensions:max_width=3000,max_height=3000',
        ], [
            'images.*.uploaded' => 'Gambar gagal diunggah karena melebihi batas server. Pilih kembali melalui Tambahkan gambar agar dikompresi otomatis.',
        ]);

        if ($validated['status'] !== 'draft') {
            Gate::authorize('publish', Informasi::class);
        }

        $timing = $this->publicationTiming($validated);
        $storedPaths = [];
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
            foreach ($request->file('images', []) as $file) {
                $storedPaths[] = app(InformationImageService::class)->add($info, $file);
            }

            DB::commit();
            return redirect()->back()->with('success', 'Informasi berhasil dibuat.');
        } catch (\Throwable $e) {
            DB::rollBack();
            Storage::disk('informationMedia')->delete($storedPaths);
            if ($e instanceof ValidationException) {
                throw $e;
            }
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
            'category' => 'required|in:beasiswa,kegiatan,himpunan,wisuda,alumni,magang,proker,lomba',
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
            'proker.priority' => 'nullable|integer|min:1',
            'lomba' => 'nullable|array',
            'lomba.organizer' => 'nullable|string|max:255',
            'lomba.registrationUrl' => 'nullable|url|max:2048',
            'lomba.opensOn' => 'nullable|date',
            'lomba.closesOn' => 'nullable|date|after_or_equal:lomba.opensOn',
            'images' => 'nullable|array|max:5',
            'images.*' => 'required|file|mimes:jpg,jpeg,png,webp|max:5120|dimensions:max_width=3000,max_height=3000',
            'removeImageIds' => 'nullable|array',
            'removeImageIds.*' => 'integer|distinct',
        ], [
            'images.*.uploaded' => 'Gambar gagal diunggah karena melebihi batas server. Pilih kembali melalui Tambahkan gambar agar dikompresi otomatis.',
        ]);

        if ($info->status !== 'draft' || $validated['status'] !== 'draft') {
            Gate::authorize('publish', Informasi::class);
        }

        $timing = $this->publicationTiming($validated);
        $removedImages = $info->images()->whereIn('id', $validated['removeImageIds'] ?? [])->get();
        $remainingCount = $info->images()->count() - $removedImages->count() + count($request->file('images', []));
        if ($remainingCount > 5) {
            throw ValidationException::withMessages(['images' => 'Maksimal 5 gambar dokumentasi per informasi.']);
        }

        $storedPaths = [];
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
            $info->images()->whereIn('id', $removedImages->pluck('id'))->delete();
            foreach ($request->file('images', []) as $file) {
                $storedPaths[] = app(InformationImageService::class)->add($info, $file);
            }

            DB::commit();
            Storage::disk('informationMedia')->delete($removedImages->pluck('storagePath')->all());
            return redirect()->back()->with('success', 'Informasi berhasil diperbarui.');
        } catch (\Throwable $e) {
            DB::rollBack();
            Storage::disk('informationMedia')->delete($storedPaths);
            if ($e instanceof ValidationException) {
                throw $e;
            }
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

    public function image(int $id): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $image = InformationImage::with('information')->findOrFail($id);
        Gate::authorize('viewAny', Informasi::class);
        abort_if($image->information === null, 404);
        abort_unless(Storage::disk('informationMedia')->exists($image->storagePath), 404);

        return response()->file(Storage::disk('informationMedia')->path($image->storagePath), [
            'Content-Type' => 'image/webp',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'no-store',
        ]);
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
                            'priority' => $p['priority'] ?? null,
                        ]
                    );
                }
                break;

            case 'lomba':
                $competition = $data['lomba'] ?? [];
                InformasiLomba::updateOrCreate(
                    ['id' => $info->id],
                    [
                        'organizer' => $competition['organizer'] ?? null,
                        'registrationUrl' => $competition['registrationUrl'] ?? null,
                        'opensOn' => $competition['opensOn'] ?? null,
                        'closesOn' => $competition['closesOn'] ?? null,
                    ]
                );
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
