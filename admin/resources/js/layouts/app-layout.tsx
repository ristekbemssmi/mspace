import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, ChevronDown, LogOut } from 'lucide-react';
import { createContext, useContext } from 'react';
import type { Auth, BreadcrumbItem } from '@/types';

const LayoutContext = createContext(false);

const nav = [
    { label: 'Ringkasan', href: '/admin/dashboard', roles: ['admin', 'editor', 'viewer'] },
    { label: 'Informasi', href: '/admin/informasi', roles: ['admin', 'editor', 'viewer'] },
    { label: 'Biro & Departemen', href: '/admin/birdept', roles: ['admin', 'editor', 'viewer'] },
    { label: 'FAQ', href: '/admin/faqs', roles: ['admin', 'editor', 'viewer'] },
    { label: 'Pengguna', href: '/admin/users', roles: ['admin'] },
    { label: 'Persetujuan', href: '/admin/approvals', roles: ['admin'] },
    { label: 'Impor data', href: '/admin/csv-hub', roles: ['admin'] },
];

export default function AppLayout({ children }: { breadcrumbs?: BreadcrumbItem[]; children: React.ReactNode }) {
    const nested = useContext(LayoutContext);
    const page = usePage<{ auth: Auth }>();
    const { auth } = page.props;
    const role = auth.user?.adminRole;
    const active = page.url.split('?')[0].replace(/\/$/, '') || '/';

    if (nested) return <>{children}</>;

    return (
        <LayoutContext.Provider value={true}><div className="admin-shell min-h-screen bg-[#19243a] text-white">
            <header className="border-b border-white/15 bg-[#19243a] shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
                    <Link href="/dashboard" className="flex items-center gap-3" aria-label="MSPACE beranda">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f4e06d] text-xl font-black tracking-tight text-[#19243a]">M</span>
                        <span className="leading-tight"><strong className="block text-lg font-black tracking-tight text-[#f4e06d]">MSPACE</strong><small className="block text-[11px] font-semibold uppercase tracking-[.2em] text-white/70">Ruang pengelola</small></span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <a href={import.meta.env.VITE_PUBLIC_URL || 'https://bemssmi.com'} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1 text-sm font-semibold text-[#f4e06d] hover:underline sm:inline-flex">Lihat situs publik <ArrowUpRight size={15} /></a>
                        <details className="relative group">
                            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-white/25 bg-white/10 py-1.5 pl-1.5 pr-3 text-sm font-semibold marker:hidden hover:border-[#f4e06d]">
                                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f4e06d] font-bold text-[#19243a]">{auth.user?.name?.charAt(0).toUpperCase() || 'M'}</span>
                                <span className="hidden max-w-28 truncate sm:inline">{auth.user?.name}</span><ChevronDown size={14} />
                            </summary>
                            <div className="absolute right-0 z-30 mt-2 w-56 rounded-2xl border border-white/20 bg-[#26385a] p-2 text-white shadow-xl">
                                <p className="px-3 py-2 text-xs text-white/70">{auth.user?.email}</p>
                                <Link href="/settings/profile" className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10">Profil & keamanan</Link>
                                <Link href="/logout" method="post" as="button" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[#ffc2c2] hover:bg-white/10"><LogOut size={15} /> Keluar</Link>
                            </div>
                        </details>
                    </div>
                </div>
                {role && <nav aria-label="Navigasi utama" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 pb-3 lg:px-8">{nav.filter(item => item.roles.includes(role)).map(item => { const selected = active === item.href || active.startsWith(`${item.href}/`); return <Link key={item.href} href={item.href} aria-current={selected ? 'page' : undefined} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${selected ? 'bg-[#f4e06d] text-[#19243a]' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>{item.label}</Link>; })}</nav>}
            </header>
            <main className="mx-auto w-full max-w-7xl px-5 py-7 lg:px-8">{children}</main>
        </div></LayoutContext.Provider>
    );
}
