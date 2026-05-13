import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

interface NewsItem {
    id: number;
    judul: string;
    deskripsi: string;
    waktu_publikasi: string;
    jenis_informasi: string;
    tanggal_kadaluarsa: string;
}

export default function HomeInfo({ data = [] }: { data: NewsItem[] }) {
    // Filter and Sort by Expiry Date (Closest first)
    const newsData = useMemo(() => {
        return [...data]
            .sort((a, b) => new Date(a.tanggal_kadaluarsa).getTime() - new Date(b.tanggal_kadaluarsa).getTime());
    }, [data]);

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === newsData.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? newsData.length - 1 : prev - 1));
    };

    const renderCard = (item: NewsItem, index: number) => {
        const isActive = index === currentIndex;
        const isPrev = index === (currentIndex === 0 ? newsData.length - 1 : currentIndex - 1);
        const isNext = index === (currentIndex === newsData.length - 1 ? 0 : currentIndex + 1);

        // Menentukan posisi dan gaya kartu berdasarkan statusnya
        let cardStyle = "opacity-0 scale-75 blur-md pointer-events-none absolute";
        if (isActive) {
            cardStyle = "opacity-100 scale-100 blur-none z-20 relative";
        } else if (isPrev) {
            // Posisi kartu kiri lebih jauh keluar screen
            cardStyle = "hidden md:flex opacity-20 scale-90 blur-md z-10 -translate-x-[95%] lg:-translate-x-[105%] cursor-pointer absolute";
        } else if (isNext) {
            // Posisi kartu kanan lebih jauh keluar screen
            cardStyle = "hidden md:flex opacity-20 scale-90 blur-md z-10 translate-x-[95%] lg:translate-x-[105%] cursor-pointer absolute";
        }

        return (
            <div
                key={item.id}
                onClick={() => {
                    if (isPrev) prevSlide();
                    if (isNext) nextSlide();
                }}
                className={`flex flex-col md:flex-row gap-6 md:gap-8 items-center bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] md:rounded-[40px] p-5 md:p-8 transition-all duration-700 ease-in-out shadow-2xl h-[520px] md:h-[480px] w-full max-w-5xl ${cardStyle}`}
            >
                {/* Image Content - Optimasi agar masuk semua dalam card */}
                <div className="w-full md:w-[45%] order-1 md:order-2 h-44 md:h-full flex items-center justify-center shrink-0">
                    <div className="relative w-full h-full max-h-40 md:max-h-full aspect-video md:aspect-4/3 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                        <img
                            src={`/img/informasi/${item.id}.png`}
                            alt={item.judul}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/img/fotbar.png';
                            }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#253D6D]/40 to-transparent"></div>
                    </div>
                </div>

                {/* Text Content */}
                <div className={`flex-1 order-2 md:order-1 text-left h-full flex flex-col justify-center transition-opacity duration-500 overflow-hidden ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-[#F4E06D]/20 text-[#F4E06D] text-[10px] font-bold rounded-full border border-[#F4E06D]/30 uppercase tracking-widest">
                            {item.jenis_informasi}
                        </span>
                        <p className="text-white/60 text-xs md:text-sm">
                            {new Date(item.waktu_publikasi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight mb-2 md:mb-3 line-clamp-2 md:line-clamp-none uppercase font-helvetica">
                        {item.judul}
                    </h3>
                    <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6 md:mb-10 line-clamp-3 md:line-clamp-4">
                        {item.deskripsi}
                    </p>

                    {isActive && (
                        <button className="group self-start flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-xl border border-white/10 transition-all duration-300 mt-auto">
                            <span className="text-xs md:text-sm font-semibold">Selengkapnya</span>
                            <div className="bg-[#F4E06D]/20 rounded-lg p-1 group-hover:bg-[#F4E06D]/40 transition-colors">
                                <ArrowUpRight size={16} className="text-[#F4E06D]" />
                            </div>
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <section id="home-info" className="w-full relative pb-50">
            <div className="w-full relative z-10 flex flex-col items-center">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="title drop-shadow-lg text-3xl md:text-4xl lg:text-5xl">
                        SSMI News
                    </h2>
                    <p className="paragraf text-sm md:text-base mx-auto">
                        BEM News tidak hanya berfungsi sebagai dokumentasi kegiatan organisasi, tetapi juga sebagai ruang intelektual dan literasi digital yang membahas perkembangan sains data, matematika, dan informatika.
                    </p>
                </div>

                {/* News Carousel Container - Sliding Version */}
                <div className="relative w-full flex items-center justify-center h-[580px] md:h-[520px] overflow-visible">
                    <div className="relative w-full max-w-5xl flex items-center justify-center h-full">
                        {newsData.map((item, index) => renderCard(item, index))}
                    </div>

                    {/* Navigation Buttons (Floating) */}
                    <div className="absolute -bottom-24 flex items-center gap-6">
                        <button
                            onClick={prevSlide}
                            className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all shadow-xl backdrop-blur-md"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="flex gap-3">
                            {newsData.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`transition-all duration-300 rounded-full h-2.5 ${index === currentIndex ? 'w-10 bg-[#F4E06D]' : 'w-2.5 bg-white/20 hover:bg-white/40'
                                        }`}
                                ></button>
                            ))}
                        </div>

                        <button
                            onClick={nextSlide}
                            className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all shadow-xl backdrop-blur-md"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
