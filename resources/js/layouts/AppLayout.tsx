import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import FooterLayout from '@/Layouts/Footer';

export default function AppLayout({ children }: { children: ReactNode }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head>
                <meta name="description" content="Website resmi BEM SSMI IPB University. Informasi lengkap mengenai kegiatan, program kerja, dan info beasiswa Sekolah Sains Data, Matematika, dan Informatika." />
            </Head>
            <header className={`absolute mx-auto top-0 left-0 w-full flex items-center z-50 transition-all
                    ${isScrolled
                    ? 'fixed sm:px-4 sm:py-0'
                    : 'absolute sm:px-8 sm:py-6'}`}>
                <div className={`w-full bg-linear-to-b from-white to-[#F4E06D] shadow-xl/30 transition-all
                    ${isScrolled ? 'sm:rounded-b-2xl' : 'sm:rounded-2xl'}`}>
                    <div className="flex items-center justify-between relative p-3">
                        <div className="px-4 flex items-center">
                            <a href="/" className="mr-2 group">
                                <img src="/img/logo.svg" alt="M-Space Logo" width="48" height="48" className="h-12 w-12 group-hover:scale-110 transition" />
                            </a>
                            <a href="/" className="group">
                                <span className="text-base sm:text-lg md:text-xl font-roboto tracking-[-0.6px] font-black block group-hover:text-[#1f58d4] group-hover:scale-110 transition">BEM SSMI IPB</span>
                                <p className="text-sm sm:text-base md:text-lg font-normal group-hover:text-[#1f58d4] group-hover:scale-110 transition">Langkah Berdikari</p>
                            </a>
                        </div>
                        <div className="flex items-center">
                            <nav className="hidden mx-8 items-center gap-6 font-normal text-[#19243A] text-xl lg:flex">
                                <a href="/" className="hover:text-[#1f58d4] hover:scale-110 transition-all text-base sm:text-lg md:text-xl font-roboto tracking-[-0.6px] font-semibold">Beranda</a>
                                <a href="/bemssmi" className="hover:text-[#1f58d4] hover:scale-110 transition-all text-base sm:text-lg md:text-xl font-roboto tracking-[-0.6px] font-semibold">Tentang Kami</a>
                                <div className="relative flex items-center">
                                    <button
                                        id="informasi-dropdown"
                                        type="button"
                                        aria-haspopup="true"
                                        aria-expanded={isDropdownOpen}
                                        aria-controls="informasi-menu"
                                        className="hover:text-[#1f58d4] hover:scale-110 transition-all peer flex items-center justify-center text-base sm:text-lg md:text-xl font-roboto tracking-[-0.6px] font-semibold bg-transparent border-none cursor-pointer"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <span>Informasi</span>
                                        <svg className={`ml-1 h-4 w-4 transition-all ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </button>
                                    <nav id="informasi-menu" className={`absolute origin-top top-full right-0 py-3 bg-linear-to-b from-[#FFFFFF] to-[#F4E06D] shadow-lg rounded-lg w-60 transition-all
                                        ${isDropdownOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                                        <ul className="inline-block w-full text-center">
                                            <li><a href="/informasi-beasiswa" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Informasi Beasiswa</a></li>
                                            <li className="garis" aria-hidden="true"></li>
                                            <li><a href="/informasi-kegiatan" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Kegiatan SSMI</a></li>
                                            <li className="garis" aria-hidden="true"></li>
                                            <li><a href="/informasi-wisuda" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Informasi Wisuda</a></li>
                                            <li className="garis" aria-hidden="true"></li>
                                            <li><a href="/informasi-alumni" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Informasi Alumni</a></li>
                                            <li className="garis" aria-hidden="true"></li>
                                            <li><a href="/informasi-magang" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Informasi Magang</a></li>
                                        </ul>
                                    </nav>
                                </div>

                                <a href="/akademik" className="hover:text-[#1f58d4] hover:scale-110 transition-all text-base sm:text-lg md:text-xl font-roboto tracking-[-0.6px] font-semibold">Akademik</a>
                                <a href="/faq" className="hover:text-[#1f58d4] hover:scale-110 transition-all text-base sm:text-lg md:text-xl font-roboto tracking-[-0.6px] font-semibold">FAQ</a>
                            </nav>
                            <button
                                id="hamburger"
                                name="hamburger"
                                type="button"
                                className={`group block absolute right-4 lg:hidden ${isNavOpen ? 'hamburger-active' : ''}`}
                                aria-label={isNavOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
                                aria-expanded={isNavOpen}
                                aria-controls="nav-menu"
                                onClick={() => setIsNavOpen(!isNavOpen)}
                            >
                                <span className="hamburger-line origin-top-left transition duration-300 ease-in"></span>
                                <span className="hamburger-line transition duration-300 ease-in"></span>
                                <span className="hamburger-line origin-top-left transition duration-300 ease-in"></span>
                            </button>
                            <nav
                                id="nav-menu"
                                className={`lg:hidden absolute origin-top flex py-3 bg-linear-to-b from-[#F4E06D] to-[#ffffff] shadow-lg rounded-bl-lg min-w-62.5 right-0 top-full transition-all overflow-hidden
                                    ${isNavOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                            >
                                <ul className="inline-block w-full text-center font-roboto text-[#19243A] text-xl">
                                    <li className="group py-2">
                                        <a href="/" className="text-[#19243A] block group-hover:text-[#1f58d4] group-hover:scale-110 transition">Beranda</a>
                                    </li>
                                    <li className="garis" aria-hidden="true"></li>
                                    <li className="group py-2">
                                        <a href="/bemssmi" className="text-[#19243A] block group-hover:text-[#1f58d4] group-hover:scale-110 transition">Tentang Kami</a>
                                    </li>
                                    <li className="garis" aria-hidden="true"></li>
                                    <li id="informasi-dropdown-sm" className="group py-2 relative">
                                        <button
                                            type="button"
                                            aria-haspopup="true"
                                            aria-expanded={isDropdownOpen}
                                            aria-controls="informasi-menu-sm"
                                            className="text-[#19243A] group-hover:text-[#1f58d4] group-hover:scale-110 transition flex items-center justify-center w-full bg-transparent border-none cursor-pointer"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        >
                                            <span>Informasi</span>
                                            <svg className={`h-4 w-4 transition-all ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </button>
                                        <nav
                                            id="informasi-menu-sm"
                                            className={`flex py-3 bg-transparent rounded-lg w-full right-4 top-full transition-all overflow-hidden
                                                ${isDropdownOpen ? 'block' : 'hidden'}`}
                                        >
                                            <ul className="inline-block w-full text-center">
                                                <li><a href="/informasi-beasiswa" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Informasi Beasiswa</a></li>
                                                <li className="garis" aria-hidden="true"></li>
                                                <li><a href="/informasi-kegiatan" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Kegiatan SSMI</a></li>
                                                <li className="garis" aria-hidden="true"></li>
                                                <li><a href="/informasi-wisuda" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Informasi Wisuda</a></li>
                                                <li className="garis" aria-hidden="true"></li>
                                                <li><a href="/informasi-alumni" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Informasi Alumni</a></li>
                                                <li className="garis" aria-hidden="true"></li>
                                                <li><a href="/informasi-magang" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Informasi Magang</a></li>
                                            </ul>
                                        </nav>
                                    </li>
                                    <li className="garis" aria-hidden="true"></li>
                                    <li className="group py-2">
                                        <a href="/akademik" className="text-[#19243A] block group-hover:text-[#1f58d4] group-hover:scale-110 transition">Akademik</a>
                                    </li>
                                    <li className="garis" aria-hidden="true"></li>
                                    <li className="group py-2">
                                        <a href="/faq" className="text-[#19243A] block group-hover:text-[#1f58d4] group-hover:scale-110 transition">FAQ</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            {children}
            <FooterLayout />
        </>
    );
}
