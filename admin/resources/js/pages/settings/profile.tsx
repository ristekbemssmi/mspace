import { Form, Head, Link, useForm } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

type Unit = { unitId: number; name: string; abbreviation: string };
type ProfileData = {
    name: string;
    email: string;
    username: string;
    studentNumber: string | null;
    phone: string | null;
    studyProgram: string | null;
    email_verified_at: string | null;
    birdept: Unit | null;
    position: string | null;
    unitRequest: {
        requestedUnitId: number;
        requestedPosition: string;
        status: string;
        unitName: string;
    } | null;
};

export default function Profile({
    mustVerifyEmail,
    unitRequestsAvailable,
    status,
    profile,
    units,
}: {
    mustVerifyEmail: boolean;
    unitRequestsAvailable: boolean;
    status?: string;
    profile: ProfileData;
    units: Unit[];
}) {
    const unitForm = useForm({
        requestedUnitId:
            profile.unitRequest?.status === 'pending'
                ? profile.unitRequest.requestedUnitId
                : (profile.birdept?.unitId ?? 0),
        requestedPosition:
            profile.unitRequest?.status === 'pending'
                ? profile.unitRequest.requestedPosition
                : (profile.position ?? ''),
    });

    return (
        <>
            <Head title="Profil saya" />
            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Informasi profil"
                    description="Lengkapi data akun Anda. Perubahan birdept perlu persetujuan Admin."
                />
                <Form
                    {...ProfileController.update.form()}
                    options={{ preserveScroll: true }}
                    className="space-y-5"
                >
                    {({ processing, recentlySuccessful, errors }) => (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama lengkap</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={profile.name}
                                        required
                                        autoComplete="name"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        defaultValue={profile.username}
                                        required
                                    />
                                    <InputError message={errors.username} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Alamat email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={profile.email}
                                    required
                                    autoComplete="email"
                                />
                                <InputError message={errors.email} />
                            </div>
                            {mustVerifyEmail &&
                                profile.email_verified_at === null && (
                                    <div className="text-sm text-amber-200">
                                        Email belum terverifikasi.{' '}
                                        <Link
                                            href={send()}
                                            method="post"
                                            as="button"
                                            className="font-semibold underline"
                                        >
                                            Kirim ulang tautan verifikasi
                                        </Link>
                                    </div>
                                )}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="studentNumber">NIM</Label>
                                    <Input
                                        id="studentNumber"
                                        name="studentNumber"
                                        defaultValue={
                                            profile.studentNumber ?? ''
                                        }
                                    />
                                    <InputError
                                        message={errors.studentNumber}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">
                                        No. telepon / WhatsApp
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        defaultValue={profile.phone ?? ''}
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="studyProgram">
                                    Program studi
                                </Label>
                                <Input
                                    id="studyProgram"
                                    name="studyProgram"
                                    defaultValue={profile.studyProgram ?? ''}
                                />
                                <InputError message={errors.studyProgram} />
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Button disabled={processing}>
                                    Simpan profil
                                </Button>
                                {recentlySuccessful && (
                                    <span
                                        role="status"
                                        className="text-sm text-emerald-200"
                                    >
                                        Profil tersimpan.
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <div className="space-y-4 border-t border-border pt-6">
                <Heading
                    variant="small"
                    title="Birdept dan jabatan"
                    description="Birdept yang aktif menentukan akses editor. Permintaan baru berlaku setelah disetujui Admin."
                />
                <p className="text-sm text-muted-foreground">
                    Saat ini:{' '}
                    {profile.birdept
                        ? `${profile.birdept.abbreviation} (${profile.birdept.name}) - ${profile.position}`
                        : 'Belum terhubung ke birdept.'}
                </p>
                {profile.unitRequest && (
                    <p
                        role="status"
                        className="rounded-lg border border-border bg-muted p-3 text-sm"
                    >
                        Pengajuan {profile.unitRequest.unitName} sebagai{' '}
                        {profile.unitRequest.requestedPosition}:{' '}
                        {profile.unitRequest.status === 'pending'
                            ? 'menunggu persetujuan'
                            : profile.unitRequest.status === 'approved'
                              ? 'disetujui'
                              : 'ditolak'}
                        .
                    </p>
                )}
                {!unitRequestsAvailable && (
                    <p role="alert" className="text-sm text-amber-200">
                        Pengajuan perubahan birdept sementara belum tersedia.
                        Hubungi Admin.
                    </p>
                )}
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        unitForm.post('/settings/profile/birdept-request', {
                            preserveScroll: true,
                        });
                    }}
                    className="space-y-4"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="requestedUnitId">
                                Birdept yang diajukan
                            </Label>
                            <select
                                id="requestedUnitId"
                                value={unitForm.data.requestedUnitId}
                                onChange={(event) =>
                                    unitForm.setData(
                                        'requestedUnitId',
                                        Number(event.target.value),
                                    )
                                }
                                className="min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value={0}>Pilih birdept</option>
                                {units.map((unit) => (
                                    <option
                                        key={unit.unitId}
                                        value={unit.unitId}
                                    >
                                        {unit.abbreviation} ({unit.name})
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={unitForm.errors.requestedUnitId}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="requestedPosition">
                                Jabatan BEM
                            </Label>
                            <Input
                                id="requestedPosition"
                                value={unitForm.data.requestedPosition}
                                onChange={(event) =>
                                    unitForm.setData(
                                        'requestedPosition',
                                        event.target.value,
                                    )
                                }
                                placeholder="Contoh: Staf"
                            />
                            <InputError
                                message={unitForm.errors.requestedPosition}
                            />
                        </div>
                    </div>
                    <Button disabled={unitForm.processing || !unitRequestsAvailable}>
                        Ajukan perubahan birdept
                    </Button>
                </form>
            </div>

            <div className="space-y-4 border-t border-border pt-6">
                <Heading
                    variant="small"
                    title="Ganti password"
                    description="Tautan pengaturan password dikirim ke email akun Anda."
                />
                <Form
                    {...SecurityController.sendResetLink.form()}
                    options={{ preserveScroll: true }}
                >
                    {({ processing, errors }) => (
                        <div className="space-y-3">
                            <Button disabled={processing}>
                                Kirim tautan ganti password
                            </Button>
                            <InputError message={errors.email} />
                        </div>
                    )}
                </Form>
                {status && (
                    <p role="status" className="text-sm text-emerald-200">
                        {status}
                    </p>
                )}
            </div>
            <DeleteUser />
        </>
    );
}

Profile.layout = { breadcrumbs: [{ title: 'Profil saya', href: edit() }] };
