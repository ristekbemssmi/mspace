import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Account = { id: number; name: string; email: string; createdAt: string };
type UnitRequest = {
    id: number;
    requestedPosition: string;
    user: { name: string; email: string };
    requested_unit: { name: string; abbreviation: string };
};

export default function Approvals({
    accounts,
    unitRequests,
    unitRequestsAvailable,
}: {
    accounts: Account[];
    unitRequests: UnitRequest[];
    unitRequestsAvailable: boolean;
}) {
    const [roles, setRoles] = useState<Record<number, string>>({});
    const [busy, setBusy] = useState<string | null>(null);

    return (
        <>
            <Head title="Persetujuan akun dan birdept" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-black text-[#f4e06d]">
                        Persetujuan
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Tinjau akses akun dan permintaan birdept pengguna.
                    </p>
                </div>
                <section className="rounded-2xl border border-border bg-card p-5">
                    <h2 className="mb-3 text-xl font-bold text-[#f4e06d]">
                        Akun baru ({accounts.length})
                    </h2>
                    {accounts.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Tidak ada akun yang menunggu persetujuan.
                        </p>
                    ) : (
                        <div className="divide-y divide-border">
                            {accounts.map((account) => (
                                <div
                                    key={account.id}
                                    className="flex flex-wrap items-center justify-between gap-4 py-4"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {account.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {account.email}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <select
                                            aria-label={`Peran untuk ${account.name}`}
                                            value={
                                                roles[account.id] || 'viewer'
                                            }
                                            onChange={(event) =>
                                                setRoles({
                                                    ...roles,
                                                    [account.id]:
                                                        event.target.value,
                                                })
                                            }
                                            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="viewer">
                                                Viewer
                                            </option>
                                            <option value="editor">
                                                Editor
                                            </option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <Button
                                            disabled={
                                                busy === `account-${account.id}`
                                            }
                                            onClick={() => {
                                                setBusy(
                                                    `account-${account.id}`,
                                                );
                                                router.post(
                                                    `/admin/approvals/${account.id}`,
                                                    {
                                                        role:
                                                            roles[account.id] ||
                                                            'viewer',
                                                    },
                                                    {
                                                        onFinish: () =>
                                                            setBusy(null),
                                                    },
                                                );
                                            }}
                                        >
                                            Setujui
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
                <section className="rounded-2xl border border-border bg-card p-5">
                    <h2 className="mb-3 text-xl font-bold text-[#f4e06d]">
                        Permintaan birdept ({unitRequests.length})
                    </h2>
                    {!unitRequestsAvailable ? (
                        <p role="alert" className="text-sm text-amber-200">
                            Persetujuan birdept belum tersedia. Jalankan migrasi
                            database dashboard admin untuk mengaktifkannya.
                        </p>
                    ) : unitRequests.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Tidak ada perubahan birdept yang menunggu
                            persetujuan.
                        </p>
                    ) : (
                        <div className="divide-y divide-border">
                            {unitRequests.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-wrap items-center justify-between gap-4 py-4"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {item.user.name}{' '}
                                            <span className="font-normal text-muted-foreground">
                                                ({item.user.email})
                                            </span>
                                        </p>
                                        <p className="text-sm">
                                            Meminta{' '}
                                            {item.requested_unit.abbreviation} (
                                            {item.requested_unit.name}) sebagai{' '}
                                            {item.requestedPosition}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            disabled={
                                                busy === `unit-${item.id}`
                                            }
                                            onClick={() => {
                                                setBusy(`unit-${item.id}`);
                                                router.post(
                                                    `/admin/approvals/birdept/${item.id}`,
                                                    { decision: 'approve' },
                                                    {
                                                        onFinish: () =>
                                                            setBusy(null),
                                                    },
                                                );
                                            }}
                                        >
                                            Setujui
                                        </Button>
                                        <Button
                                            variant="outline"
                                            disabled={
                                                busy === `unit-${item.id}`
                                            }
                                            onClick={() => {
                                                setBusy(`unit-${item.id}`);
                                                router.post(
                                                    `/admin/approvals/birdept/${item.id}`,
                                                    { decision: 'reject' },
                                                    {
                                                        onFinish: () =>
                                                            setBusy(null),
                                                    },
                                                );
                                            }}
                                        >
                                            Tolak
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
