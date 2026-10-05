<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Services\CsvService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    protected CsvService $csvService;

    public function __construct(CsvService $csvService)
    {
        $this->csvService = $csvService;
    }

    public function index(Request $request): Response
    {
        $query = Faq::query();

        if ($search = $request->input('search')) {
            $query->where('question', 'like', "%{$search}%")
                ->orWhere('answer', 'like', "%{$search}%");
        }

        if ($request->has('isActive') && $request->input('isActive') !== null) {
            $isActive = filter_var($request->input('isActive'), FILTER_VALIDATE_BOOLEAN);
            $query->where('isActive', $isActive);
        }

        $faqs = $query->orderBy('sortOrder')->orderBy('id', 'desc')->get();

        return Inertia::render('admin/faqs/index', [
            'faqs' => $faqs,
            'filters' => $request->only(['search', 'isActive']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'sortOrder' => 'required|integer',
            'isActive' => 'boolean',
        ]);

        Faq::create([
            'question' => $validated['question'],
            'answer' => $validated['answer'],
            'sortOrder' => $validated['sortOrder'],
            'isActive' => $validated['isActive'] ?? true,
        ]);

        return redirect()->back()->with('success', 'FAQ berhasil ditambahkan.');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $faq = Faq::findOrFail($id);

        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'sortOrder' => 'required|integer',
            'isActive' => 'boolean',
        ]);

        $faq->update([
            'question' => $validated['question'],
            'answer' => $validated['answer'],
            'sortOrder' => $validated['sortOrder'],
            'isActive' => $validated['isActive'] ?? true,
        ]);

        return redirect()->back()->with('success', 'FAQ berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $faq = Faq::findOrFail($id);
        $faq->delete();

        return redirect()->back()->with('success', 'FAQ berhasil dihapus.');
    }

    public function importCsv(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv,txt|max:10240',
        ]);

        $result = $this->csvService->importCsv('faqs', $request->file('file'));

        if (!$result['success']) {
            return redirect()->back()->withErrors(['csv' => $result['message']]);
        }

        return redirect()->back()->with('success', $result['message']);
    }

    public function downloadTemplate(): StreamedResponse
    {
        $csvContent = $this->csvService->generateTemplate('faqs');

        return response()->streamDownload(function () use ($csvContent) {
            echo $csvContent;
        }, 'template_faqs.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function exportCsv(): StreamedResponse
    {
        $csvContent = $this->csvService->exportCsv('faqs');

        return response()->streamDownload(function () use ($csvContent) {
            echo $csvContent;
        }, 'export_faqs_' . date('Y-m-d_H-i-s') . '.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
