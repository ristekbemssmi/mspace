import { Head, router, useForm } from '@inertiajs/react';
import { Download, Edit2, Plus, Search, Trash2, Users, ShieldCheck, Mail, Phone } from 'lucide-react';
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

interface UserItem {
    id: number;
    username: string;
    name: string;
    email: string;
    studentNumber: string;
    phone?: string;
    studyProgram?: string;
    user_bem?: {
        unitId: number;
        position: string;
        birdept?: {
            unitId: number;
            name: string;
            abbreviation: string;
        };
    };
}

interface PaginatedUsers {
    data: UserItem[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    users: PaginatedUsers;
    units: BirdeptOption[];
    filters: { search?: string; studyProgram?: string; is_bem?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Users & Anggota BEM', href: '/admin/users' },
];

const PRODI_OPTIONS = [
    'Statistika dan Sains Data',
    'Matematika',
    'Aktuaria',
    'Ilmu Komputer',
    'Kecerdasan Buatan',
];

export default function UsersIndex({ users, units, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [prodiFilter, setProdiFilter] = useState(filters.studyProgram || '');
    const [bemFilter, setBemFilter] = useState(filters.is_bem || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        username: '',
        name: '',
        email: '',
        studentNumber: '',
        password: '',
        phone: '',
        studyProgram: PRODI_OPTIONS[0],
        is_bem: false,
        unitId: units.length > 0 ? units[0].unitId : 0,
        position: 'Staff',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/users', { search, studyProgram: prodiFilter, is_bem: bemFilter }, { preserveState: true });
    };

    const openCreateModal = () => {
        reset();
        clearErrors();
        setEditingUser(null);
        setIsCreateOpen(true);
    };

    const openEditModal = (item: UserItem) => {
        clearErrors();
        setEditingUser(item);
        setData({
            username: item.username,
            name: item.name,
            email: item.email,
            studentNumber: item.studentNumber,
            password: '',
            phone: item.phone || '',
            studyProgram: item.studyProgram || PRODI_OPTIONS[0],
            is_bem: !!item.user_bem,
            unitId: item.user_bem ? item.user_bem.unitId : (units[0]?.unitId || 0),
            position: item.user_bem ? item.user_bem.position : 'Staff',
        });
        setIsCreateOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUser) {
            put(`/admin/users/${editingUser.id}`, {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/users', {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengguna & Anggota BEM" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-transparent">
                {/* Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <Users className="h-7 w-7 text-blue-600" />
                            Manajemen Users & Anggota BEM
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola data akun pengguna MSPACE dan penugasan position Fungsionaris BEM.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <CsvUploadModal
                            title="Upload CSV Users & Anggota BEM"
                            description="Pilih target tabel (Users / Anggota BEM) dan unggah file CSV."
                            uploadUrl="/admin/users/import-csv"
                            templateUrl="/admin/users/template-csv"
                            exportUrl="/admin/users/export-csv"
                            tableOptions={[
                                { value: 'users', label: 'Tabel Users (Akun Pengguna)' },
                                { value: 'organizationMembers', label: 'Tabel Users BEM (Keanggotaan BEM)' },
                            ]}
                        />

                        <a href="/admin/users/export-csv" download>
                            <Button variant="outline" size="sm" className="gap-1 text-xs">
                                <Download className="h-3.5 w-3.5" />
                                Export CSV
                            </Button>
                        </a>

                        <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah User
                        </Button>
                    </div>
                </div>

                {/* Filter & Search */}
                <Card className="shadow-sm">
                    <CardContent className="p-4">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Cari name, username, email, atau NIM..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 text-sm"
                                />
                            </div>
                            <select
                                value={prodiFilter}
                                onChange={(e) => setProdiFilter(e.target.value)}
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="">Semua Prodi</option>
                                {PRODI_OPTIONS.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={bemFilter}
                                onChange={(e) => setBemFilter(e.target.value)}
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="">Semua Role</option>
                                <option value="true">Fungsionaris BEM</option>
                                <option value="false">User Umum</option>
                            </select>
                            <Button type="submit" variant="secondary" className="text-sm">
                                Cari
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card className="shadow-sm">
                    <CardHeader className="py-4 border-b">
                        <CardTitle className="text-base font-bold flex items-center justify-between">
                            <span>Daftar Users ({users.total})</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 text-xs uppercase font-semibold text-muted-foreground border-b">
                                    <tr>
                                        <th className="px-4 py-3">Nama & Username</th>
                                        <th className="px-4 py-3">NIM & Prodi</th>
                                        <th className="px-4 py-3">Kontak Email</th>
                                        <th className="px-4 py-3">Status BEM</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                                Tidak ada data pengguna ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.data.map((u) => (
                                            <tr key={u.id} className="hover:bg-muted/30 transition">
                                                <td className="px-4 py-3">
                                                    <p className="font-bold text-foreground">{u.name}</p>
                                                    <p className="text-xs text-muted-foreground">@{u.username}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="font-mono text-xs font-semibold">{u.studentNumber}</p>
                                                    <p className="text-xs text-muted-foreground">{u.studyProgram || 'Belum diisi'}</p>
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    <span className="flex items-center gap-1 text-foreground">
                                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                                        {u.email}
                                                    </span>
                                                    {u.phone && (
                                                        <span className="flex items-center gap-1 text-muted-foreground mt-0.5">
                                                            <Phone className="h-3 w-3" />
                                                            {u.phone}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {u.user_bem ? (
                                                        <div className="space-y-0.5">
                                                            <Badge className="bg-indigo-600 text-white gap-1 text-xs">
                                                                <ShieldCheck className="h-3 w-3" />
                                                                {u.user_bem.position}
                                                            </Badge>
                                                            <p className="text-xs text-muted-foreground font-medium">
                                                                {u.user_bem.birdept?.abbreviation || 'Birdept'}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <Badge variant="outline" className="text-xs text-muted-foreground">
                                                            User Umum
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditModal(u)}
                                                        className="h-8 w-8 p-0 text-[#9ec8ff] hover:text-white hover:bg-[#324879]"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(u.id)}
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

                {/* Create / Edit User Modal */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle className="font-bold text-xl">
                                {editingUser ? 'Edit User' : 'Tambah User Baru'}
                            </DialogTitle>
                            <DialogDescription>
                                Masukkan detail akun pengguna dan tentukan apakah terdaftar sebagai Fungsionaris BEM.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        placeholder="Contoh: Budi Santoso"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-xs text-red-300">{errors.name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        placeholder="Contoh: budi_santoso"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                    />
                                    {errors.username && <p className="text-xs text-red-300">{errors.username}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="budi@mail.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="text-xs text-red-300">{errors.email}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="studentNumber">NIM</Label>
                                    <Input
                                        id="studentNumber"
                                        placeholder="Contoh: G64190001"
                                        value={data.studentNumber}
                                        onChange={(e) => setData('studentNumber', e.target.value)}
                                    />
                                    {errors.studentNumber && <p className="text-xs text-red-300">{errors.studentNumber}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="password">
                                        Password {editingUser && <span className="text-xs text-muted-foreground">(Opsional)</span>}
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder={editingUser ? 'Kosongkan jika tidak diubah' : 'Minimal 6 karakter'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    {errors.password && <p className="text-xs text-red-300">{errors.password}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="phone">No Telepon / WA</Label>
                                    <Input
                                        id="phone"
                                        placeholder="08123456789"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    {errors.phone && <p className="text-xs text-red-300">{errors.phone}</p>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="studyProgram">Program Studi</Label>
                                <select
                                    id="studyProgram"
                                    value={data.studyProgram}
                                    onChange={(e) => setData('studyProgram', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    {PRODI_OPTIONS.map((p) => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                                {errors.studyProgram && <p className="text-xs text-red-300">{errors.studyProgram}</p>}
                            </div>

                            {/* Section BEM Role */}
                            <div className="rounded-xl border p-4 bg-muted/40 space-y-3">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_bem"
                                        checked={data.is_bem}
                                        onChange={(e) => setData('is_bem', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <Label htmlFor="is_bem" className="font-bold cursor-pointer">
                                        User ini adalah Fungsionaris / Anggota BEM
                                    </Label>
                                </div>

                                {data.is_bem && (
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="unitId">Biro / Departemen</Label>
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
                                            {errors.unitId && <p className="text-xs text-red-300">{errors.unitId}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="position">Jabatan BEM</Label>
                                            <Input
                                                id="position"
                                                placeholder="Contoh: Ketua Departemen, Staff Ahli"
                                                value={data.position}
                                                onChange={(e) => setData('position', e.target.value)}
                                            />
                                            {errors.position && <p className="text-xs text-red-300">{errors.position}</p>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {editingUser ? 'Simpan Perubahan' : 'Tambah User'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
