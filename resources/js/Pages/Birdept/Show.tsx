import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';

interface ProkerItem {
    id: number;
    judul: string;
    deskripsi: string;
}

interface BirdeptData {
    idbirdept: string;
    nama_birdept: string;
    nama_panggilan: string;
    jenis: string;
    deskripsi: string;
    instagram?: string;
    informasi: ProkerItem[];
    users?: any[];
}

const ProkerAccordionItem = ({ judul, deskripsi }: { judul: string, deskripsi: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentId = `proker-content-${judul.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '')}`;

    return (
        <div className="w-full">
            <button
                type="button"
                className="flex w-full bg-linear-to-b from-white to-[#F4E06D] to-200% rounded-2xl p-5 border-2 border-[#19243A] justify-between items-center cursor-pointer hover:opacity-90 transition-all duration-300"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls={contentId}
            >
                <p className="text-left font-helvetica font-bold text-base md:text-xl text-[#19243A]">
                    {judul}
                </p>
                <span className="text-[#19243A] transition flex items-center justify-center shrink-0">
                    <svg className={`h-6 w-6 transition-all duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
            </button>
            <div 
                id={contentId}
                role="region"
                aria-hidden={!isOpen}
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="px-5 md:px-10 bg-transparent rounded-lg w-full">
                        <div className="p-6 bg-white border-x-2 border-b-2 border-[#19243A] rounded-b-2xl shadow-xl">
                            <p className="text-justify whitespace-pre-wrap font-roboto text-sm md:text-base leading-relaxed text-[#19243A]">
                                {deskripsi}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Show({ birdept }: { birdept: BirdeptData }) {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Head title={`${birdept.nama_birdept}`} />
            
            <main className="page min-h-screen py-24 flex flex-col items-center">
                {/* Header Slogan */}
                <div className="text-center mt-10">
                    <h1 className="title mb-2">
                        Program Kerja BEM SSMI
                    </h1>
                    <section id="home-slogan" className="layout">
                        <div className="text-center subtitle">
                            Merajut Langkah, <br className="hidden md:block" />
                            Mengukir Arah
                        </div>
                    </section>
                </div>

                {/* Card Container */}
                <div className="w-full max-w-4xl px-4 md:px-6">
                    <div className="bg-[#FCF8DC] rounded-[40px] border-2 border-[#19243A] p-8 md:p-12 shadow-2xl flex flex-col items-center gap-10 bg-[url(/img/bg.svg)] bg-cover bg-center">
                        {/* Back Button */}
                        <a 
                            href="/bemssmi" 
                            className="self-start text-[#19243A]/70 hover:text-[#19243A] text-sm md:text-base font-bold flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Kembali ke BEM SSMI
                        </a>

                        {/* Title of Biro/Departemen */}
                        <h2 className="text-center title-dark">
                            {birdept.nama_birdept}
                        </h2>

                        {/* Program Kerja Header */}
                        <div className="w-full flex flex-col items-center gap-6" id="proker-section">
                            <h3 className="text-center subtitle-dark">
                                Program Kerja
                            </h3>

                            {/* Accordion List */}
                            <div className="w-full flex flex-col gap-5">
                                {Array.isArray(birdept.informasi) && birdept.informasi.length > 0 ? (
                                    birdept.informasi.map((proker) => (
                                        <ProkerAccordionItem
                                            key={proker.id}
                                            judul={proker.judul}
                                            deskripsi={proker.deskripsi}
                                        />
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 italic font-roboto py-6">
                                        Belum ada program kerja yang dipublikasikan untuk biro/departemen ini.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Anggota Section (Dikosongkan dulu sesuai request) */}
                        {/* 
                        <div className="w-full flex flex-col items-center gap-6 mt-8">
                            <h3 className="text-center font-helvetica font-extrabold text-xl md:text-3xl text-[#19243A] uppercase tracking-wide">
                                Struktur Anggota
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
                                {birdept.users && birdept.users.map((user) => (
                                    <div key={user.id} className="bg-white/50 border border-gray-300 rounded-2xl p-4 text-center">
                                        <p className="font-bold text-[#19243A]">{user.name}</p>
                                        <p className="text-sm text-gray-600">{user.jabatan}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        */}
                    </div>
                </div>
            </main>
        </>
    );
}

Show.layout = (page: React.ReactNode) => <AppLayout children={page} />;
