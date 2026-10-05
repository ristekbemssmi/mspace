import { Head, router, useForm } from '@inertiajs/react';
import { Download, Edit2, Megaphone, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
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
    publicVisits: number;
    uniqueVisitors: number;
    publishedAt?: string;
    category:
        | 'beasiswa'
        | 'kegiatan'
        | 'himpunan'
        | 'wisuda'
        | 'alumni'
        | 'magang'
        | 'proker'
        | 'lomba';
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
    lomba?: any;
    images?: { id: number; originalName: string; sortOrder: number }[];
}

interface PaginatedInformasi {
    data: InformasiItem[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Props {
    information: PaginatedInformasi;
    units: BirdeptOption[];
    users: UserOption[];
    filters: {
        search?: string;
        category?: string;
        status?: string;
        dateField?: string;
        dateFrom?: string;
        dateTo?: string;
        visitMetric?: string;
        visitsMin?: string;
        visitsMax?: string;
        sortBy?: string;
        sortDirection?: string;
    };
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
    { value: 'lomba', label: 'Lomba' },
];

const jakartaDateParts = (value: string) => {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(new Date(value));
    const get = (type: string) =>
        parts.find((part) => part.type === type)?.value || '';

    return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
};

const dateTimeInputValue = (value?: string) =>
    !value
        ? ''
        : /(?:Z|[+-]\d{2}:\d{2})$/.test(value)
          ? jakartaDateParts(value)
          : value.replace(' ', 'T').substring(0, 16);

const dateInputValue = (value?: string) =>
    !value
        ? ''
        : /(?:Z|[+-]\d{2}:\d{2})$/.test(value)
          ? jakartaDateParts(value).substring(0, 10)
          : value.substring(0, 10);

const MAX_ORIGINAL_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_UPLOAD_IMAGE_BYTES = 900 * 1024;

async function prepareImage(file: File): Promise<File> {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        throw new Error(`${file.name}: pilih gambar JPG, PNG, atau WebP.`);
    }

    if (file.size > MAX_ORIGINAL_IMAGE_BYTES) {
        throw new Error(`${file.name}: ukuran file asli maksimal 5 MB.`);
    }

    let bitmap: ImageBitmap;

    try {
        bitmap = await createImageBitmap(file);
    } catch {
        throw new Error(`${file.name}: gambar tidak dapat dibaca.`);
    }

    try {
        if (bitmap.width > 6000 || bitmap.height > 6000) {
            throw new Error(
                `${file.name}: ukuran gambar maksimal 6000 × 6000 piksel.`,
            );
        }

        for (const maxEdge of [1600, 1280, 1024, 800]) {
            const scale = Math.min(
                1,
                maxEdge / Math.max(bitmap.width, bitmap.height),
            );
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(bitmap.width * scale));
            canvas.height = Math.max(1, Math.round(bitmap.height * scale));
            const context = canvas.getContext('2d');

            if (!context) {
throw new Error('Browser tidak dapat memproses gambar.');
}

            context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

            for (const quality of [0.82, 0.7, 0.58, 0.45]) {
                const blob = await new Promise<Blob | null>((resolve) =>
                    canvas.toBlob(resolve, 'image/webp', quality),
                );

                if (blob?.type !== 'image/webp') {
throw new Error('Browser tidak mendukung konversi WebP.');
}

                if (blob.size <= MAX_UPLOAD_IMAGE_BYTES) {
                    const name = file.name.replace(/\.[^.]+$/, '') + '.webp';

                    return new File([blob], name, { type: 'image/webp' });
                }
            }
        }

        throw new Error(
            `${file.name}: gambar terlalu kompleks untuk dikompresi. Pilih gambar lain.`,
        );
    } finally {
        bitmap.close();
    }
}

