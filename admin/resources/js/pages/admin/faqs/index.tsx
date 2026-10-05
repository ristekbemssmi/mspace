import { Head, router, useForm } from '@inertiajs/react';
import {
    Download,
    Edit2,
    HelpCircle,
    Plus,
    Search,
    Trash2,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { CsvUploadModal } from '@/components/csv-upload-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLiveFilters } from '@/hooks/use-live-filters';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface FaqItem {
    id: number;
    question: string;
    answer: string;
    sortOrder: number;
    isActive: boolean;
}

interface Props {
    faqs: FaqItem[];
    filters: { search?: string; isActive?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'FAQ Management', href: '/admin/faqs' },
];

export default function FaqsIndex({ faqs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeFilter, setActiveFilter] = useState(filters.isActive || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            question: '',
            answer: '',
            sortOrder: 1,
            isActive: true,
        });

    const liveFilters = useLiveFilters('/admin/faqs', {
        search,
        isActive: activeFilter,
    });

    const openCreateModal = () => {
        reset();
        clearErrors();
        setEditingFaq(null);
        setData('sortOrder', faqs.length + 1);
        setIsCreateOpen(true);
    };

    const openEditModal = (item: FaqItem) => {
        clearErrors();
        setEditingFaq(item);
        setData({
            question: item.question,
            answer: item.answer,
            sortOrder: item.sortOrder,
            isActive: item.isActive,
        });
        setIsCreateOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingFaq) {
            put(`/admin/faqs/${editingFaq.id}`, {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/faqs', {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) {
            router.delete(`/admin/faqs/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pertanyaan Umum" />

            <div className="flex flex-1 flex-col gap-6 bg-transparent p-4 md:p-6">
                {/* Header Title */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight">
                            <HelpCircle className="h-7 w-7 text-purple-600" />
                            Manajemen FAQ (Frequently Asked Questions)
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola daftar question dan answer yang sering
                            ditanyakan oleh mahasiswa dan publik.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <CsvUploadModal
                            title="Upload CSV FAQ"
                            description="Unggah file CSV berisi kolom question, answer, sortOrder, dan isActive."
                            uploadUrl="/admin/faqs/import-csv"
                            templateUrl="/admin/faqs/template-csv"
                            exportUrl="/admin/faqs/export-csv"
                        />

                        <a href="/admin/faqs/export-csv" download>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 text-xs"
                            >
                                <Download className="h-3.5 w-3.5" />
                                Export CSV
                            </Button>
                        </a>

                        <Button
                            onClick={openCreateModal}
                            className="gap-2 bg-purple-600 text-white hover:bg-purple-700"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah FAQ
                        </Button>
                    </div>
                </div>

                {/* Filter & Search */}
                <Card className="shadow-sm">
                    <CardContent className="p-4">
                        <form
                            onSubmit={(event) => event.preventDefault()}
                            className="flex flex-col gap-3 sm:flex-row"
                        >
                            <div className="relative min-w-0 flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Cari kata kunci question atau answer..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 text-sm"
                                />
                            </div>
                            <select
                                value={activeFilter}
                                onChange={(e) =>
                                    setActiveFilter(e.target.value)
                                }
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                            >
                                <option value="">Semua Status</option>
                                <option value="true">Aktif Ditampilkan</option>
                                <option value="false">Non-Aktif</option>
                            </select>
                        </form>
                        <p
                            role="status"
                            className="mt-2 text-sm text-muted-foreground"
                        >
                            {liveFilters.loading
                                ? 'Memperbarui hasil...'
                                : liveFilters.error ||
                                  'Hasil diperbarui otomatis.'}
                        </p>
                    </CardContent>
                </Card>

                {/* FAQ List Table */}
                <Card className="shadow-sm">
                    <CardHeader className="border-b py-4">
                        <CardTitle className="flex items-center justify-between text-base font-bold">
                            <span>Daftar FAQ ({faqs.length})</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-muted/50 text-xs font-semibold text-muted-foreground uppercase">
                                    <tr>
                                        <th className="w-16 px-4 py-3 text-center">
                                            Urutan
                                        </th>
                                        <th className="px-4 py-3">
                                            Pertanyaan
                                        </th>
                                        <th className="px-4 py-3">Jawaban</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {faqs.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-8 text-center text-muted-foreground"
                                            >
                                                Tidak ada data FAQ ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        faqs.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="transition hover:bg-muted/30"
                                            >
                                                <td className="px-4 py-3 text-center font-mono text-xs font-bold">
                                                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                                                        {item.sortOrder}
                                                    </span>
                                                </td>
                                                <td className="max-w-sm px-4 py-3 leading-snug font-semibold text-foreground">
                                                    {item.question}
                                                </td>
                                                <td className="line-clamp-2 max-w-md px-4 py-3 text-xs text-muted-foreground">
                                                    {item.answer}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {item.isActive ? (
                                                        <Badge className="gap-1 bg-emerald-600 text-xs text-white">
                                                            <CheckCircle2 className="h-3 w-3" />{' '}
                                                            Aktif
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant="secondary"
                                                            className="gap-1 text-xs text-muted-foreground"
                                                        >
                                                            <XCircle className="h-3 w-3" />{' '}
                                                            Sembunyi
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="space-x-2 px-4 py-3 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            openEditModal(item)
                                                        }
                                                        className="h-8 w-8 p-0 text-[#9ec8ff] hover:bg-[#324879] hover:text-white"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id,
                                                            )
                                                        }
                                                        className="h-8 w-8 p-0 text-[#ffb4b4] hover:bg-[#654052] hover:text-white"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Create / Edit Form Modal */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">
                                {editingFaq ? 'Edit FAQ' : 'Tambah FAQ Baru'}
                            </DialogTitle>
                            <DialogDescription>
                                Masukkan teks question dan answer lengkap yang
                                akan tampil di halaman utama MSPACE.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 py-2"
                        >
                            <div className="space-y-1.5">
                                <Label htmlFor="question">Pertanyaan FAQ</Label>
                                <Input
                                    id="question"
                                    placeholder="Contoh: Bagaimana cara mendaftar beasiswa MSPACE?"
                                    value={data.question}
                                    onChange={(e) =>
                                        setData('question', e.target.value)
                                    }
                                />
                                {errors.question && (
                                    <p className="text-xs text-red-300">
                                        {errors.question}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="answer">Jawaban Lengkap</Label>
                                <textarea
                                    id="answer"
                                    rows={4}
                                    placeholder="Tuliskan answer yang rinci..."
                                    value={data.answer}
                                    onChange={(e) =>
                                        setData('answer', e.target.value)
                                    }
                                    className="w-full rounded-md border border-input bg-background p-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                />
                                {errors.answer && (
                                    <p className="text-xs text-red-300">
                                        {errors.answer}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="sortOrder">
                                        Urutan Tampil (Nomor)
                                    </Label>
                                    <Input
                                        id="sortOrder"
                                        type="number"
                                        min={1}
                                        value={data.sortOrder}
                                        onChange={(e) =>
                                            setData(
                                                'sortOrder',
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                    {errors.sortOrder && (
                                        <p className="text-xs text-red-300">
                                            {errors.sortOrder}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col justify-end space-y-1.5">
                                    <div className="mb-2 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={data.isActive}
                                            onChange={(e) =>
                                                setData(
                                                    'isActive',
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                        />
                                        <Label
                                            htmlFor="isActive"
                                            className="cursor-pointer font-bold"
                                        >
                                            Aktifkan FAQ Ini
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-purple-600 text-white hover:bg-purple-700"
                                >
                                    {editingFaq
                                        ? 'Simpan Perubahan'
                                        : 'Tambah FAQ'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
