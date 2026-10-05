import { Head, router, useForm } from '@inertiajs/react';
import { Building2, Download, Edit2, Plus, Search, Trash2,  Instagram } from 'lucide-react';
import React, { useState } from 'react';
import { CsvUploadModal } from '@/components/csv-upload-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: JENIS_OPTIONS[0],
        abbreviation: '',
        type: 'departemen' as 'bph' | 'biro' | 'departemen',
        description: '',
        instagram: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/birdept', { search, type: jenisFilter }, { preserveState: true });
    };

    const handleFilterChange = (val: string) => {
        setJenisFilter(val);
        router.get('/admin/birdept', { search, type: val }, { preserveState: true });
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

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-transparent">
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <Building2 className="h-7 w-7 text-emerald-600" />
                            Manajemen Biro & Departemen (Birdept)
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola seluruh struktur BPH, Biro, dan Departemen BEM MSPACE.
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
                            <Button variant="outline" size="sm" className="gap-1 text-xs">
                                <Download className="h-3.5 w-3.5" />
                                Export CSV
                            </Button>
                        </a>

                        <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Birdept
                        </Button>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <Card className="shadow-sm">
                    <CardContent className="p-4">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="">Semua Jenis</option>
                                <option value="bph">BPH</option>
                                <option value="biro">Biro</option>
                                <option value="departemen">Departemen</option>
                            </select>
                            <Button type="submit" variant="secondary" className="text-sm">
                                Cari
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Data Table Card */}
                <Card className="shadow-sm">
                    <CardHeader className="py-4 border-b">
                        <CardTitle className="text-base font-bold flex items-center justify-between">
                            <span>Daftar Birdept ({units.length})</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 text-xs uppercase font-semibold text-muted-foreground border-b">
                                    <tr>
                                        <th className="px-4 py-3">ID</th>
                                        <th className="px-4 py-3">Nama Birdept</th>
                                        <th className="px-4 py-3">Panggilan</th>
                                        <th className="px-4 py-3">Jenis</th>
                                        <th className="px-4 py-3">Instagram</th>
                                        <th className="px-4 py-3">Deskripsi</th>
                                        <th className="px-4 py-3">Kunjungan publik</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {units.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                                                Tidak ada data birdept ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        units.map((item) => (
                                            <tr key={item.unitId} className="hover:bg-muted/30 transition">
                                                <td className="px-4 py-3 font-mono font-medium text-xs">{item.unitId}</td>
                                                <td className="px-4 py-3 font-semibold">{item.name}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{item.abbreviation}</td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        className={
                                                            item.type === 'bph'
                                                                ? 'bg-purple-600 text-white'
                                                                : item.type === 'biro'
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
                                                <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">
                                                    {item.description || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-xs tabular-nums">
                                                    <span className="block font-bold text-foreground">{item.publicVisits.toLocaleString('id-ID')} tayangan</span>
                                                    <span className="text-muted-foreground">{item.uniqueVisitors.toLocaleString('id-ID')} pengunjung</span>
                                                </td>
                                                <td className="px-4 py-3 text-right space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditModal(item)}
                                                        className="h-8 w-8 p-0 text-[#9ec8ff] hover:text-white hover:bg-[#324879]"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.unitId)}
                                                        className="h-8 w-8 p-0 text-[#ffb4b4] hover:text-white hover:bg-[#654052]"
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
                            <DialogTitle className="font-bold text-xl">
                                {editingBirdept ? 'Edit Birdept' : 'Tambah Birdept Baru'}
                            </DialogTitle>
                            <DialogDescription>
                                Lengkapi form berikut untuk {editingBirdept ? 'memperbarui' : 'menambahkan'} data Biro / Departemen.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4 py-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Nama Resmmi Birdept</Label>
                                <select
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    {JENIS_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                {errors.name && <p className="text-xs text-red-300">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="abbreviation">Nama Panggilan / Singkatan</Label>
                                    <Input
                                        id="abbreviation"
                                        placeholder="Contoh: Adkesma, Internal, Medbrand"
                                        value={data.abbreviation}
                                        onChange={(e) => setData('abbreviation', e.target.value)}
                                    />
                                    {errors.abbreviation && <p className="text-xs text-red-300">{errors.abbreviation}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="type">Jenis Organisasi</Label>
                                    <select
                                        id="type"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value as 'bph' | 'biro' | 'departemen')}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="bph">BPH</option>
                                        <option value="biro">Biro</option>
                                        <option value="departemen">Departemen</option>
                                    </select>
                                    {errors.type && <p className="text-xs text-red-300">{errors.type}</p>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="instagram">Akun Instagram</Label>
                                <Input
                                    id="instagram"
                                    placeholder="Contoh: @adkesma_bem"
                                    value={data.instagram}
                                    onChange={(e) => setData('instagram', e.target.value)}
                                />
                                {errors.instagram && <p className="text-xs text-red-300">{errors.instagram}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description">Deskripsi Singkat</Label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    placeholder="Tuliskan description tugas dan fungsi utama..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                {errors.description && <p className="text-xs text-red-300">{errors.description}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    {editingBirdept ? 'Simpan Perubahan' : 'Tambah Birdept'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
