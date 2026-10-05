import { Link } from '@inertiajs/react';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return <div className="auth-shell min-h-svh bg-[#f5f7fc] text-[#19243a] lg:grid lg:grid-cols-2">
        <div className="relative hidden min-h-svh flex-col justify-between overflow-hidden bg-[#19243a] p-12 text-white lg:flex">
            <div className="absolute -right-28 -top-24 h-96 w-96 rounded-full border-[72px] border-[#324879]/70" />
            <div className="absolute -bottom-44 left-12 h-96 w-96 rounded-full bg-[#f4e06d]" />
            <Link href="/" className="relative z-10 flex items-center gap-3 text-xl font-black"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f4e06d] text-[#19243a]">M</span> MSPACE</Link>
            <div className="relative z-10 max-w-lg"><span className="mb-7 inline-block rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] text-[#f4e06d]">Ruang kolaborasi BEM</span><h2 className="text-5xl font-black leading-[1.1] tracking-tight">Informasi kampus,<br /><span className="text-[#f4e06d]">dikelola lebih baik.</span></h2><p className="mt-6 max-w-md text-lg leading-8 text-[#cbd6ea]">Satu tempat untuk mengelola kabar, kegiatan, dan layanan mahasiswa dengan aman.</p></div>
            <p className="relative z-10 self-start rounded-lg bg-[#19243a] px-3 py-2 text-sm text-[#d4deec]">© {new Date().getFullYear()} MSPACE</p>
        </div>
        <div className="flex min-h-svh items-center justify-center px-5 py-10 sm:px-10"><div className="w-full max-w-md"><Link href="/" className="mb-10 inline-flex items-center gap-3 font-black lg:hidden"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#19243a] text-[#f4e06d]">M</span> MSPACE</Link><div className="rounded-[28px] border border-[#aab7cc] bg-white p-7 shadow-[0_20px_60px_-35px_#32487988] sm:p-9"><div className="mb-8"><div className="mb-4 h-1.5 w-12 rounded-full bg-[#f4e06d]" /><h1 className="text-3xl font-black tracking-tight">{title}</h1><p className="mt-2 text-sm leading-6 text-[#52627d]">{description}</p></div>{children}</div><p className="mt-7 text-center text-xs text-[#52627d]">Akses pengelolaan diberikan setelah persetujuan admin.</p></div></div>
    </div>;
}
