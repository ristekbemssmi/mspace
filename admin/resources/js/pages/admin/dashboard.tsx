import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Building2, Eye, FileSpreadsheet, HelpCircle, Megaphone, Users } from 'lucide-react';
import { VisitChart, type VisitSeries } from '@/components/visit-chart';
import type { Auth } from '@/types';

type Stats = { total_birdept: number; total_users: number; total_users_bem: number; total_informasi: number; total_faqs: number; visitors: number; views: number; visitorsToday: number };
type Informasi = { id: number; title: string; category: string; status: string; birdept?: { abbreviation: string } };
type RecentUser = { id: number; name: string; email: string };
type PopularInformation = { id: number; title: string; category: string; views: number; visitors: number };
type PopularUnit = { unitId: number; name: string; abbreviation: string; views: number; visitors: number };
type Props = { stats: Stats; recent_informasi: Informasi[]; recent_users: RecentUser[]; visit_series: VisitSeries; top_information: PopularInformation[]; top_units: PopularUnit[] };

export default function AdminDashboard({ stats, recent_informasi, recent_users, visit_series, top_information, top_units }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const role = auth.user?.adminRole;
    const cards = [
        { label: 'Informasi', value: stats.total_informasi, icon: Megaphone, href: '/admin/informasi' },
        { label: 'Biro & departemen', value: stats.total_birdept, icon: Building2, href: '/admin/birdept' },
        { label: 'FAQ', value: stats.total_faqs, icon: HelpCircle, href: '/admin/faqs' },
        ...(role === 'admin' ? [{ label: 'Pengguna', value: stats.total_users, icon: Users, href: '/admin/users' }] : []),
    ];

    return <>
        <Head title="Pusat Kendali" />
        <section className="relative overflow-hidden rounded-[28px] border border-white/15 bg-linear-to-br from-[#324879] to-[#19243a] px-7 py-9 text-white shadow-xl sm:px-10 lg:py-12">
            <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full border-[55px] border-[#f4e06d]/10" />
            <div className="absolute -bottom-28 right-36 h-44 w-44 rounded-full bg-[#f4e06d]/10" />
            <div className="relative z-10 max-w-2xl">
                <p className="mb-5 inline-block rounded-full bg-[#f4e06d] px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#19243a]">Pusat Kendali M-SPACE</p>
                <h1 className="text-3xl font-black leading-tight tracking-tight text-[#f4e06d] sm:text-4xl">Selamat datang, {auth.user?.name?.split(' ')[0] || 'Admin'}.</h1>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/85 sm:text-base">Pantau dan kelola informasi mahasiswa dari satu ruang kerja yang lebih rapi.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                    <Link href="/admin/informasi" className="inline-flex items-center gap-2 rounded-full bg-[#f4e06d] px-5 py-2.5 text-sm font-bold text-[#19243a] transition hover:bg-[#ffe97d]">Kelola informasi <ArrowRight size={16} /></Link>
                    {role === 'admin' && <Link href="/admin/csv-hub" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"><FileSpreadsheet size={16} /> Impor data</Link>}
                </div>
            </div>
        </section>

        <section aria-label="Ringkasan pengunjung publik" className="mt-7 grid gap-4 sm:grid-cols-3">
            {[
                { label: 'Pengunjung unik', value: stats.visitors, detail: 'Sejak pencatatan dimulai', icon: Users },
                { label: 'Tayangan halaman', value: stats.views, detail: 'Seluruh halaman publik', icon: Eye },
                { label: 'Pengunjung hari ini', value: stats.visitorsToday, detail: 'Waktu Jakarta', icon: Users },
            ].map(({ label, value, detail, icon: Icon }) => <div key={label} className="rounded-2xl border border-[#f4e06d]/25 bg-[#253657] p-5 text-white shadow-sm">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4e06d]/15 text-[#f4e06d]"><Icon size={20} /></span>
                <strong className="mt-4 block text-3xl font-black tabular-nums">{value.toLocaleString('id-ID')}</strong>
                <span className="mt-1 block text-sm font-semibold">{label}</span>
                <span className="mt-1 block text-xs text-white/60">{detail}</span>
            </div>)}
        </section>

        <VisitChart series={visit_series} />

        <section aria-label="Halaman terpopuler" className="mt-7 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/20 bg-[#253657] p-6 text-white shadow-sm">
                <h2 className="text-xl font-black text-[#f4e06d]">Informasi paling banyak dikunjungi</h2>
                <p className="mt-1 text-sm text-white/70">Berdasarkan kunjungan halaman detail publik</p>
                {top_information.length ? <ol className="mt-5 divide-y divide-white/15">{top_information.map((item, index) => <li key={item.id} className="flex items-center gap-3 py-3">
                    <span className="w-6 text-sm font-black text-[#f4e06d]">{index + 1}.</span>
                    <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{item.title}</span><span className="text-xs capitalize text-white/60">{item.category} · {item.visitors} pengunjung</span></span>
                    <strong className="shrink-0 text-sm tabular-nums">{item.views} tayangan</strong>
                </li>)}</ol> : <p className="mt-5 text-sm text-white/70">Belum ada kunjungan ke informasi.</p>}
            </div>
            <div className="rounded-2xl border border-white/20 bg-[#253657] p-6 text-white shadow-sm">
                <h2 className="text-xl font-black text-[#f4e06d]">Biro/departemen terpopuler</h2>
                <p className="mt-1 text-sm text-white/70">Berdasarkan kunjungan halaman biro/departemen publik</p>
                {top_units.length ? <ol className="mt-5 divide-y divide-white/15">{top_units.map((item, index) => <li key={item.unitId} className="flex items-center gap-3 py-3">
                    <span className="w-6 text-sm font-black text-[#f4e06d]">{index + 1}.</span>
                    <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{item.name}</span><span className="text-xs text-white/60">{item.abbreviation} · {item.visitors} pengunjung</span></span>
                    <strong className="shrink-0 text-sm tabular-nums">{item.views} tayangan</strong>
                </li>)}</ol> : <p className="mt-5 text-sm text-white/70">Belum ada kunjungan ke biro/departemen.</p>}
            </div>
        </section>

        <section aria-label="Ringkasan data" className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ label, value, icon: Icon, href }) => <Link key={label} href={href} className="group rounded-2xl border border-white/20 bg-[#253657] p-5 text-white shadow-sm transition hover:-translate-y-1 hover:border-[#f4e06d]/60 hover:shadow-lg">
                <div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f4e06d]/15 text-[#f4e06d]"><Icon size={21} /></span><ArrowRight size={17} className="text-white/60 transition group-hover:translate-x-1" /></div>
                <strong className="mt-6 block text-3xl font-black text-white">{value}</strong><span className="mt-1 block text-sm font-medium text-white/75">{label}</span>
            </Link>)}
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
            <section className="rounded-2xl border border-white/20 bg-[#253657] p-6 text-white shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="text-xl font-black text-[#f4e06d]">Informasi terbaru</h2><p className="mt-1 text-sm text-white/70">Terakhir ditambahkan ke sistem</p></div><Link href="/admin/informasi" className="text-sm font-bold text-[#f4e06d] hover:underline">Lihat semua</Link></div>
                {recent_informasi.length ? <div className="divide-y divide-white/15">{recent_informasi.map(item => <div key={item.id} className="flex items-center justify-between gap-4 py-3"><div className="min-w-0"><p className="truncate font-semibold text-white">{item.title}</p><p className="mt-1 text-xs text-white/70">{item.birdept?.abbreviation || 'Umum'} Â· {item.category}</p></div><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold capitalize text-[#f4e06d]">{item.status}</span></div>)}</div> : <p className="rounded-xl bg-white/10 p-6 text-sm text-white/70">Belum ada informasi.</p>}
            </section>
            <section className="rounded-2xl border border-white/20 bg-[#253657] p-6 text-white shadow-sm">
                <h2 className="text-xl font-black text-[#f4e06d]">Akses cepat</h2><p className="mt-1 text-sm text-white/70">Lanjutkan pekerjaan Anda</p>
                <div className="mt-5 space-y-3">{[{ label: 'Kelola informasi', href: '/admin/informasi', icon: Megaphone }, { label: 'Biro & departemen', href: '/admin/birdept', icon: Building2 }, { label: 'Pertanyaan umum', href: '/admin/faqs', icon: HelpCircle }, ...(role === 'admin' ? [{ label: 'Kelola pengguna', href: '/admin/users', icon: Users }] : [])].map(({ label, href, icon: Icon }) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/15"><Icon size={18} className="text-[#f4e06d]" />{label}<ArrowRight size={15} className="ml-auto text-white/60" /></Link>)}</div>
                {role === 'admin' && recent_users.length > 0 && <p className="mt-5 rounded-xl border border-[#f4e06d]/30 bg-[#f4e06d]/10 p-4 text-sm text-white/85">{recent_users.length} akun terbaru dapat ditinjau di halaman pengguna.</p>}
            </section>
        </div>
    </>;
}
