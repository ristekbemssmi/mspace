<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Birdept;
use App\Services\CsvService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class BirdeptController extends Controller
{
    protected CsvService $csvService;

    public function __construct(CsvService $csvService)
    {
        $this->csvService = $csvService;
    }

    public function index(Request $request): Response
    {
        $visits = DB::table('sitevisits')
            ->whereNotNull('unitId')
            ->selectRaw('unitId, COUNT(*) AS publicVisits, COUNT(DISTINCT visitorId) AS uniqueVisitors')
            ->groupBy('unitId');
        $query = Birdept::query()
            ->leftJoinSub($visits, 'visits', 'units.unitId', '=', 'visits.unitId')
            ->select('units.*')
            ->selectRaw('COALESCE(visits.publicVisits, 0) AS publicVisits, COALESCE(visits.uniqueVisitors, 0) AS uniqueVisitors');

        if ($search = $request->input('search')) {
            $query->where(function ($query) use ($search) {
                $query->where('units.name', 'like', "%{$search}%")
                    ->orWhere('units.abbreviation', 'like', "%{$search}%")
                    ->orWhere('units.type', 'like', "%{$search}%");
            });
        }

        if ($type = $request->input('type')) {
            $query->where('units.type', $type);
        }

        $units = $query->orderByDesc('publicVisits')->orderBy('units.name')->get();

        return Inertia::render('admin/birdept/index', [
            'units' => $units,
            'filters' => $request->only(['search', 'type']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'abbreviation' => 'required|string',
            'type' => 'required|in:bph,biro,departemen',
            'description' => 'nullable|string',
            'instagram' => 'nullable|string',
        ]);

        Birdept::create($validated);

        return redirect()->back()->with('success', 'Birdept berhasil ditambahkan.');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $birdept = Birdept::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string',
            'abbreviation' => 'required|string',
            'type' => 'required|in:bph,biro,departemen',
            'description' => 'nullable|string',
            'instagram' => 'nullable|string',
        ]);

        $birdept->update($validated);

        return redirect()->back()->with('success', 'Birdept berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $birdept = Birdept::findOrFail($id);
        $birdept->delete();

        return redirect()->back()->with('success', 'Birdept berhasil dihapus.');
    }

    public function importCsv(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv,txt|max:10240',
        ]);

        $result = $this->csvService->importCsv('units', $request->file('file'));

        if (!$result['success']) {
            return redirect()->back()->withErrors(['csv' => $result['message']]);
        }

        return redirect()->back()->with('success', $result['message']);
    }

    public function downloadTemplate(): StreamedResponse
    {
        $csvContent = $this->csvService->generateTemplate('units');

        return response()->streamDownload(function () use ($csvContent) {
            echo $csvContent;
        }, 'template_birdept.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function exportCsv(): StreamedResponse
    {
        $csvContent = $this->csvService->exportCsv('units');

        return response()->streamDownload(function () use ($csvContent) {
            echo $csvContent;
        }, 'export_birdept_' . date('Y-m-d_H-i-s') . '.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
