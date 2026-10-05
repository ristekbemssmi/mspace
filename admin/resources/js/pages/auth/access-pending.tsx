import { Head, Link } from '@inertiajs/react';
import { Clock3 } from 'lucide-react';

export default function AccessPending() {
    return <><Head title="Menunggu persetujuan" /><div className="text-center"><span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-[#fff6cb] text-[#7d6800]"><Clock3 size={30} /></span><h2 className="text-xl font-black">Akun Anda sudah dibuat</h2><p className="mt-3 text-sm leading-6 text-[#64759b]">Akses dashboard menunggu persetujuan admin. Kami akan menjaga akun Anda tetap terbatas sampai peran diberikan.</p><div className="mt-7 flex flex-col gap-3"><Link href="/settings/profile" className="rounded-xl bg-[#19243a] px-5 py-3 text-sm font-bold text-white">Lihat profil</Link><Link href="/logout" method="post" as="button" className="text-sm font-semibold text-[#324879] hover:underline">Keluar</Link></div></div></>;
}

AccessPending.layout = { title: 'Menunggu persetujuan', description: 'Akses pengelolaan akan aktif setelah admin menyetujui akun Anda.' };
