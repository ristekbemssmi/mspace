import { useForm } from '@inertiajs/react';
import { Download, FileSpreadsheet, CheckCircle2, UploadCloud, X } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface CsvUploadModalProps {
    title: string;
    description: string;
    uploadUrl: string;
    templateUrl: string;
    exportUrl?: string;
    tableName?: string;
    tableOptions?: { value: string; label: string }[];
    triggerButton?: React.ReactNode;
}

export function CsvUploadModal({
    title,
    description,
    uploadUrl,
    templateUrl,
    exportUrl,
    tableOptions,
    triggerButton,
}: CsvUploadModalProps) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        file: null as File | null,
        target_table: tableOptions && tableOptions.length > 0 ? tableOptions[0].value : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        post(uploadUrl, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton || (
                    <Button variant="outline" className="gap-2 border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/40">
                        <FileSpreadsheet className="h-4 w-4" />
                        Upload Excel / CSV
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[580px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <FileSpreadsheet className="h-6 w-6 text-emerald-500" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Template & Export Quick Links */}
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/60 p-3.5 text-sm">
                        <div>
                            <span className="font-bold text-foreground">Format Template Data</span>
                            <p className="text-xs text-muted-foreground">Unduh file Excel (.xlsx) atau CSV resmi agar header sesuai</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <a
                                href={templateUrl}
                                download
                                className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition"
                            >
                                <Download className="h-3.5 w-3.5" />
                                Download Excel / CSV Template
                            </a>
                            {exportUrl && (
                                <a
                                    href={exportUrl}
                                    download
                                    className="inline-flex items-center gap-1.5 rounded-md bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
                                >
                                    <Download className="h-3.5 w-3.5" />
                                    Export CSV
                                </a>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {tableOptions && tableOptions.length > 0 && (
                            <div className="space-y-1.5">
                                <Label htmlFor="target_table">Pilih Target Tabel</Label>
                                <select
                                    id="target_table"
                                    value={data.target_table}
                                    onChange={(e) => setData('target_table', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    {tableOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* File Upload Dropzone */}
                        <div className="space-y-1.5">
                            <Label>File Excel / CSV (.xlsx, .xls, .csv)</Label>
                            <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-500/40 p-6 text-center hover:border-emerald-500/70 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition cursor-pointer">
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv,text/csv,.txt"
                                    onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <UploadCloud className="h-10 w-10 text-emerald-500 mb-2" />
                                {data.file ? (
                                    <div className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>{data.file.name}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setData('file', null);
                                            }}
                                            className="text-muted-foreground hover:text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Klik atau tarik file .xlsx / .csv ke sini</p>
                                        <p className="text-xs text-muted-foreground mt-1">Mendukung Microsoft Excel (.xlsx, .xls) dan CSV (Maksimal 10 MB)</p>
                                    </div>
                                )}
                            </div>
                            {errors.file && <p className="text-xs font-medium text-red-500">{errors.file}</p>}
                            {(errors as Record<string, string>).csv && (
                                <p className="text-xs font-medium text-red-500">{(errors as Record<string, string>).csv}</p>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !data.file}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold"
                            >
                                <UploadCloud className="h-4 w-4" />
                                {processing ? 'Memproses File...' : 'Import Data Sekarang'}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