export default function InformasiIndex({
    information,
    units,
    users,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [jenisFilter, setJenisFilter] = useState(filters.category || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [dateField, setDateField] = useState(
        filters.dateField || 'publishedAt',
    );
    const [dateFrom, setDateFrom] = useState(filters.dateFrom || '');
    const [dateTo, setDateTo] = useState(filters.dateTo || '');
    const [visitMetric, setVisitMetric] = useState(
        filters.visitMetric || 'publicVisits',
    );
    const [visitsMin, setVisitsMin] = useState(filters.visitsMin || '');
    const [visitsMax, setVisitsMax] = useState(filters.visitsMax || '');
    const [sortBy, setSortBy] = useState(filters.sortBy || 'publicVisits');
    const [sortDirection, setSortDirection] = useState(
        filters.sortDirection || 'desc',
    );
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingInfo, setEditingInfo] = useState<InformasiItem | null>(null);
    const [imagePreparing, setImagePreparing] = useState(false);
    const [imageError, setImageError] = useState('');
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        post,
        transform,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        unitId: units.length > 0 ? units[0].unitId : 0,
        unitIds: [] as number[],
        userId: users.length > 0 ? users[0].id : 0,
        title: '',
        description: '',
        source: '',
        status: 'published' as 'draft' | 'published' | 'archived',
        publishedAt: '',
        expiresAt: '',
        images: [] as File[],
        removeImageIds: [] as number[],
        category: 'beasiswa' as
            | 'beasiswa'
            | 'kegiatan'
            | 'himpunan'
            | 'wisuda'
            | 'alumni'
            | 'magang'
            | 'proker'
            | 'lomba',

        // Sub-Type Payload
        beasiswa: {
            organizer: '',
            opensOn: '',
            closesOn: '',
            posterUrl: '',
            instagramUrl: '',
            registrationUrl: '',
        },
        kegiatan: { eventAt: '', location: '', organizer: '' },
        himpunan: { name: '', contact: '' },
        wisuda: { graduationPeriod: '', registrationSteps: '' },
        alumni: { name: '', cohort: '', topic: '' },
        magang: { company: '', position: '', duration: '' },
        proker: {
            purpose: '',
            audience: '',
            startsOn: '',
            endsOn: '',
            priority: '' as number | '',
        },
        lomba: {
            organizer: '',
            registrationUrl: '',
            opensOn: '',
            closesOn: '',
        },
    });

    useEffect(() => {
        const urls = data.images.map((file) => URL.createObjectURL(file));
        setImagePreviews(urls);

        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [data.images]);

    const addImages = async (files: File[]) => {
        if (files.length === 0) {
return;
}

        const savedCount = (editingInfo?.images || []).filter(
            (image) => !data.removeImageIds.includes(image.id),
        ).length;

        if (savedCount + data.images.length + files.length > 5) {
            setImageError(
                'Maksimal 5 gambar. Hapus gambar lain sebelum menambahkan lagi.',
            );

            return;
        }

        setImageError('');
        setImagePreparing(true);

        try {
            const converted = await Promise.all(files.map(prepareImage));
            setData('images', [...data.images, ...converted]);
        } catch (error) {
            setImageError(
                error instanceof Error
                    ? error.message
                    : 'Gagal memproses gambar.',
            );
        } finally {
            setImagePreparing(false);
        }
    };

    const currentFilters = (category = jenisFilter) => ({
        search,
        category,
        status: statusFilter,
        dateField,
        dateFrom,
        dateTo,
        visitMetric,
        visitsMin,
        visitsMax,
        sortBy,
        sortDirection,
    });

    const rangeError =
        dateFrom && dateTo && dateTo < dateFrom
            ? 'Tanggal akhir harus sama atau setelah tanggal awal.'
            : visitsMin !== '' &&
                visitsMax !== '' &&
                Number(visitsMax) < Number(visitsMin)
              ? 'Maksimal kunjungan harus sama atau lebih besar dari minimal.'
              : '';
    const liveFilters = useLiveFilters(
        '/admin/informasi',
        currentFilters(),
        !rangeError,
    );
    const handleJenisTabClick = (value: string) => setJenisFilter(value);
    const resetFilters = () => {
        setSearch('');
        setJenisFilter('');
        setStatusFilter('');
        setDateField('publishedAt');
        setDateFrom('');
        setDateTo('');
        setVisitMetric('publicVisits');
        setVisitsMin('');
        setVisitsMax('');
        setSortBy('publicVisits');
        setSortDirection('desc');
    };
    const goToPage = (page: number) =>
        router.get(
            '/admin/informasi',
            { ...currentFilters(), page },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );

    const openCreateModal = () => {
        reset();
        clearErrors();
        setImageError('');
        setEditingInfo(null);
        setIsCreateOpen(true);
    };

    const openEditModal = (item: InformasiItem) => {
        clearErrors();
        setImageError('');
        setEditingInfo(item);
        setData({
            unitId: item.unitId,
            unitIds:
                item.category === 'proker'
                    ? (item.units || []).map((birdept) => birdept.unitId)
                    : [],
            userId: item.userId,
            title: item.title,
            description: item.description,
            source: item.source || '',
            status: item.status,
            publishedAt: dateTimeInputValue(item.publishedAt),
            expiresAt: dateInputValue(item.expiresAt),
            images: [],
            removeImageIds: [],
            category: item.category,

            beasiswa: item.beasiswa || {
                organizer: '',
                opensOn: '',
                closesOn: '',
                posterUrl: '',
                instagramUrl: '',
                registrationUrl: '',
            },
            kegiatan: item.kegiatan || {
                eventAt: '',
                location: '',
                organizer: '',
            },
            himpunan: item.himpunan || { name: '', contact: '' },
            wisuda: item.wisuda || {
                graduationPeriod: '',
                registrationSteps: '',
            },
            alumni: item.alumni || { name: '', cohort: '', topic: '' },
            magang: item.magang || { company: '', position: '', duration: '' },
            proker: {
                purpose: item.proker?.purpose || '',
                audience: item.proker?.audience || '',
                startsOn: item.proker?.startsOn || '',
                endsOn: item.proker?.endsOn || '',
                priority: item.proker?.priority ?? '',
            },
            lomba: {
                organizer: item.lomba?.organizer || '',
                registrationUrl: item.lomba?.registrationUrl || '',
                opensOn: dateInputValue(item.lomba?.opensOn),
                closesOn: dateInputValue(item.lomba?.closesOn),
            },
        });
        setIsCreateOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (imagePreparing) {
return;
}

        transform((form) => (editingInfo ? { ...form, _method: 'put' } : form));

        if (editingInfo) {
            post(`/admin/informasi/${editingInfo.id}`, {
                forceFormData: true,
                onSuccess: () => {
                    setIsCreateOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/informasi', {
                forceFormData: true,
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

    const activeImageCount =
        (editingInfo?.images || []).filter(
            (image) => !data.removeImageIds.includes(image.id),
        ).length + data.images.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Informasi & Beasiswa" />

            <div className="flex flex-1 flex-col gap-6 bg-transparent p-4 md:p-6">
                {/* Header Title */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight">
                            <Megaphone className="h-7 w-7 text-amber-500" />
                            Manajemen Informasi, Beasiswa & Kegiatan
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola konten publik Beasiswa, Kegiatan, Himpunan,
                            Wisuda, Alumni, Magang, dan Proker.
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
                                {
                                    value: 'information',
                                    label: 'Tabel Informasi Utama',
                                },
                                {
                                    value: 'scholarships',
                                    label: 'Sub-Tabel Detail Beasiswa',
                                },
                                {
                                    value: 'scholarshipRequirements',
                                    label: 'Sub-Tabel Syarat Beasiswa',
                                },
                                {
                                    value: 'scholarshipBenefits',
                                    label: 'Sub-Tabel Benefit Beasiswa',
                                },
                                {
                                    value: 'activities',
                                    label: 'Sub-Tabel Detail Kegiatan',
                                },
                                {
                                    value: 'studentAssociations',
                                    label: 'Sub-Tabel Detail Himpunan',
                                },
                                {
                                    value: 'graduations',
                                    label: 'Sub-Tabel Detail Wisuda',
                                },
                                {
                                    value: 'alumni',
                                    label: 'Sub-Tabel Detail Alumni',
                                },
                                {
                                    value: 'internships',
                                    label: 'Sub-Tabel Detail Magang',
                                },
                                {
                                    value: 'workPrograms',
                                    label: 'Sub-Tabel Detail Proker (Program Kerja)',
                                },
                                {
                                    value: 'competitions',
                                    label: 'Sub-Tabel Detail Lomba',
                                },
                                {
                                    value: 'workProgramCommittees',
                                    label: 'Sub-Tabel Panitia Program Kerja',
                                },
                            ]}
                        />

                        <a href="/admin/informasi/export-csv" download>
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
                            className="gap-2 bg-amber-600 text-white hover:bg-amber-700"
                        >
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
                            variant={
                                jenisFilter === tab.value
                                    ? 'default'
                                    : 'outline'
                            }
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
                        <form
                            onSubmit={(event) => event.preventDefault()}
                            className="grid gap-4"
                        >
                            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_200px]">
                                <div className="relative min-w-0 flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Cari judul, jenis, birdept, sumber, atau rincian..."
                                        aria-label="Cari semua atribut informasi"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="pl-9 text-sm"
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                <label className="grid min-w-0 gap-2 text-sm font-medium">
                                    Tanggal berdasarkan
                                    <select
                                        value={dateField}
                                        onChange={(e) =>
                                            setDateField(e.target.value)
                                        }
                                        className="w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="publishedAt">
                                            Terbit
                                        </option>
                                        <option value="expiresAt">
                                            Kedaluwarsa
                                        </option>
                                    </select>
                                </label>
                                <label className="grid min-w-0 gap-2 text-sm font-medium">
                                    Dari tanggal
                                    <Input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) =>
                                            setDateFrom(e.target.value)
                                        }
                                        className="min-w-0 text-sm"
                                    />
                                </label>
                                <label className="grid min-w-0 gap-2 text-sm font-medium">
                                    Sampai tanggal
                                    <Input
                                        type="date"
                                        value={dateTo}
                                        min={dateFrom || undefined}
                                        onChange={(e) =>
                                            setDateTo(e.target.value)
                                        }
                                        className="min-w-0 text-sm"
                                    />
                                </label>
                                <label className="grid min-w-0 gap-2 text-sm font-medium">
                                    Hitung kunjungan
                                    <select
                                        value={visitMetric}
                                        onChange={(e) =>
                                            setVisitMetric(e.target.value)
                                        }
                                        className="w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="publicVisits">
                                            Total kunjungan
                                        </option>
                                        <option value="uniqueVisitors">
                                            Pengunjung unik
                                        </option>
                                    </select>
                                </label>
                                <label className="grid min-w-0 gap-2 text-sm font-medium">
                                    Minimal kunjungan
                                    <Input
                                        type="number"
                                        min="0"
                                        value={visitsMin}
                                        onChange={(e) =>
                                            setVisitsMin(e.target.value)
                                        }
                                        className="min-w-0 text-sm"
                                    />
                                </label>
                                <label className="grid min-w-0 gap-2 text-sm font-medium">
                                    Maksimal kunjungan
                                    <Input
                                        type="number"
                                        min={visitsMin || '0'}
                                        value={visitsMax}
                                        onChange={(e) =>
                                            setVisitsMax(e.target.value)
                                        }
                                        className="min-w-0 text-sm"
                                    />
                                </label>
                                <label className="grid min-w-0 gap-2 text-sm font-medium">
                                    Urutkan berdasarkan
                                    <select
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(e.target.value)
                                        }
                                        className="w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="publicVisits">
                                            Total kunjungan
                                        </option>
                                        <option value="uniqueVisitors">
                                            Pengunjung unik
                                        </option>
                                        <option value="publishedAt">
                                            Tanggal terbit
                                        </option>
                                        <option value="expiresAt">
                                            Tanggal kedaluwarsa
                                        </option>
                                        <option value="createdAt">
                                            Tanggal dibuat
                                        </option>
                                        <option value="title">Judul</option>
                                        <option value="category">Jenis</option>
                                    </select>
                                </label>
                                <label className="grid min-w-0 gap-2 text-sm font-medium">
                                    Arah urutan
                                    <select
                                        value={sortDirection}
                                        onChange={(e) =>
                                            setSortDirection(e.target.value)
                                        }
                                        className="w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="desc">
                                            Terbesar / terbaru / Z–A
                                        </option>
                                        <option value="asc">
                                            Terkecil / terlama / A–Z
                                        </option>
                                    </select>
                                </label>
                            </div>
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="w-fit text-sm font-medium text-foreground underline underline-offset-2 hover:text-primary"
                            >
                                Reset semua filter
                            </button>
                        </form>
                        <p
                            role="status"
                            className="mt-3 text-sm text-muted-foreground"
                        >
                            {rangeError ||
                                liveFilters.error ||
                                (liveFilters.loading
                                    ? 'Memperbarui hasil...'
                                    : 'Pencarian dan filter diperbarui otomatis.')}
                        </p>
                    </CardContent>
                </Card>

                {/* Table Card */}
                <Card className="shadow-sm">
                    <CardHeader className="border-b py-4">
                        <CardTitle className="flex items-center justify-between text-base font-bold">
                            <span>Daftar Informasi ({information.total})</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-muted/50 text-xs font-semibold text-muted-foreground uppercase">
                                    <tr>
                                        <th className="px-4 py-3">
                                            Judul & Jenis
                                        </th>
                                        <th className="px-4 py-3">
                                            Penerbit (Birdept)
                                        </th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">
                                            Waktu Publikasi
                                        </th>
                                        <th className="px-4 py-3">
                                            Kedaluwarsa
                                        </th>
                                        <th className="px-4 py-3">
                                            Kunjungan publik
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {information.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-4 py-8 text-center text-muted-foreground"
                                            >
                                                Tidak ada data informasi
                                                ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        information.data.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="transition hover:bg-muted/30"
                                            >
                                                <td className="px-4 py-3">
                                                    <p className="leading-snug font-bold text-foreground">
                                                        {item.title}
                                                    </p>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px] capitalize"
                                                        >
                                                            {item.category}
                                                        </Badge>
                                                        {item.category ===
                                                            'proker' && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-[10px]"
                                                            >
                                                                {item.proker
                                                                    ?.priority ==
                                                                null
                                                                    ? 'Tanpa prioritas'
                                                                    : `Prioritas ${item.proker.priority}`}
                                                            </Badge>
                                                        )}
                                                        {item.source && (
                                                            <span className="max-w-[200px] truncate text-xs text-muted-foreground">
                                                                {item.source}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    <p className="font-semibold text-foreground">
                                                        {item.category ===
                                                            'proker' &&
                                                        item.units?.length
                                                            ? [
                                                                  item.birdept
                                                                      ?.abbreviation,
                                                                  ...item.units.map(
                                                                      (
                                                                          birdept,
                                                                      ) =>
                                                                          birdept.abbreviation,
                                                                  ),
                                                              ]
                                                                  .filter(
                                                                      Boolean,
                                                                  )
                                                                  .join(' + ')
                                                            : item.birdept
                                                                  ?.abbreviation ||
                                                              'Birdept'}
                                                    </p>
                                                    <p className="text-muted-foreground">
                                                        Oleh @
                                                        {item.user?.username ||
                                                            'admin'}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        className={
                                                            item.status ===
                                                            'published'
                                                                ? 'bg-emerald-600 text-white'
                                                                : item.status ===
                                                                    'draft'
                                                                  ? 'bg-amber-600 text-white'
                                                                  : 'bg-slate-600 text-white'
                                                        }
                                                    >
                                                        {item.status.toUpperCase()}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    {item.publishedAt
                                                        ? new Date(
                                                              item.publishedAt,
                                                          ).toLocaleString(
                                                              'id-ID',
                                                              {
                                                                  day: 'numeric',
                                                                  month: 'short',
                                                                  year: 'numeric',
                                                                  hour: '2-digit',
                                                                  minute: '2-digit',
                                                                  timeZone:
                                                                      'Asia/Jakarta',
                                                              },
                                                          )
                                                        : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    {item.expiresAt
                                                        ? new Date(
                                                              item.expiresAt,
                                                          ).toLocaleDateString(
                                                              'id-ID',
                                                              {
                                                                  day: 'numeric',
                                                                  month: 'short',
                                                                  year: 'numeric',
                                                                  timeZone:
                                                                      'Asia/Jakarta',
                                                              },
                                                          )
                                                        : '-'}
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
                        <nav
                            aria-label="Pagination informasi"
                            className="flex flex-wrap items-center justify-between gap-4 border-t p-4"
                        >
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {information.from ?? 0} sampai{' '}
                                {information.to ?? 0} dari {information.total}{' '}
                                informasi
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        liveFilters.pending ||
                                        information.current_page <= 1
                                    }
                                    onClick={() =>
                                        goToPage(information.current_page - 1)
                                    }
                                >
                                    Sebelumnya
                                </Button>
                                {Array.from(
                                    new Set([
                                        1,
                                        ...Array.from(
                                            { length: 5 },
                                            (_, i) =>
                                                information.current_page +
                                                i -
                                                2,
                                        ),
                                        information.last_page,
                                    ]),
                                )
                                    .filter(
                                        (page) =>
                                            page >= 1 &&
                                            page <= information.last_page,
                                    )
                                    .sort((a, b) => a - b)
                                    .map((page, index, pages) => (
                                        <React.Fragment key={page}>
                                            {index > 0 &&
                                                page - pages[index - 1] > 1 && (
                                                    <span aria-hidden="true">
                                                        ...
                                                    </span>
                                                )}
                                            <Button
                                                size="sm"
                                                variant={
                                                    page ===
                                                    information.current_page
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                aria-label={'Halaman ' + page}
                                                aria-current={
                                                    page ===
                                                    information.current_page
                                                        ? 'page'
                                                        : undefined
                                                }
                                                disabled={
                                                    liveFilters.pending ||
                                                    page ===
                                                        information.current_page
                                                }
                                                onClick={() => goToPage(page)}
                                            >
                                                {page}
                                            </Button>
                                        </React.Fragment>
                                    ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        liveFilters.pending ||
                                        information.current_page >=
                                            information.last_page
                                    }
                                    onClick={() =>
                                        goToPage(information.current_page + 1)
                                    }
                                >
                                    Berikutnya
                                </Button>
                            </div>
                        </nav>
                    </CardContent>
                </Card>

                {/* Create / Edit Form Modal */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">
                                {editingInfo
                                    ? 'Edit Informasi'
                                    : 'Tambah Informasi Baru'}
                            </DialogTitle>
                            <DialogDescription>
                                Masukkan rincian artikel informasi dan pilih
                                tipe spesifiknya.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 py-2"
                        >
                            <div className="space-y-1.5">
                                <Label htmlFor="title">Judul Informasi</Label>
                                <Input
                                    id="title"
                                    placeholder="Contoh: Pendaftaran Beasiswa MSPACE 2026"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                />
                                {errors.title && (
                                    <p className="text-xs text-red-300">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="category">
                                        Jenis Informasi
                                    </Label>
                                    <select
                                        id="category"
                                        value={data.category}
                                        onChange={(e) =>
                                            setData(
                                                'category',
                                                e.target.value as any,
                                            )
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                    >
                                        {JENIS_INFORMASI_LIST.map((opt) => (
                                            <option
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="text-xs text-red-300">
                                            {errors.category}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="status">
                                        Status Publikasi
                                    </Label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData(
                                                'status',
                                                e.target.value as any,
                                            )
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                    >
                                        <option value="published">
                                            Published
                                        </option>
                                        <option value="draft">Draft</option>
                                        <option value="archived">
                                            Archived
                                        </option>
                                    </select>
                                    {errors.status && (
                                        <p className="text-xs text-red-300">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="publishedAt">
                                        Waktu publikasi
                                    </Label>
                                    <Input
                                        id="publishedAt"
                                        type="datetime-local"
                                        value={data.publishedAt}
                                        onChange={(e) =>
                                            setData(
                                                'publishedAt',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <p className="text-xs text-white/70">
                                        Kosongkan untuk terbit sekarang saat
                                        status Published.
                                    </p>
                                    {errors.publishedAt && (
                                        <p className="text-xs text-red-300">
                                            {errors.publishedAt}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="expiresAt">
                                        Tanggal kedaluwarsa
                                    </Label>
                                    <Input
                                        id="expiresAt"
                                        type="date"
                                        value={data.expiresAt}
                                        onChange={(e) =>
                                            setData('expiresAt', e.target.value)
                                        }
                                    />
                                    <p className="text-xs text-white/70">
                                        Informasi tetap tampil sampai akhir
                                        tanggal ini.
                                    </p>
                                    {errors.expiresAt && (
                                        <p className="text-xs text-red-300">
                                            {errors.expiresAt}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="unitId">
                                        {data.category === 'proker'
                                            ? 'Biro / Departemen Utama'
                                            : 'Biro / Departemen Penanggung Jawab'}
                                    </Label>
                                    <select
                                        id="unitId"
                                        value={data.unitId}
                                        onChange={(e) =>
                                            setData(
                                                'unitId',
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                    >
                                        {units.map((b) => (
                                            <option
                                                key={b.unitId}
                                                value={b.unitId}
                                            >
                                                {b.abbreviation} ({b.name})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.unitId && (
                                        <p className="text-xs text-red-300">
                                            {errors.unitId}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="userId">User Pembuat</Label>
                                    <select
                                        id="userId"
                                        value={data.userId}
                                        onChange={(e) =>
                                            setData(
                                                'userId',
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                    >
                                        {users.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name} (@{u.username})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.userId && (
                                        <p className="text-xs text-red-300">
                                            {errors.userId}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {data.category === 'proker' && (
                                <fieldset className="rounded-xl border border-[#607397] p-4">
                                    <legend className="px-2 text-sm font-bold text-[#f4e06d]">
                                        Birdept kolaborator
                                    </legend>
                                    <p className="mb-3 text-xs text-white/75">
                                        Pilih biro atau departemen lain yang
                                        ikut menangani proker ini. Birdept utama
                                        selalu tercatat.
                                    </p>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {units
                                            .filter(
                                                (birdept) =>
                                                    birdept.unitId !==
                                                    data.unitId,
                                            )
                                            .map((birdept) => (
                                                <label
                                                    key={birdept.unitId}
                                                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="accent-[#f4e06d]"
                                                        checked={data.unitIds.includes(
                                                            birdept.unitId,
                                                        )}
                                                        onChange={(event) =>
                                                            setData(
                                                                'unitIds',
                                                                event.target
                                                                    .checked
                                                                    ? [
                                                                          ...data.unitIds,
                                                                          birdept.unitId,
                                                                      ]
                                                                    : data.unitIds.filter(
                                                                          (
                                                                              id,
                                                                          ) =>
                                                                              id !==
                                                                              birdept.unitId,
                                                                      ),
                                                            )
                                                        }
                                                    />
                                                    <span>
                                                        {birdept.abbreviation} (
                                                        {birdept.name})
                                                    </span>
                                                </label>
                                            ))}
                                    </div>
                                    {errors.unitIds && (
                                        <p className="mt-2 text-xs text-red-300">
                                            {errors.unitIds}
                                        </p>
                                    )}
                                </fieldset>
                            )}

                            <div className="space-y-1.5">
                                <Label htmlFor="source">
                                    Sumber Informasi (Link / Institusi)
                                </Label>
                                <Input
                                    id="source"
                                    placeholder="https://..."
                                    value={data.source}
                                    onChange={(e) =>
                                        setData('source', e.target.value)
                                    }
                                />
                                {errors.source && (
                                    <p className="text-xs text-red-300">
                                        {errors.source}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description">
                                    Deskripsi / Isi Informasi
                                </Label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    placeholder="Tuliskan isi informasi secara lengkap..."
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

                            <div className="space-y-4 rounded-xl border border-white/20 bg-white/5 p-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                        <p className="font-semibold text-white">
                                            Dokumentasi gambar
                                        </p>
                                        <p className="text-xs text-white/70">
                                            {activeImageCount}/5 gambar · Gambar
                                            pertama tampil di SSMI News
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            imageInputRef.current?.click()
                                        }
                                        disabled={
                                            imagePreparing ||
                                            activeImageCount >= 5
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg bg-[#F4E06D] px-3 py-2 text-sm font-semibold text-[#1D2B44] hover:bg-[#ffe980] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Plus className="h-4 w-4" /> Tambahkan
                                        gambar
                                    </button>
                                    <input
                                        ref={imageInputRef}
                                        id="images"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        multiple
                                        className="sr-only"
                                        onChange={(event) => {
                                            const files = Array.from(
                                                event.currentTarget.files || [],
                                            );
                                            event.currentTarget.value = '';
                                            void addImages(files);
                                        }}
                                    />
                                </div>
                                {(editingInfo?.images?.length || 0) +
                                    data.images.length >
                                0 ? (
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {editingInfo?.images?.map((image) => {
                                            const removing =
                                                data.removeImageIds.includes(
                                                    image.id,
                                                );

                                            return (
                                                <div
                                                    key={`saved-${image.id}`}
                                                    className={`relative overflow-hidden rounded-xl border border-white/20 bg-[#1D2B44] ${removing ? 'opacity-50' : ''}`}
                                                >
                                                    <img
                                                        src={`/admin/informasi/media/${image.id}`}
                                                        alt={image.originalName}
                                                        className="h-28 w-full object-cover"
                                                    />
                                                    <span className="absolute top-2 left-2 rounded bg-[#1D2B44]/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                                                        Tersimpan
                                                    </span>
                                                    <div className="flex items-center gap-1 p-2">
                                                        <span
                                                            className="min-w-0 flex-1 truncate text-xs text-white"
                                                            title={
                                                                image.originalName
                                                            }
                                                        >
                                                            {image.originalName}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            aria-label={
                                                                removing
                                                                    ? `Batalkan hapus ${image.originalName}`
                                                                    : `Hapus ${image.originalName}`
                                                            }
                                                            title={
                                                                removing
                                                                    ? 'Batalkan hapus'
                                                                    : 'Hapus gambar'
                                                            }
                                                            onClick={() =>
                                                                setData(
                                                                    'removeImageIds',
                                                                    removing
                                                                        ? data.removeImageIds.filter(
                                                                              (
                                                                                  id,
                                                                              ) =>
                                                                                  id !==
                                                                                  image.id,
                                                                          )
                                                                        : [
                                                                              ...data.removeImageIds,
                                                                              image.id,
                                                                          ],
                                                                )
                                                            }
                                                            className="rounded p-1.5 text-[#F4E06D] hover:bg-white/10"
                                                        >
                                                            {removing ? (
                                                                <span className="text-xs font-bold">
                                                                    Batal
                                                                </span>
                                                            ) : (
                                                                <Trash2 className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    {removing && (
                                                        <p className="px-2 pb-2 text-xs text-white">
                                                            Akan dihapus saat
                                                            disimpan
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {data.images.map((file, index) => (
                                            <div
                                                key={`new-${index}-${file.name}`}
                                                className="relative overflow-hidden rounded-xl border border-[#F4E06D]/50 bg-[#1D2B44]"
                                            >
                                                {imagePreviews[index] ? (
                                                    <img
                                                        src={
                                                            imagePreviews[index]
                                                        }
                                                        alt={`Pratinjau ${file.name}`}
                                                        className="h-28 w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-28 bg-[#253D6D]" />
                                                )}
                                                <span className="absolute top-2 left-2 rounded bg-[#F4E06D] px-2 py-0.5 text-[10px] font-semibold text-[#1D2B44]">
                                                    Baru
                                                </span>
                                                <div className="flex items-center gap-1 p-2">
                                                    <span
                                                        className="min-w-0 flex-1 truncate text-xs text-white"
                                                        title={file.name}
                                                    >
                                                        {file.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        aria-label={`Hapus ${file.name}`}
                                                        title="Hapus gambar"
                                                        onClick={() =>
                                                            setData(
                                                                'images',
                                                                data.images.filter(
                                                                    (
                                                                        _,
                                                                        fileIndex,
                                                                    ) =>
                                                                        fileIndex !==
                                                                        index,
                                                                ),
                                                            )
                                                        }
                                                        className="rounded p-1.5 text-red-300 hover:bg-white/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="rounded-lg border border-dashed border-white/20 px-4 py-7 text-center text-sm text-white/65">
                                        Belum ada gambar dokumentasi.
                                    </p>
                                )}
                                <p className="text-xs text-white/70">
                                    JPG, PNG, atau WebP asli maksimal 5 MB.
                                    Gambar otomatis diperkecil ke WebP sebelum
                                    diunggah. Perubahan berlaku setelah menekan
                                    Simpan Perubahan.
                                </p>
                                {imagePreparing && (
                                    <p className="text-sm text-[#F4E06D]">
                                        Memproses gambar...
                                    </p>
                                )}
                                {imageError && (
                                    <p
                                        role="alert"
                                        className="text-xs text-red-300"
                                    >
                                        {imageError}
                                    </p>
                                )}
                                {(errors.images ||
                                    Object.entries(errors).find(([key]) =>
                                        key.startsWith('images.'),
                                    )?.[1]) && (
                                    <p
                                        role="alert"
                                        className="text-xs text-red-300"
                                    >
                                        {errors.images ||
                                            Object.entries(errors).find(
                                                ([key]) =>
                                                    key.startsWith('images.'),
                                            )?.[1]}
                                    </p>
                                )}
                            </div>

                            {/* Dynamic Sub-Type Form Fields */}
                            {data.category === 'lomba' && (
                                <div className="space-y-4 rounded-xl border border-[#607397] p-4">
                                    <h4 className="text-sm font-bold text-[#F4E06D]">
                                        Rincian Lomba
                                    </h4>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="lomba-organizer">
                                                Penyelenggara
                                            </Label>
                                            <Input
                                                id="lomba-organizer"
                                                value={data.lomba.organizer}
                                                onChange={(event) =>
                                                    setData('lomba', {
                                                        ...data.lomba,
                                                        organizer:
                                                            event.target.value,
                                                    })
                                                }
                                                placeholder="Nama penyelenggara"
                                            />
                                            {(errors as Record<string, string>)[
                                                'lomba.organizer'
                                            ] && (
                                                <p className="text-xs text-red-300">
                                                    {
                                                        (
                                                            errors as Record<
                                                                string,
                                                                string
                                                            >
                                                        )['lomba.organizer']
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="lomba-registration">
                                                Tautan pendaftaran
                                            </Label>
                                            <Input
                                                id="lomba-registration"
                                                type="url"
                                                value={
                                                    data.lomba.registrationUrl
                                                }
                                                onChange={(event) =>
                                                    setData('lomba', {
                                                        ...data.lomba,
                                                        registrationUrl:
                                                            event.target.value,
                                                    })
                                                }
                                                placeholder="https://..."
                                            />
                                            {(errors as Record<string, string>)[
                                                'lomba.registrationUrl'
                                            ] && (
                                                <p className="text-xs text-red-300">
                                                    {
                                                        (
                                                            errors as Record<
                                                                string,
                                                                string
                                                            >
                                                        )[
                                                            'lomba.registrationUrl'
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="lomba-opens">
                                                Pendaftaran dibuka
                                            </Label>
                                            <Input
                                                id="lomba-opens"
                                                type="date"
                                                value={data.lomba.opensOn}
                                                onChange={(event) =>
                                                    setData('lomba', {
                                                        ...data.lomba,
                                                        opensOn:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                            {(errors as Record<string, string>)[
                                                'lomba.opensOn'
                                            ] && (
                                                <p className="text-xs text-red-300">
                                                    {
                                                        (
                                                            errors as Record<
                                                                string,
                                                                string
                                                            >
                                                        )['lomba.opensOn']
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="lomba-closes">
                                                Pendaftaran ditutup
                                            </Label>
                                            <Input
                                                id="lomba-closes"
                                                type="date"
                                                value={data.lomba.closesOn}
                                                onChange={(event) =>
                                                    setData('lomba', {
                                                        ...data.lomba,
                                                        closesOn:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                            {(errors as Record<string, string>)[
                                                'lomba.closesOn'
                                            ] && (
                                                <p className="text-xs text-red-300">
                                                    {
                                                        (
                                                            errors as Record<
                                                                string,
                                                                string
                                                            >
                                                        )['lomba.closesOn']
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {data.category === 'proker' && (
                                <div className="space-y-2 rounded-xl border border-[#607397] p-4">
                                    <Label htmlFor="proker-priority">
                                        Prioritas Program Kerja
                                    </Label>
                                    <Input
                                        id="proker-priority"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={data.proker.priority}
                                        onChange={(event) =>
                                            setData('proker', {
                                                ...data.proker,
                                                priority:
                                                    event.target.value === ''
                                                        ? ''
                                                        : Number(
                                                              event.target
                                                                  .value,
                                                          ),
                                            })
                                        }
                                        placeholder="1"
                                        className="max-w-40"
                                    />
                                    <p className="text-xs text-white/70">
                                        Angka 1 paling penting. Kosongkan jika
                                        proker tidak memiliki prioritas khusus.
                                    </p>
                                    {(errors as Record<string, string>)[
                                        'proker.priority'
                                    ] && (
                                        <p
                                            role="alert"
                                            className="text-xs text-red-300"
                                        >
                                            {
                                                (
                                                    errors as Record<
                                                        string,
                                                        string
                                                    >
                                                )['proker.priority']
                                            }
                                        </p>
                                    )}
                                </div>
                            )}
                            {data.category === 'beasiswa' && (
                                <div className="space-y-3 rounded-xl border bg-amber-50/40 p-4 dark:bg-amber-950/20">
                                    <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">
                                        Rincian Detail Beasiswa
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <Label>Penyelenggara</Label>
                                            <Input
                                                placeholder="Kemendikbud"
                                                value={
                                                    data.beasiswa?.organizer ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setData('beasiswa', {
                                                        ...data.beasiswa,
                                                        organizer:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Link Pendaftaran</Label>
                                            <Input
                                                placeholder="https://bit.ly/daftar"
                                                value={
                                                    data.beasiswa
                                                        ?.registrationUrl || ''
                                                }
                                                onChange={(e) =>
                                                    setData('beasiswa', {
                                                        ...data.beasiswa,
                                                        registrationUrl:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Link Poster</Label>
                                            <Input
                                                placeholder="https://..."
                                                value={
                                                    data.beasiswa?.posterUrl ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setData('beasiswa', {
                                                        ...data.beasiswa,
                                                        posterUrl:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Link Instagram</Label>
                                            <Input
                                                placeholder="https://..."
                                                value={
                                                    data.beasiswa
                                                        ?.instagramUrl || ''
                                                }
                                                onChange={(e) =>
                                                    setData('beasiswa', {
                                                        ...data.beasiswa,
                                                        instagramUrl:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.category === 'kegiatan' && (
                                <div className="space-y-3 rounded-xl border bg-blue-50/40 p-4 dark:bg-blue-950/20">
                                    <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300">
                                        Rincian Detail Kegiatan
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <Label>Lokasi</Label>
                                            <Input
                                                placeholder="Aula FMIPA IPB"
                                                value={
                                                    data.kegiatan?.location ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setData('kegiatan', {
                                                        ...data.kegiatan,
                                                        location:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Penyelenggara</Label>
                                            <Input
                                                placeholder="Biro Riset & Teknologi"
                                                value={
                                                    data.kegiatan?.organizer ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setData('kegiatan', {
                                                        ...data.kegiatan,
                                                        organizer:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                    disabled={processing || imagePreparing}
                                    className="bg-amber-600 text-white hover:bg-amber-700"
                                >
                                    {editingInfo
                                        ? 'Simpan Perubahan'
                                        : 'Tambah Informasi'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
