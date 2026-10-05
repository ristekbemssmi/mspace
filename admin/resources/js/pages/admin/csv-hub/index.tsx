import { Head, useForm, usePage } from '@inertiajs/react';
import { Download, FileSpreadsheet, CheckCircle2, AlertCircle, UploadCloud, Info, Database, Sparkles, FileCode, Layers, BookOpen } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface TableConfig {
    label: string;
    group: string;
    required: string[];
    optional: string[];
    sample: string[][];
}

interface Props {
    tables: Record<string, TableConfig>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Excel & CSV Import Hub', href: '/admin/csv-hub' },
];

export default function CsvHubIndex({ tables }: Props) {
    const tableKeys = Object.keys(tables);
    const [selectedTable, setSelectedTable] = useState<string>(tableKeys[0] || 'units');

    const { flash, errors: pageErrors } = usePage<any>().props;

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        table_name: selectedTable,
        file: null as File | null,
    });

    const handleTableSelect = (tableName: string) => {
        setSelectedTable(tableName);
        setData('table_name', tableName);
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        post('/admin/csv-hub/process', {
            preserveScroll: true,
            onSuccess: () => {
                reset('file');
            },
        });
    };

    const currentConfig = tables[selectedTable];

    // Separate main tables vs sub-tables
    const mainTables = tableKeys.filter((k) => tables[k].group === 'Utama' || tables[k].group === 'Informasi');
    const subTables = tableKeys.filter((k) => tables[k].group === 'Informasi Sub-Tabel');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Impor Excel & CSV" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-transparent">
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 p-6 md:p-8 text-white shadow-lg">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                                <Sparkles className="h-3.5 w-3.5" /> Central Bulk Importer & Template Hub
                            </span>
                            <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight">
                                Fitur Template & Upload Excel / CSV (Tabel Utama & Sub-Tabel)
                            </h1>
                            <p className="mt-1 text-emerald-100 max-w-2xl text-sm">
                                Unduh template resmi Excel (.xlsx) atau CSV untuk semua {tableKeys.length} tabel dan sub-tabel, termasuk detail lomba, atau unggah file spreadsheet Anda secara instan.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Database className="h-16 w-16 text-white/20 hidden md:block" />
                        </div>
                    </div>
                </div>

                {/* Status Alert Flash Messages */}
                {flash?.success && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-start gap-3 shadow-sm">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-sm">{flash.success}</p>
                            {flash.import_report && (
                                <p className="text-xs mt-1">
                                    Sukses terinput: <strong>{flash.import_report.inserted}</strong> | Gagal:{' '}
                                    <strong>{flash.import_report.failed}</strong>
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {pageErrors?.csv_error && (
                    <div className="rounded-xl border border-red-500/30 bg-red-50 p-4 text-red-900 dark:bg-red-950/40 dark:text-red-300 flex items-start gap-3 shadow-sm">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-sm">{pageErrors.csv_error}</p>
                            {pageErrors.csv_details && Array.isArray(pageErrors.csv_details) && (
                                <ul className="mt-2 list-disc list-inside text-xs space-y-1">
                                    {pageErrors.csv_details.map((err: string, i: number) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {/* SECTION 1: Sub-Tables & Main Tables Template Download Gallery */}
                <Card className="shadow-sm border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <Layers className="h-5 w-5 text-emerald-600" />
                            Daftar Download Template Resmi (Tabel Utama & Seluruh Sub-Tabel)
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Unduh template Excel (.xlsx) atau CSV yang Anda butuhkan. Setiap file sudah dilengkapi header kolom dan contohisinya.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-6">
                        {/* Sub-Tables Section */}
                        <div>
                            <h3 className="text-xs font-black uppercase text-amber-800 dark:text-amber-300 tracking-wider flex items-center gap-2 mb-3">
                                <BookOpen className="h-4 w-4 text-amber-600" />
                                Sub-Tabel Detail Informasi & Proker ({subTables.length} Sub-Tabel)
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {subTables.map((key) => {
                                    const config = tables[key];

                                    return (
                                        <div
                                            key={key}
                                            className="rounded-xl border border-amber-500/30 bg-background p-3 flex flex-col justify-between space-y-2 hover:shadow-sm transition"
                                        >
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-bold text-sm text-foreground leading-tight">{config.label}</h4>
                                                </div>
                                                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                                                    <code>{key}</code>
                                                </p>
                                                <p className="text-[11px] text-muted-foreground mt-1">
                                                    Kolom: {config.required.join(', ')}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1.5 pt-1">
                                                <a href={`/admin/csv-hub/template-xlsx/${key}`} download className="flex-1">
                                                    <Button
                                                        size="sm"
                                                        className="w-full h-7 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold gap-1 px-2"
                                                    >
                                                        <Download className="h-3 w-3" /> .XLSX
                                                    </Button>
                                                </a>
                                                <a href={`/admin/csv-hub/template/${key}`} download className="flex-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="w-full h-7 text-[11px] font-semibold gap-1 px-2 border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-50"
                                                    >
                                                        <FileCode className="h-3 w-3" /> .CSV
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Main Tables Section */}
                        <div>
                            <h3 className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300 tracking-wider flex items-center gap-2 mb-3">
                                <Database className="h-4 w-4 text-emerald-600" />
                                Tabel Utama ({mainTables.length} Tabel)
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {mainTables.map((key) => {
                                    const config = tables[key];

                                    return (
                                        <div
                                            key={key}
                                            className="rounded-xl border border-emerald-500/30 bg-background p-3 flex flex-col justify-between space-y-2 hover:shadow-sm transition"
                                        >
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-bold text-sm text-foreground leading-tight">{config.label}</h4>
                                                </div>
                                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                                                    <code>{key}</code>
                                                </p>
                                                <p className="text-[11px] text-muted-foreground mt-1">
                                                    Kolom: {config.required.join(', ')}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1.5 pt-1">
                                                <a href={`/admin/csv-hub/template-xlsx/${key}`} download className="flex-1">
                                                    <Button
                                                        size="sm"
                                                        className="w-full h-7 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold gap-1 px-2"
                                                    >
                                                        <Download className="h-3 w-3" /> .XLSX
                                                    </Button>
                                                </a>
                                                <a href={`/admin/csv-hub/template/${key}`} download className="flex-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="w-full h-7 text-[11px] font-semibold gap-1 px-2 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50"
                                                    >
                                                        <FileCode className="h-3 w-3" /> .CSV
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel: Table Selection List */}
                    <div className="space-y-4">
                        <Card className="shadow-sm">
                            <CardHeader className="pb-3 border-b">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Database className="h-5 w-5 text-emerald-600" />
                                    Pilih Target Upload Tabel
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Pilih tabel atau sub-tabel yang ingin diisi data massalnya
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-2">
                                <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
                                    {tableKeys.map((key) => {
                                        const config = tables[key];
                                        const isSelected = selectedTable === key;
                                        const isSub = config.group === 'Informasi Sub-Tabel';

                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => handleTableSelect(key)}
                                                className={`w-full text-left rounded-xl p-3 text-sm transition flex items-center justify-between ${
                                                    isSelected
                                                        ? 'bg-emerald-600 text-white font-bold shadow-md'
                                                        : 'hover:bg-muted/60 text-foreground font-medium'
                                                }`}
                                            >
                                                <div>
                                                    <p className="leading-snug flex items-center gap-1.5">
                                                        {config.label}
                                                    </p>
                                                    <p className={`text-[11px] ${isSelected ? 'text-emerald-100' : 'text-muted-foreground'}`}>
                                                        Tabel: <code className="font-mono">{key}</code>
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={isSelected ? 'secondary' : isSub ? 'outline' : 'default'}
                                                    className="text-[10px] font-mono"
                                                >
                                                    {isSub ? 'SUB' : 'MAIN'}
                                                </Badge>
                                            </button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Panel: Upload Zone & Schema Guide */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Upload Form Card */}
                        <Card className="shadow-sm border-2 border-emerald-500/20">
                            <CardHeader className="border-b bg-emerald-50/50 dark:bg-emerald-950/10 py-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                                            <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                                            {currentConfig?.label}
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Nama Tabel MySQL: <code className="font-mono font-bold text-foreground">{selectedTable}</code>
                                        </CardDescription>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <a href={`/admin/csv-hub/template-xlsx/${selectedTable}`} download>
                                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs shadow-sm font-bold">
                                                <Download className="h-3.5 w-3.5" />
                                                Template Excel (.xlsx)
                                            </Button>
                                        </a>
                                        <a href={`/admin/csv-hub/template/${selectedTable}`} download>
                                            <Button size="sm" variant="outline" className="gap-1.5 text-xs font-semibold">
                                                <FileCode className="h-3.5 w-3.5 text-emerald-600" />
                                                Template CSV
                                            </Button>
                                        </a>
                                        <a href={`/admin/csv-hub/export/${selectedTable}`} download>
                                            <Button size="sm" variant="ghost" className="gap-1.5 text-xs">
                                                <Download className="h-3.5 w-3.5" />
                                                Export CSV
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-sm">Unggah File Excel (.xlsx / .xls) atau CSV</Label>
                                        <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-500/40 p-8 text-center bg-emerald-50/20 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition cursor-pointer">
                                            <input
                                                type="file"
                                                accept=".xlsx,.xls,.csv,text/csv,.txt"
                                                onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            <UploadCloud className="h-12 w-12 text-emerald-600 mb-3" />
                                            {data.file ? (
                                                <div className="space-y-1">
                                                    <p className="font-bold text-emerald-700 dark:text-emerald-400 text-base">
                                                        {data.file.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Ukuran: {(data.file.size / 1024).toFixed(1)} KB • Klik untuk mengganti file
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        Tarik & Lepas file Excel (.xlsx) atau CSV di sini, atau klik untuk memilih
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Mendukung format Microsoft Excel (.xlsx / .xls) dan CSV (Maksimal 10 MB)
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {errors.file && <p className="text-xs font-semibold text-red-500">{errors.file}</p>}
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={processing || !data.file}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 px-6 py-2 shadow-md"
                                        >
                                            <UploadCloud className="h-4 w-4" />
                                            {processing ? 'Memproses Bulk Import...' : `Import Data ke Tabel ${selectedTable}`}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Schema & Column Requirements Guide */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-3 border-b">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Info className="h-5 w-5 text-blue-600" />
                                    Panduan Header & Format Kolom ({selectedTable})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Required Columns */}
                                    <div className="rounded-xl border border-red-500/20 bg-red-50/40 dark:bg-red-950/20 p-4">
                                        <h4 className="text-xs font-bold text-red-800 dark:text-red-300 uppercase tracking-wider mb-2">
                                            Kolom Wajib (Required)
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {currentConfig?.required.map((col) => (
                                                <Badge key={col} className="bg-red-600 text-white font-mono text-xs">
                                                    {col}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Optional Columns */}
                                    <div className="rounded-xl border border-blue-500/20 bg-blue-50/40 dark:bg-blue-950/20 p-4">
                                        <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-2">
                                            Kolom Opsional (Optional)
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {currentConfig?.optional.length === 0 ? (
                                                <span className="text-xs text-muted-foreground">Tidak ada</span>
                                            ) : (
                                                currentConfig?.optional.map((col) => (
                                                    <Badge key={col} variant="secondary" className="font-mono text-xs">
                                                        {col}
                                                    </Badge>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Sample Data Preview Table */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Contoh Baris Data Excel / CSV:
                                    </h4>
                                    <div className="overflow-x-auto rounded-xl border bg-muted/30">
                                        <table className="w-full text-left text-xs font-mono">
                                            <thead className="bg-muted font-bold border-b">
                                                <tr>
                                                    {arrayMerge(currentConfig?.required, currentConfig?.optional).map((col) => (
                                                        <th key={col} className="px-3 py-2 border-r last:border-r-0">
                                                            {col}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentConfig?.sample.map((row, idx) => (
                                                    <tr key={idx} className="border-b last:border-b-0 hover:bg-muted/50">
                                                        {row.map((cell, cIdx) => (
                                                            <td key={cIdx} className="px-3 py-2 border-r last:border-r-0 truncate max-w-[200px]">
                                                                {cell}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function arrayMerge(arr1: string[] = [], arr2: string[] = []): string[] {
    return [...arr1, ...arr2];
}
