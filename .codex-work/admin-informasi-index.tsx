import { Head, router, useForm } from '@inertiajs/react';
import { Download, Edit2, Megaphone, Plus, Search, Trash2 } from 'lucide-react';
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

interface BirdeptOption {
    unitId: number;
    name: string;
    abbreviation: string;
}

interface UserOption {
    id: number;
    name: string;
    username: string;
}

interface InformasiItem {
    id: number;
    unitId: number;
    userId: number;
    title: string;
    description: string;
    source?: string;
    status: 'draft' | 'published' | 'archived';
    viewCount: number;
    publishedAt?: string;
    category: 'beasiswa' | 'kegiatan' | 'himpunan' | 'wisuda' | 'alumni' | 'magang' | 'proker';
    expiresAt?: string;
    birdept?: BirdeptOption;
    units?: BirdeptOption[];
    user?: UserOption;
    beasiswa?: any;
    kegiatan?: any;
    himpunan?: any;
    wisuda?: any;
    alumni?: any;
    magang?: any;
    proker?: any;
}

interface PaginatedInformasi {
    data: InformasiItem[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    information: PaginatedInformasi;
    units: BirdeptOption[];
    users: UserOption[];
    filters: { search?: string; category?: string; status?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Informasi & Beasiswa', href: '/admin/informasi' },
];

const JENIS_INFORMASI_LIST = [
    { value: 'beasiswa', label: 'Beasiswa' },
    { value: 'kegiatan', label: 'Kegiatan' },
    { value: 'himpunan', label: 'Himpunan' },
    { value: 'wisuda', label: 'Wisuda' },
    { value: 'alumni', label: 'Alumni' },
    { value: 'magang', label: 'Magang' },
    { value: 'proker', label: 'Proker' },
];

const jakartaDateParts = (value: string) => {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date(value));
    const get = (type: string) => parts.find((part) => part.type === type)?.value || '';
    return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
};

const dateTimeInputValue = (value?: string) => !value ? '' : /(?:Z|[+-]\d{2}:\d{2})$/.test(value)
    ? jakartaDateParts(value)
    : value.replace(' ', 'T').substring(0, 16);

const dateInputValue = (value?: string) => !value ? '' : /(?:Z|[+-]\d{2}:\d{2})$/.test(value)
    ? jakartaDateParts(value).substring(0, 10)
    : value.substring(0, 10);

export default function InformasiIndex({ information, units, users, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [jenisFilter, setJenisFilter] = useState(filters.category || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingInfo, setEditingInfo] = useState<InformasiItem | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        unitId: units.length > 0 ? units[0].unitId : 0,
        unitIds: [] as number[],
        userId: users.length > 0 ? users[0].id : 0,
        title: '',
        description: '',
        source: '',
        status: 'published' as 'draft' | 'published' | 'archived',
        publishedAt: '',
        expiresAt: '',
        category: 'beasiswa' as 'beasiswa' | 'kegiatan' | 'himpunan' | 'wisuda' | 'alumni' | 'magang' | 'proker',

        // Sub-Type Payload
        beasiswa: { organizer: '', opensOn: '', closesOn: '', posterUrl: '', instagramUrl: '', registrationUrl: '' },
        kegiatan: { eventAt: '', location: '', organizer: '' },
        himpunan: { name: '', contact: '' },
        wisuda: { graduationPeriod: '', registrationSteps: '' },
        alumni: { name: '', cohort: '', topic: '' },
        magang: { company: '', position: '', duration: '' },
        proker: { purpose: '', audience: '', startsOn: '', endsOn: '' },
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/informasi', { search, category: jenisFilter, status: statusFilter }, { preserveState: true });
    };

    const handleJenisTabClick = (val: string) => {
        const nextVal = jenisFilter === val ? '' : val;
        setJenisFilter(nextVal);
        router.get('/admin/informasi', { search, category: nextVal, status: statusFilter }, { preserveState: true });
    };

    const openCreateModal = () => {
        reset();
        clearErrors();
        setEditingInfo(null);
        setIsCreateOpen(true);
    };

    const openEditModal = (item: InformasiItem) => {
        clearErrors();
        setEditingInfo(item);
        setData({
            unitId: item.unitId,
            unitIds: item.category === 'proker'
                ? (item.units || []).map((birdept) => birdept.unitId)
                : [],
            userId: item.userId,
            title: item.title,
            description: item.description,
            source: item.source || '',
            status: item.status,
            publishedAt: dateTimeInputValue(item.publishedAt),
            expiresAt: dateInputValue(item.expiresAt),
            category: item.category,

            beasiswa: item.beasiswa || { organizer: '', opensOn: '', closesOn: '', posterUrl: '', instagramUrl: '', registrationUrl: '' },
            kegiatan: item.kegiatan || { eventAt: '', location: '', organizer: '' },
            himpunan: item.himpunan || { name: '', contact: '' },
            wisuda: item.wisuda || { graduationPeriod: '', registrationSteps: '' },
            alumni: item.alumni || { name: '', cohort: '', topic: '' },
            magang: item.magang || { company: '', position: '', duration: '' },
            proker: item.proker || { purpose: '', audience: '', startsOn: '', endsOn: '' },
        });
        setIsCreateOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingInfo) {
            put(`/admin/informasi/${editingInfo.id}`, {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/informasi', {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data Informasi ini?')) {
            router.delete(`/admin/informasi/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Informasi & Beasiswa - MSPACE Admin" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-transparent">
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <Megaphone className="h-7 w-7 text-amber-500" />
                            Manajemen Informasi, Beasiswa & Kegiatan
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola konten publik Beasiswa, Kegiatan, Himpunan, Wisuda, Alumni, Magang, dan Proker.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <CsvUploadModal
                            title="Upload CSV Informasi"
                            description="Pilih target tabel informasi atau tabel detail yang ingin diimpor sekaligus."
                            uploadUrl="/admin/informasi/import-csv"
                            templateUrl="/admin/informasi/template-csv"
                            exportUrl="/admin/informasi/export-csv"
                            tableOptions={[
                                { value: 'information', label: 'Tabel Informasi Utama' },
                                { value: 'scholarships', label: 'Sub-Tabel Detail Beasiswa' },
                                { value: 'scholarshipRequirements', label: 'Sub-Tabel Syarat Beasiswa' },
                                { value: 'scholarshipBenefits', label: 'Sub-Tabel Benefit Beasiswa' },
                                { value: 'activities', label: 'Sub-Tabel Detail Kegiatan' },
                                { value: 'studentAssociations', label: 'Sub-Tabel Detail Himpunan' },
                                { value: 'graduations', label: 'Sub-Tabel Detail Wisuda' },
                                { value: 'alumni', label: 'Sub-Tabel Detail Alumni' },
                                { value: 'internships', label: 'Sub-Tabel Detail Magang' },
                                { value: 'workPrograms', label: 'Sub-Tabel Detail Proker (Program Kerja)' },
                                { value: 'workProgramCommittees', label: 'Sub-Tabel Panitia Program Kerja' },
                            ]}
                        />

                        <a href="/admin/informasi/export-csv" download>
                            <Button variant="outline" size="sm" className="gap-1 text-xs">
                                <Download className="h-3.5 w-3.5" />
                                Export CSV
                            </Button>
                        </a>

                        <Button onClick={openCreateModal} className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Informasi
                        </Button>
                    </div>
                </div>

                {/* Jenis Informasi Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <Button
                        variant={jenisFilter === '' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleJenisTabClick('')}
                        className="rounded-full text-xs font-semibold"
                    >
                        Semua Jenis
                    </Button>
                    {JENIS_INFORMASI_LIST.map((tab) => (
                        <Button
                            key={tab.value}
                            variant={jenisFilter === tab.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleJenisTabClick(tab.value)}
                            className="rounded-full text-xs font-semibold capitalize"
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>

                {/* Search & Filter */}
                <Card className="shadow-sm">
                    <CardContent className="p-4">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Cari title, description, atau source..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 text-sm"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="">Semua Status</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                            <Button type="submit" variant="secondary" className="text-sm">
                                Cari
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Table Card */}
                <Card className="shadow-sm">
                    <CardHeader className="py-4 border-b">
                        <CardTitle className="text-base font-bold flex items-center justify-between">
                            <span>Daftar Informasi ({information.total})</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 text-xs uppercase font-semibold text-muted-foreground border-b">
                                    <tr>
                                        <th className="px-4 py-3">Judul & Jenis</th>
                                        <th className="px-4 py-3">Penerbit (Birdept)</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Waktu Publikasi</th>
                                        <th className="px-4 py-3">Kedaluwarsa</th>
                                        <th className="px-4 py-3">Kunjungan</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {information.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                                Tidak ada data informasi ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        information.data.map((item) => (
                                            <tr key={item.id} className="hover:bg-muted/30 transition">
                                                <td className="px-4 py-3">
                                                    <p className="font-bold text-foreground leading-snug">{item.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="capitalize text-[10px]">
                                                            {item.category}
                                                        </Badge>
                                                        {item.source && <span className="text-xs text-muted-foreground truncate max-w-[200px]">{item.source}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    <p className="font-semibold text-foreground">{item.category === 'proker' && item.units?.length
                                                        ? [item.birdept?.abbreviation, ...item.units.map((birdept) => birdept.abbreviation)].filter(Boolean).join(' + ')
                                                        : item.birdept?.abbreviation || 'Birdept'}</p>
                                                    <p className="text-muted-foreground">Oleh @{item.user?.username || 'admin'}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        className={
                                                            item.status === 'published'
                                                                ? 'bg-emerald-600 text-white'
                                                                : item.status === 'draft'
                                                                ? 'bg-amber-600 text-white'
                                                                : 'bg-slate-600 text-white'
                                                        }
                                                    >
                                                        {item.status.toUpperCase()}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    {item.publishedAt ? new Date(item.publishedAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }) : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }) : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-xs font-mono font-medium">
                                                    {item.viewCount} views
                                                </td>
                                                <td className="px-4 py-3 text-right space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditModal(item)}
                                                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.id)}
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-bold text-xl">
                                {editingInfo ? 'Edit Informasi' : 'Tambah Informasi Baru'}
                            </DialogTitle>
                            <DialogDescription>
                                Masukkan rincian artikel informasi dan pilih tipe spesifiknya.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4 py-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="title">Judul Informasi</Label>
                                <Input
                                    id="title"
                                    placeholder="Contoh: Pendaftaran Beasiswa MSPACE 2026"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="category">Jenis Informasi</Label>
                                    <select
                                        id="category"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value as any)}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        {JENIS_INFORMASI_LIST.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="status">Status Publikasi</Label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as any)}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                    {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="publishedAt">Waktu publikasi</Label>
                                    <Input id="publishedAt" type="datetime-local" value={data.publishedAt} onChange={(e) => setData('publishedAt', e.target.value)} />
                                    <p className="text-xs text-white/70">Kosongkan untuk terbit sekarang saat status Published.</p>
                                    {errors.publishedAt && <p className="text-xs text-red-300">{errors.publishedAt}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="expiresAt">Tanggal kedaluwarsa</Label>
                                    <Input id="expiresAt" type="date" value={data.expiresAt} onChange={(e) => setData('expiresAt', e.target.value)} />
                                    <p className="text-xs text-white/70">Informasi tetap tampil sampai akhir tanggal ini.</p>
                                    {errors.expiresAt && <p className="text-xs text-red-300">{errors.expiresAt}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="unitId">{data.category === 'proker' ? 'Biro / Departemen Utama' : 'Biro / Departemen Penanggung Jawab'}</Label>
                                    <select
                                        id="unitId"
                                        value={data.unitId}
                                        onChange={(e) => setData('unitId', Number(e.target.value))}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        {units.map((b) => (
                                            <option key={b.unitId} value={b.unitId}>
                                                {b.abbreviation} ({b.name})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.unitId && <p className="text-xs text-red-500">{errors.unitId}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="userId">User Pembuat</Label>
                                    <select
                                        id="userId"
                                        value={data.userId}
                                        onChange={(e) => setData('userId', Number(e.target.value))}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        {users.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name} (@{u.username})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.userId && <p className="text-xs text-red-500">{errors.userId}</p>}
                                </div>
                            </div>

                            {data.category === 'proker' && (
                                <fieldset className="rounded-xl border border-[#607397] p-4">
                                    <legend className="px-2 text-sm font-bold text-[#f4e06d]">Birdept kolaborator</legend>
                                    <p className="mb-3 text-xs text-white/75">Pilih biro atau departemen lain yang ikut menangani proker ini. Birdept utama selalu tercatat.</p>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {units.filter((birdept) => birdept.unitId !== data.unitId).map((birdept) => (
                                            <label key={birdept.unitId} className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10">
                                                <input type="checkbox" className="accent-[#f4e06d]" checked={data.unitIds.includes(birdept.unitId)} onChange={(event) => setData('unitIds', event.target.checked
                                                    ? [...data.unitIds, birdept.unitId]
                                                    : data.unitIds.filter((id) => id !== birdept.unitId))} />
                                                <span>{birdept.abbreviation} ({birdept.name})</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.unitIds && <p className="mt-2 text-xs text-red-300">{errors.unitIds}</p>}
                                </fieldset>
                            )}

                            <div className="space-y-1.5">
                                <Label htmlFor="source">Sumber Informasi (Link / Institusi)</Label>
                                <Input
                                    id="source"
                                    placeholder="https://..."
                                    value={data.source}
                                    onChange={(e) => setData('source', e.target.value)}
                                />
                                {errors.source && <p className="text-xs text-red-500">{errors.source}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description">Deskripsi / Isi Informasi</Label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    placeholder="Tuliskan isi informasi secara lengkap..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                            </div>

                            {/* Dynamic Sub-Type Form Fields */}
                            {data.category === 'beasiswa' && (
                                <div className="rounded-xl border p-4 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
                                    <h4 className="font-bold text-sm text-amber-800 dark:text-amber-300">Rincian Detail Beasiswa</h4>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <Label>Penyelenggara</Label>
                                            <Input
                                                placeholder="Kemendikbud"
                                                value={data.beasiswa?.organizer || ''}
                                                onChange={(e) => setData('beasiswa', { ...data.beasiswa, organizer: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Link Pendaftaran</Label>
                                            <Input
                                                placeholder="https://bit.ly/daftar"
                                                value={data.beasiswa?.registrationUrl || ''}
                                                onChange={(e) => setData('beasiswa', { ...data.beasiswa, registrationUrl: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Link Poster</Label>
                                            <Input
                                                placeholder="https://..."
                                                value={data.beasiswa?.posterUrl || ''}
                                                onChange={(e) => setData('beasiswa', { ...data.beasiswa, posterUrl: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Link Instagram</Label>
                                            <Input
                                                placeholder="https://..."
                                                value={data.beasiswa?.instagramUrl || ''}
                                                onChange={(e) => setData('beasiswa', { ...data.beasiswa, instagramUrl: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.category === 'kegiatan' && (
                                <div className="rounded-xl border p-4 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
                                    <h4 className="font-bold text-sm text-blue-800 dark:text-blue-300">Rincian Detail Kegiatan</h4>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <Label>Lokasi</Label>
                                            <Input
                                                placeholder="Aula FMIPA IPB"
                                                value={data.kegiatan?.location || ''}
                                                onChange={(e) => setData('kegiatan', { ...data.kegiatan, location: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Penyelenggara</Label>
                                            <Input
                                                placeholder="Biro Riset & Teknologi"
                                                value={data.kegiatan?.organizer || ''}
                                                onChange={(e) => setData('kegiatan', { ...data.kegiatan, organizer: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-3">
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-amber-600 hover:bg-amber-700 text-white">
                                    {editingInfo ? 'Simpan Perubahan' : 'Tambah Informasi'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
