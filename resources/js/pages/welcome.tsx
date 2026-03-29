import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome">
                <link href="https://fonts.googleapis.com" rel="stylesheet" />
                <link href="https://fonts.cdnfonts.com/css/helvetica-255" rel="stylesheet" />
            </Head>
            <main className="mx-auto max-w-screen bg-[url(./../../public/img/bg.svg)] bg-center bg-repeat-space bg-auto">
                {/* Header */}
                <header className="absolute mx-auto top-0 left-0 sm:px-8 sm:py-6 w-full flex items-center z-50 transition-all">
                    <div className="w-full bg-linear-to-b from-[#FFFFFF] to-[#F4E06D] sm:rounded-2xl shadow-xl/30">
                        <div className="flex items-center justify-between relative p-4">
                            <div className="px-4 flex items-center">
                                <a href="#home" className="mr-2 group lg:inline hidden">
                                    <img src="./img/logo.svg" alt="M-Space Logo" className="h-10 w-10 group-hover:scale-110 transition" />
                                </a>
                                <a href="#home" className="text-2xl font-black tracking-[-1.016px] block hover:text-[#1f58d4] hover:scale-110 transition">M-SPACE</a>
                            </div>
                            <div className="flex items-center">
                                <nav className="hidden mx-8 items-center gap-6 font-normal text-[#19243A] text-xl sm:flex">
                                    <div className="lg:pl-28 md:pl-24 relative flex items-center">
                                        <span id="informasi-dropdown" className="hover:text-[#1f58d4] hover:scale-110 transition peer">Informasi&#11167;</span>
                                        <nav id="informasi-menu" className="scale-0 absolute flex py-3 bg-linear-to-b from-[#FFFFFF] to-[#F4E06D] shadow-lg rounded-lg max-w-[1000px] w-full right-4 top-full transition-all overflow-hidden">
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
                                    <a href="" className="hover:text-[#1f58d4] hover:scale-110 transition">Departemen</a>
                                    <a href="" className="hover:text-[#1f58d4] hover:scale-110 transition">FAQ</a>
                                    <a href="" className="grid h-10 w-10 place-items-center rounded-[7.157px] bg-[#19243A] hover:bg-[#0e2e73] transition-all"><img src="./img/keranjang.svg" alt="Shop" /></a>
                                    <a href="" className="grid h-10 w-10 p-1 place-items-center rounded-xl bg-[#19243A] hover:bg-[#0e2e73] transition-all"><img src="./img/education.svg" alt="Education" /></a>
                                </nav>
                                <button id="hamburger" name="hamburger" type="button" className="group block absolute right-4 sm:hidden">
                                    <span className="hamburger-line origin-top-left transition duration-300 ease-in"></span>
                                    <span className="hamburger-line transition duration-300 ease-in"></span>
                                    <span className="hamburger-line origin-top-left transition duration-300 ease-in"></span>
                                </button>
                                <nav id="nav-menu" className="sm:hidden hidden absolute flex py-3 bg-linear-to-b from-[#F4E06D] to-[#ffffff] shadow-lg rounded-bl-lg min-w-[250px] right-0 top-full transition-all overflow-hidden">
                                    <ul className="inline-block w-full text-center font-roboto text-[#19243A] text-xl">
                                        <li id="informasi-dropdown-sm" className="group py-2 relative">
                                            <span className="text-[#19243A] block group-hover:text-[#1f58d4] group-hover:scale-110 transition">Informasi&#11167;</span>
                                            <nav id="informasi-menu-sm" className="hidden flex py-3 bg-transparent rounded-lg max-w-[1000px] w-full right-4 top-full transition-all overflow-hidden">
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
                                            <a href="#home" className="text-[#19243A] block group-hover:text-[#1f58d4] group-hover:scale-110 transition">Departemen</a>
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

                {/* SSMI */}
                <section id="ssmi" className="w-full min-h-screen flex flex-col md:flex-row items-center justify-center p-5 md:p-16 mt-16 md:m-0 gap-10 md:gap-16">
                    <div className="w-full md:w-5/12">
                        <div className="w-full h-96 bg-white rounded-3xl"></div>
                    </div>
                    <div className="w-full md:w-7/12">
                        <div className="bg-linear-to-b from-white to-[#F4E06D] bg-clip-text text-transparent text-4xl md:text-7xl font-helvetica font-bold mb-3">
                            Sekolah Sains<br />
                            Data Matematika<br />
                            dan Informatika<br />
                        </div>
                        <p className="text-xl md:text-3xl text-[#F1F5FF] text-justify font-roboto">
                            Sekolah Sains Data, Matematika, dan Informatika (SSMI) IPB University merupakan salah satu unit akademik di IPB yang berfokus pada pengembangan ilmu pengetahuan di bidang matematika, statistika, ilmu komputer, kecerdasan artifisial, serta aktuaria. SSMI menjadi wadah bagi mahasiswa untuk mempelajari, mengembangkan, dan menerapkan ilmu.
                        </p>
                    </div>
                </section>

                {/* BEM */}
                <section id="bem" className="w-full min-h-screen flex flex-col md:flex-row-reverse items-center justify-center p-16 gap-10 md:gap-16">
                    <div className="w-full md:w-5/12">
                        <img src="./img/logo-lengkap.svg" alt="BEM SSMI" className="w-full min-h-full" />
                    </div>
                    <div className="w-full md:w-7/12">
                        <div className="bg-linear-to-b from-white to-[#F4E06D] bg-clip-text text-transparent text-4xl md:text-7xl font-helvetica font-bold mb-3">
                            BEM SSMI IPB<br />
                            2025 - 2026<br />
                        </div>
                        <p className="text-xl md:text-3xl text-[#F1F5FF] text-justify font-roboto">
                            Sekolah Sains Data, Matematika, dan Informatika (SSMI) IPB University merupakan salah satu unit akademik di IPB yang berfokus pada pengembangan ilmu pengetahuan di bidang matematika, statistika, ilmu komputer, kecerdasan artifisial, serta aktuaria. SSMI menjadi wadah bagi mahasiswa untuk mempelajari, mengembangkan, dan menerapkan ilmu.
                        </p>
                    </div>
                </section>

                {/* Visi dan Misi */}
                <section id="visi">
                    <div className="w-full flex items-center justify-center p-16 bg-linear-to-b from-white to-[#F4E06D] bg-clip-text text-transparent text-3xl md:text-7xl text-center font-helvetica font-bold">
                        Merajut Langkah,<br />
                        Mengukir Arah
                    </div>
                </section>

                {/* Makna Logo */}
                <section id="makna-logo" className="w-full min-h-screen flex flex-col md:flex-row items-center justify-center p-16 gap-10 md:gap-16">
                    <div className="w-full md:w-5/12">
                        <img src="./img/logo-lengkap.svg" alt="Makna Logo" className="w-full" />
                    </div>
                    <div className="w-full md:w-7/12">
                        <h2 className="font-bold bg-linear-to-b from-white to-[#F4E06D] bg-clip-text text-transparent text-4xl md:text-7xl pb-5 mb-5">Makna Logo</h2>
                        <p className="text-xl md:text-3xl text-[#F1F5FF] text-justify font-roboto">
                            Sekolah Sains Data, Matematika, dan Informatika (SSMI) IPB University merupakan salah satu unit akademik di IPB yang berfokus pada pengembangan ilmu pengetahuan di bidang matematika, statistika, ilmu komputer, kecerdasan artifisial, serta aktuaria. SSMI menjadi wadah bagi mahasiswa untuk mempelajari, mengembangkan, dan menerapkan ilmu
                        </p>
                    </div>
                </section>

                {/* News */}
                <section id="news" className="w-full relative min-h-screen flex flex-col items-center justify-center p-16 gap-10 md:gap-16">
                    <div className="w-full text-center">
                        <h2 className="bg-linear-to-b from-white to-[#F4E06D] bg-clip-text text-transparent font-bold text-4xl md:text-7xl mb-5 font-helvetica">SSMI NEWS</h2>
                        <p className="text-xl md:text-3xl text-[#F1F5FF] font-roboto">
                            Menghadirkan informasi-informasi seputar SSMI IPB.
                        </p>
                    </div>
                    <div className="relative w-full flex items-center justify-center gap-4 md:gap-8">
                        <div className="hidden md:block w-32 h-64 bg-white/20 rounded-3xl blur-[2px] opacity-50 shrink-0"></div>
                        <div className="w-10/12 md:w-9/12 h-96 bg-white rounded-[40px] shadow-2xl z-10 shrink-0"></div>
                        <div className="hidden md:block w-32 h-64 bg-white/20 rounded-3xl blur-[2px] opacity-50 shrink-0"></div>
                        <button className="absolute left-4 md:left-10 z-20 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button className="absolute right-4 md:right-10 z-20 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex justify-center gap-2 mt-8">
                        <button className="w-3 h-3 rounded-full bg-[#F4E06D]"></button>
                        <button className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/50 transition"></button>
                        <button className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/50 transition"></button>
                    </div>
                </section>

                {/* Info Beasiswa */}
                <section id="beasiswa" className="w-full min-h-screen flex flex-col items-center justify-center p-16 gap-10 md:gap-16">
                    <h2 className="bg-linear-to-b from-white to-[#F4E06D] bg-clip-text text-transparent font-bold text-4xl md:text-7xl mb-5 font-helvetica">Info Beasiswa</h2>
                    <div className="w-full md:w-9/12 lg:w-7/12 flex flex-row-reverse h-96 bg-[url(./../../public/img/beasiswa.png)] bg-origin-border bg-no-repeat bg-center bg-cover rounded-2xl overflow-hidden">
                        <div className="w-3/4 h-full bg-gradient-to-r from-[#D58641]/0 via-[#D58641]/70 via-30% to-[#F4E06D] flex items-start justify-end p-5">
                            <div className="w-1/2 h-full flex flex-col items-end justify-center gap-4">
                                <h2 className="font-helvetica text-4xl/[48px] font-bold text-right text-[#324879]">Nama Beasiswa</h2>
                                <p className="text-justify font-roboto tracking-[-0.72px]">Sekolah Sains Data, Matematika, dan Informatika (SSMI) IPB University merupakan salah satu unit akademik di IPB yang berfokus pada pengembangan ilmu </p>
                                <button className="cursor-pointer bg-[#19243A] text-[#F4E06D] font-bold p-1 rounded-lg hover:bg-[#2a3c60] transition font-helvetica">
                                    Persyaratan
                                </button>
                                <button className="cursor-pointer bg-[#19243A] text-[#F4E06D] font-bold p-1 rounded-lg hover:bg-[#2a3c60] transition font-helvetica">
                                    Daftar Sekarang
                                </button>
                            </div>

                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
