import { Head, router, useForm } from '@inertiajs/react';
import {
    Building2,
    Download,
    Edit2,
    Plus,
    Search,
    Trash2,
    Instagram,
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

interface Birdept {
    unitId: number;
    name: string;
    abbreviation: string;
    type: 'bph' | 'biro' | 'departemen';
    description?: string;
    instagram?: string;
    publicVisits: number;
    uniqueVisitors: number;
}

interface Props {
    units: Birdept[];
    filters: { search?: string; type?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Birdept BEM', href: '/admin/birdept' },
];

const JENIS_OPTIONS = [
    'Badan Pengurus Harian',
    'Eksternal, Bisnis, dan Kemitraan',
    'Internal dan Pengembangan',
    'Media Branding',
    'Riset dan Teknologi',
    'Advokasi dan Kesejahteraan Mahasiswa',
    'Akademik dan Prestasi',
    'Kajian dan Aksi Strategis',
    'Olahraga',
    'Pengembangan Sumber Daya Mahasiswa dan Karir',
    'Seni Budaya',
    'Sosial dan Lingkungan',
];

export default function BirdeptIndex({ units, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [jenisFilter, setJenisFilter] = useState(filters.type || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingBirdept, setEditingBirdept] = useState<Birdept | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: JENIS_OPTIONS[0],
            abbreviation: '',
            type: 'departemen' as 'bph' | 'biro' | 'departemen',
            description: '',
            instagram: '',
        });

    const liveFilters = useLiveFilters('/admin/birdept', {
        search,
        type: jenisFilter,
    });

    const handleFilterChange = (val: string) => {
        setJenisFilter(val);
    };

    const openCreateModal = () => {
        reset();
        clearErrors();
        setEditingBirdept(null);
        setIsCreateOpen(true);
    };

    const openEditModal = (item: Birdept) => {
        clearErrors();
        setEditingBirdept(item);
        setData({
            name: item.name,
            abbreviation: item.abbreviation,
            type: item.type,
            description: item.description || '',
            instagram: item.instagram || '',
        });
        setIsCreateOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingBirdept) {
            put(`/admin/birdept/${editingBirdept.unitId}`, {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/birdept', {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data Birdept ini?')) {
            router.delete(`/admin/birdept/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Biro & Departemen" />

            <div className="flex flex-1 flex-col gap-6 bg-transparent p-4 md:p-6">
                {/* Header Title */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight">
                            <Building2 className="h-7 w-7 text-emerald-600" />
                            Manajemen Biro & Departemen (Birdept)
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola seluruh struktur BPH, Biro, dan Departemen
                            BEM MSPACE.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <CsvUploadModal
                            title="Upload CSV Birdept"
                            description="Unggah file CSV untuk memasukkan banyak data Birdept sekaligus."
                            uploadUrl="/admin/birdept/import-csv"
                            templateUrl="/admin/birdept/template-csv"
                            exportUrl="/admin/birdept/export-csv"
                        />

                        <a href="/admin/birdept/export-csv" download>
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
                            className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Birdept
                        </Button>
                    </div>
                </div>

                {/* Filter & Search Bar */}
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
                                    placeholder="Cari name birdept, name panggilan, atau type..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 text-sm"
                                />
                            </div>
                            <select
                                value={jenisFilter}
                                onChange={(e) =>
                                    handleFilterChange(e.target.value)
                                }
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                            >
                                <option value="">Semua Jenis</option>
                                <option value="bph">BPH</option>
                                <option value="biro">Biro</option>
                                <option value="departemen">Departemen</option>
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

                {/* Data Table Card */}
                <Card className="shadow-sm">
                    <CardHeader className="border-b py-4">
                        <CardTitle className="flex items-center justify-between text-base font-bold">
                            <span>Daftar Birdept ({units.length})</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-muted/50 text-xs font-semibold text-muted-foreground uppercase">
                                    <tr>
                                        <th className="px-4 py-3">ID</th>
                                        <th className="px-4 py-3">
                                            Nama Birdept
                                        </th>
                                        <th className="px-4 py-3">Panggilan</th>
                                        <th className="px-4 py-3">Jenis</th>
                                        <th className="px-4 py-3">Instagram</th>
                                        <th className="px-4 py-3">Deskripsi</th>
                                        <th className="px-4 py-3">
                                            Kunjungan publik
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {units.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="px-4 py-8 text-center text-muted-foreground"
                                            >
                                                Tidak ada data birdept
                                                ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        units.map((item) => (
                                            <tr
                                                key={item.unitId}
                                                className="transition hover:bg-muted/30"
                                            >
                                                <td className="px-4 py-3 font-mono text-xs font-medium">
                                                    {item.unitId}
                                                </td>
                                                <td className="px-4 py-3 font-semibold">
                                                    {item.name}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {item.abbreviation}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        className={
                                                            item.type === 'bph'
                                                                ? 'bg-purple-600 text-white'
                                                                : item.type ===
                                                                    'biro'
                                                                  ? 'bg-blue-600 text-white'
                                                                  : 'bg-emerald-600 text-white'
                                                        }
                                                    >
                                                        {item.type.toUpperCase()}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    {item.instagram ? (
                                                        <span className="flex items-center gap-1 text-pink-600 dark:text-pink-400">
                                                            <Instagram className="h-3.5 w-3.5" />
                                                            {item.instagram}
                                                        </span>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </td>
                                                <td className="max-w-xs truncate px-4 py-3 text-xs text-muted-foreground">
                                                    {item.description || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-xs tabular-nums">
                                                    <span className="block font-bold text-foreground">
                                                        {item.publicVisits.toLocaleString(
                                                            'id-ID',
                                                        )}{' '}
                                                        tayangan
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {item.uniqueVisitors.toLocaleString(
                                                            'id-ID',
                                                        )}{' '}
                                                        pengunjung
                                                    </span>
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
                                                                item.unitId,
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
                                {editingBirdept
                                    ? 'Edit Birdept'
                                    : 'Tambah Birdept Baru'}
                            </DialogTitle>
                            <DialogDescription>
                                Lengkapi form berikut untuk{' '}
                                {editingBirdept ? 'memperbarui' : 'menambahkan'}{' '}
                                data Biro / Departemen.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 py-2"
                        >
                            <div className="space-y-1.5">
                                <Label htmlFor="name">
                                    Nama Resmmi Birdept
                                </Label>
                                <select
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                >
                                    {JENIS_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                {errors.name && (
                                    <p className="text-xs text-red-300">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="abbreviation">
                                        Nama Panggilan / Singkatan
                                    </Label>
                                    <Input
                                        id="abbreviation"
                                        placeholder="Contoh: Adkesma, Internal, Medbrand"
                                        value={data.abbreviation}
                                        onChange={(e) =>
                                            setData(
                                                'abbreviation',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.abbreviation && (
                                        <p className="text-xs text-red-300">
                                            {errors.abbreviation}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="type">
                                        Jenis Organisasi
                                    </Label>
                                    <select
                                        id="type"
                                        value={data.type}
                                        onChange={(e) =>
                                            setData(
                                                'type',
                                                e.target.value as
                                                    | 'bph'
                                                    | 'biro'
                                                    | 'departemen',
                                            )
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                    >
                                        <option value="bph">BPH</option>
                                        <option value="biro">Biro</option>
                                        <option value="departemen">
                                            Departemen
                                        </option>
                                    </select>
                                    {errors.type && (
                                        <p className="text-xs text-red-300">
                                            {errors.type}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="instagram">
                                    Akun Instagram
                                </Label>
                                <Input
                                    id="instagram"
                                    placeholder="Contoh: @adkesma_bem"
                                    value={data.instagram}
                                    onChange={(e) =>
                                        setData('instagram', e.target.value)
                                    }
                                />
                                {errors.instagram && (
                                    <p className="text-xs text-red-300">
                                        {errors.instagram}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description">
                                    Deskripsi Singkat
                                </Label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    placeholder="Tuliskan description tugas dan fungsi utama..."
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    className="w-full rounded-md border border-input bg-background p-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                />
                                {errors.description && (
                                    <p className="text-xs text-red-300">
                                        {errors.description}
                                    </p>
                                )}
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
                                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                                >
                                    {editingBirdept
                                        ? 'Simpan Perubahan'
                                        : 'Tambah Birdept'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
