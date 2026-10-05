<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CsvService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class CsvImportController extends Controller
{
    protected CsvService $csvService;

    public function __construct(CsvService $csvService)
    {
        $this->csvService = $csvService;
    }

    public function index(): Response
    {
        $supportedTables = CsvService::getSupportedTables();

        return Inertia::render('admin/csv-hub/index', [
            'tables' => $supportedTables,
        ]);
    }

    public function processImport(Request $request): RedirectResponse
    {
        $request->validate([
            'table_name' => 'required|string',
            'file' => 'required|file|mimes:xlsx,xls,csv,txt|max:10240',
        ]);

        $tableName = $request->input('table_name');
        $result = $this->csvService->importCsv($tableName, $request->file('file'));

        if (!$result['success']) {
            return redirect()->back()->withErrors([
                'csv_error' => $result['message'],
                'csv_details' => $result['errors'],
            ]);
        }

        return redirect()->back()->with([
            'success' => $result['message'],
            'import_report' => [
                'inserted' => $result['inserted'],
                'failed' => $result['failed'],
                'errors' => $result['errors'],
            ],
        ]);
    }

    public function downloadTemplateXlsx(string $tableName): StreamedResponse
    {
        $xlsxContent = $this->csvService->generateTemplateXlsx($tableName);

        return response()->streamDownload(function () use ($xlsxContent) {
            echo $xlsxContent;
        }, "template_{$tableName}.xlsx", [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    public function downloadTemplate(string $tableName): StreamedResponse
    {
        $csvContent = $this->csvService->generateTemplate($tableName);

        return response()->streamDownload(function () use ($csvContent) {
            echo $csvContent;
        }, "template_{$tableName}.csv", [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function exportTable(string $tableName): StreamedResponse
    {
        $csvContent = $this->csvService->exportCsv($tableName);

        return response()->streamDownload(function () use ($csvContent) {
            echo $csvContent;
        }, "export_{$tableName}_" . date('Y-m-d_H-i-s') . '.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
