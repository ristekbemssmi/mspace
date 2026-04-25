import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';



export default function HeaderLayout({ children }: { children: ReactNode }) {
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
            <header className={`absolute mx-auto top-0 left-0 w-full flex items-center z-50 transition-all
                    ${isScrolled 
                        ? 'fixed sm:px-4 sm:py-0' 
                        : 'absolute sm:px-8 sm:py-6'}`}>
                <div className={`w-full bg-linear-to-b from-white to-[#F4E06D] shadow-xl/30 transition-all
                    ${isScrolled ? 'sm:rounded-b-2xl' : 'sm:rounded-2xl'}`}>
                    <div className="flex items-center justify-between relative p-4">
                        <div className="px-4 flex items-center">
                            <a href="#home" className="mr-2 group lg:inline hidden">
                                <img src="./img/logo.svg" alt="M-Space Logo" className="h-10 w-10 group-hover:scale-110 transition" />
                            </a>
                            <a href="/" className="text-2xl font-black tracking-[-1.016px] block hover:text-[#1f58d4] hover:scale-110 transition">M-SPACE</a>
                        </div>
                        <div className="flex items-center">
                            <nav className="hidden mx-8 items-center gap-6 font-normal text-[#19243A] text-xl sm:flex">
                                <div className="relative flex items-center"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    <span id="informasi-dropdown" className="hover:text-[#1f58d4] hover:scale-110 transition peer flex items-center justify-center">
                                        <span>Informasi</span>
                                        <svg className={`h-4 w-4 transition-all ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </span>
                                    <nav id="informasi-menu" className={`absolute origin-top top-full right-0 py-3 bg-linear-to-b from-[#FFFFFF] to-[#F4E06D] shadow-lg rounded-lg w-60 transition-all
                                        ${isDropdownOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                                        <ul className="inline-block w-full text-center">
                                            <li><a href="" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Informasi Beasiswa</a></li>
                                            <div className="garis"></div>
                                            <li><a href="" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Kegiatan SSMI</a></li>
                                            <div className="garis"></div>
                                            <li><a href="" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Informasi Wisuda</a></li>
                                            <div className="garis"></div>
                                            <li><a href="" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Informasi Alumni</a></li>
                                            <div className="garis"></div>
                                            <li><a href="" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Informasi Magang</a></li>
                                        </ul>
                                    </nav>
                                </div>
                                <a href="/bemssmi" className="hover:text-[#1f58d4] hover:scale-110 transition">BEM SSMI</a>
                                <a href="" className="hover:text-[#1f58d4] hover:scale-110 transition">Akademik</a>
                                <a href="" className="hover:text-[#1f58d4] hover:scale-110 transition">FAQ</a>
                                {/* <a href="" className="grid h-10 w-10 place-items-center rounded-[7.157px] bg-[#19243A] hover:bg-[#0e2e73] transition-all"><img src="./img/keranjang.svg" alt="Shop" /></a> */}
                            </nav>
                            <button id="hamburger" name="hamburger" type="button" className={`group block absolute right-4 sm:hidden
                                ${isNavOpen ? 'hamburger-active' : ''}`}
                                onClick={() => setIsNavOpen(!isNavOpen)}>
                                <span className="hamburger-line origin-top-left transition duration-300 ease-in"></span>
                                <span className="hamburger-line transition duration-300 ease-in"></span>
                                <span className="hamburger-line origin-top-left transition duration-300 ease-in"></span>
                            </button>
                            <nav id="nav-menu" className={`sm:hidden absolute origin-top flex py-3 bg-linear-to-b from-[#F4E06D] to-[#ffffff] shadow-lg rounded-bl-lg min-w-62.5 right-0 top-full transition-all overflow-hidden"
                                ${isNavOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                                <ul className="inline-block w-full text-center font-roboto text-[#19243A] text-xl">
                                    <li id="informasi-dropdown-sm" className="group py-2 relative">
                                        <span className="text-[#19243A] group-hover:text-[#1f58d4] group-hover:scale-110 transition flex items-center justify-center"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                            <span>Informasi</span>
                                            <svg className={`h-4 w-4 transition-all ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </span>
                                        <nav id="informasi-menu-sm" className={`flex py-3 bg-transparent rounded-lg w-full right-4 top-full transition-all overflow-hidden
                                            ${isDropdownOpen ? 'block' : 'hidden'}`}>
                                            <ul className="inline-block w-full text-center">
                                                <li><a href="" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Informasi Beasiswa</a></li>
                                                <div className="garis"></div>
                                                <li><a href="" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Kegiatan SSMI</a></li>
                                                <div className="garis"></div>
                                                <li><a href="" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Informasi Wisuda</a></li>
                                                <div className="garis"></div>
                                                <li><a href="" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Informasi Alumni</a></li>
                                                <div className="garis"></div>
                                                <li><a href="" className="block px-4 py-2 hover:text-[#1f58d4] hover:scale-110 transition-all">Informasi Magang</a></li>
                                            </ul>
                                    </nav>
                                    </li>
                                    <div className="garis"></div>
                                    <li className="group py-2">
                                        <a href="/bemssmi" className="text-[#19243A] block group-hover:text-[#1f58d4] group-hover:scale-110 transition">BEM SSMI</a>
                                    </li>
                                    <div className="garis"></div>
                                    <li className="group py-2">
                                        <a href="#home" className="text-[#19243A] block group-hover:text-[#1f58d4] group-hover:scale-110 transition">Akademik</a>
                                    </li>
                                    <div className="garis"></div>
                                    <li className="group py-2">
                                        <a href="#home" className="text-[#19243A] block group-hover:text-[#1f58d4] group-hover:scale-110 transition">FAQ</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            {children}
        </>
    );
}
