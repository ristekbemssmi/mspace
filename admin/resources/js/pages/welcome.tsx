import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Building2, FileSpreadsheet,  LogIn, Megaphone,  Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<any>().props;

    return (
        <>
            <Head title="Selamat Datang">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700,800" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500 selection:text-white flex flex-col justify-between relative overflow-hidden">
                {/* Background Glow Orbs */}
                <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />

                {/* Navbar Header */}
                <header className="relative z-10 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-black text-xl">
                                M
                            </div>
                            <div>
                                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                                    MSPACE
                                </span>
                                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Control Panel
                                </span>
                            </div>
                        </div>

                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Link href="/admin/dashboard">
                                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold gap-2 shadow-lg shadow-emerald-500/20">
                                        Masuk ke Dashboard
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold gap-2">
                                            <LogIn className="h-4 w-4" />
                                            Log in
                                        </Button>
                                    </Link>
                                    {canRegister && (
                                        <Link href="/register">
                                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
                                                Register
                                            </Button>
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 text-center flex-1 flex flex-col items-center justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 shadow-inner">
                        <Sparkles className="h-4 w-4 text-emerald-400" />
                        Admin Dashboard & Bulk CSV Importer Complete System
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight">
                        Sistem Manajemen CRUD & <br />
                        <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                            Upload CSV Multi-Tabel MSPACE
                        </span>
                    </h1>

                    <p className="mt-4 text-base md:text-lg text-slate-400 max-w-2xl">
                        Kelola data Biro & Departemen BEM, Pengguna, Fungsionaris, Informasi Beasiswa & Kegiatan, FAQ, serta fitur pengunggahan CSV secara otomatis untuk seluruh tabel database.
                    </p>

                    {/* CTA Actions */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        {auth.user ? (
                            <Link href="/admin/dashboard">
                                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-base gap-2 px-8 shadow-xl shadow-emerald-500/25">
                                    Buka Admin Dashboard
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-base gap-2 px-8 shadow-xl shadow-emerald-500/25">
                                    <LogIn className="h-5 w-5" />
                                    Masuk Ke Panel Admin (Login)
                                </Button>
                            </Link>
                        )}
                        <Link href="/admin/csv-hub">
                            <Button size="lg" variant="outline" className="border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white font-bold gap-2 px-6">
                                <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
                                CSV Import Hub
                            </Button>
                        </Link>
                    </div>

                    {/* Feature Cards Grid */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left">
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 transition shadow-lg group">
                            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-lg text-white">Birdept BEM</h3>
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                Kelola struktur BPH, Biro, dan Departemen BEM lengkap dengan pencarian, filter, dan fitur CSV template.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 transition shadow-lg group">
                            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-lg text-white">Users & BEM</h3>
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                Kelola akun pengguna, penetapan position Fungsionaris BEM, filter studyProgram, serta impor CSV pengguna sekaligus.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/50 transition shadow-lg group">
                            <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                <Megaphone className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-lg text-white">Informasi & Beasiswa</h3>
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                Manajemen postingan Beasiswa, Kegiatan, Wisuda, Alumni, Magang, dan Proker dengan rincian sub-detail.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/50 transition shadow-lg group">
                            <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                <FileSpreadsheet className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-lg text-white">CSV Importer Hub</h3>
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                Fitur khusus drag-and-drop CSV untuk memasukkan ratusan baris data langsung ke tabel mana pun di database.
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 w-full border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
                    <p>© 2026 MSPACE Control Panel • Powered by Laravel & Inertia React</p>
                </footer>
            </div>
        </>
    );
}
