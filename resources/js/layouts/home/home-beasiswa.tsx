import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Info, ExternalLink } from 'lucide-react';

interface BeasiswaItem {
    id: number;
    judul: string;
    deskripsi: string;
    beasiswa: {
        tanggal_tutup: string;
        link_pendaftaran: string;
        link_poster: string;
    }
}

export default function HomeBeasiswa({ data = [] }: { data: BeasiswaItem[] }) {
    const scholarshipData = data;
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === scholarshipData.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? scholarshipData.length - 1 : prev - 1));
    };

    const renderCard = (item: BeasiswaItem, index: number) => {
        const isActive = index === currentIndex;
        const isPrev = index === (currentIndex === 0 ? scholarshipData.length - 1 : currentIndex - 1);
        const isNext = index === (currentIndex === scholarshipData.length - 1 ? 0 : currentIndex + 1);

        let cardStyle = "opacity-0 scale-75 blur-md pointer-events-none absolute";
        if (isActive) {
            cardStyle = "opacity-100 scale-100 blur-none z-20 relative";
        } else if (isPrev) {
            cardStyle = "hidden lg:flex opacity-20 scale-90 blur-md z-10 -translate-x-[110%] cursor-pointer absolute";
        } else if (isNext) {
            cardStyle = "hidden lg:flex opacity-20 scale-90 blur-md z-10 translate-x-[110%] cursor-pointer absolute";
        }

        return (
            <div
                key={item.id}
                onClick={() => {
                    if (isPrev) prevSlide();
                    if (isNext) nextSlide();
                }}
                className={`flex flex-col md:flex-row bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[40px] overflow-hidden transition-all duration-700 ease-in-out shadow-2xl h-[560px] md:h-[450px] w-full max-w-5xl ${cardStyle}`}
            >
                {/* Background Pattern / Overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-[#F4E06D]/5 to-transparent pointer-events-none"></div>

                {/* Left/Top Content: Image Section */}
                <div className="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden shrink-0">
                    <img
                        src={item.beasiswa?.link_poster}
                        alt={item.judul}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/img/beasiswa.png';
                        }}
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-white/10 md:to-[#19243A]/20"></div>
                </div>

                {/* Right/Bottom Content: Info Section */}
                <div className={`flex-1 p-8 md:p-12 text-left flex flex-col justify-center gap-4 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="space-y-2">
                        {item.beasiswa?.tanggal_tutup && (
                            <span className="inline-block px-3 py-1 bg-[#F4E06D]/20 text-[#F4E06D] text-[10px] md:text-xs font-bold rounded-full border border-[#F4E06D]/30 uppercase tracking-widest">
                                Terbuka Hingga {new Date(item.beasiswa.tanggal_tutup).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                            </span>
                        )}
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight font-helvetica drop-shadow-md">
                            {item.judul}
                        </h3>
                    </div>

                    <p className="text-white/70 text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-4 font-roboto">
                        {item.deskripsi}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-4">
                        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl border border-white/10 transition-all font-semibold text-sm">
                            <Info size={16} className="text-[#F4E06D]" />
                            Persyaratan
                        </button>
                        <a
                            href={item.beasiswa?.link_pendaftaran || '#'}
                            target="_blank"
                            className="flex items-center gap-2 bg-[#F4E06D] hover:bg-[#e5d25c] text-[#19243A] px-5 py-2.5 rounded-xl transition-all font-bold text-sm shadow-lg shadow-[#F4E06D]/20"
                        >
                            Daftar Sekarang!
                            <ExternalLink size={16} />
                        </a>
                    </div>
                </div>
            </div>
        );
    };

    if (scholarshipData.length === 0) return null;

    return (
        <section id="home-beasiswa" className="w-full relative py-20 overflow-visible">
            <div className="w-full flex flex-col items-center">
                <div className="text-center mb-12">
                    <h2 className="title text-3xl md:text-4xl lg:text-5xl mb-4">
                        Info Beasiswa
                    </h2>
                    <p className="paragraf text-white/60 max-w-2xl mx-auto">
                        Setiap beasiswa yang dikejar dapat memiliki makna. Cari informasi lebih lengkap mengenai beasiswa ini!
                    </p>
                </div>

                {/* Carousel Area */}
                <div className="relative w-full flex items-center justify-center h-[600px] md:h-[500px]">
                    <div className="relative w-full max-w-5xl flex items-center justify-center h-full px-4">
                        {scholarshipData.map((item, index) => renderCard(item, index))}
                    </div>

                    {/* Navigation */}
                    <div className="absolute -bottom-10 md:bottom-[-40px] flex items-center gap-8 z-30">
                        <button
                            onClick={prevSlide}
                            className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all backdrop-blur-md"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="flex gap-2.5">
                            {scholarshipData.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`transition-all duration-300 rounded-full h-2 ${index === currentIndex ? 'w-8 bg-[#F4E06D]' : 'w-2 bg-white/20'
                                        }`}
                                ></button>
                            ))}
                        </div>

                        <button
                            onClick={nextSlide}
                            className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all backdrop-blur-md"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <div className="mt-24">
                    <a href="/informasi-beasiswa" className="bg-linear-to-b from-white to-[#F4E06D] text-[#19243A] px-8 py-3 rounded-full font-bold text-base shadow-xl hover:scale-105 transition-transform active:scale-95">
                        Info Selengkapnya
                    </a>
                </div>
            </div>
        </section>
    );
}
