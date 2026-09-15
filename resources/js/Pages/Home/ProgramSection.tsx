import React, { useState } from 'react';
import { ArrowUpRight, Target, Users, Calendar } from 'lucide-react';
import Modal from '@/Layouts/Modal';

interface ProkerItem {
    id: number;
    judul?: string;
    name?: string;
    deskripsi?: string;
    image_url: string;
    parent?: {
        id?: number;
        judul?: string;
        deskripsi?: string;
    };
    birdept?: {
        idbirdept?: number;
        nama_birdept?: string;
        nama_panggilan?: string;
        jenis?: string;
    };
    proker?: {
        tujuan?: string;
        sasaran?: string;
        waktu_mulai?: string;
        waktu_selesai?: string;
    };
}

interface CardProps {
    proker: ProkerItem;
    name: string;
    imageSrc: string;
    deskripsi: string;
    birdeptName: string;
    onCardClick: (proker: ProkerItem) => void;
}

const HomeProkerCard = ({ proker, name, imageSrc, deskripsi, birdeptName, onCardClick }: CardProps) => {
    return (
        <div 
            className="perspective-1000 group relative w-full aspect-square cursor-pointer select-none"
            onClick={() => onCardClick(proker)}
        >
            <div className="relative w-full h-full rounded-4xl transition-all duration-700 transform-style-preserve-3d group-hover:rotate-y-180 shadow-xl">
                {/* FRONT FACE (Persis seperti pada gambar) */}
                <div className="absolute inset-0 w-full h-full rounded-4xl overflow-hidden backface-hidden border-2 border-transparent group-hover:border-[#F4E06D]/30 transition-all duration-300">
                    <img 
                        src={imageSrc} 
                        alt={name}
                        width="400"
                        height="400"
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-[#19243A]/60 mix-blend-multiply transition-colors duration-500"></div>
                    <div className="absolute inset-0 bg-linear-to-t from-[#19243A]/90 via-[#19243A]/40 to-[#19243A]/40"></div>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <h3 className="bg-linear-to-b dark:from-white dark:to-[#F4E06D] from-[#324879] to-[#19243A] bg-clip-text text-transparent text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-helvetica drop-shadow-xl transition-transform duration-300 group-hover:-translate-y-1">
                            {name}
                        </h3>
                        {birdeptName && (
                            <span className="mt-2 inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold text-[#F4E06D]/90 bg-black/30 border border-[#F4E06D]/20 backdrop-blur-xs">
                                {birdeptName}
                            </span>
                        )}
                    </div>
                </div>

                {/* BACK FACE (Kebalik sendiri saat hover) */}
                <div className="absolute inset-0 w-full h-full rounded-4xl overflow-hidden backface-hidden rotate-y-180 bg-linear-to-b from-[#1E2E50] to-[#111A2E] border-2 border-[#F4E06D]/50 p-5 md:p-6 flex flex-col justify-between shadow-2xl bg-[url(/img/bg.svg)] bg-cover bg-center">
                    <div className="flex flex-col items-center text-center gap-2">
                        <span className="px-3 py-1 bg-[#F4E06D]/20 text-[#F4E06D] text-[10px] md:text-xs font-bold rounded-full border border-[#F4E06D]/30 uppercase tracking-wider">
                            {birdeptName || 'BEM SSMI'}
                        </span>
                        <h4 className="text-[#F4E06D] font-bold text-base sm:text-lg md:text-xl font-helvetica line-clamp-2">
                            {name}
                        </h4>
                    </div>

                    <p className="text-white/85 text-xs sm:text-sm font-roboto leading-relaxed text-center line-clamp-4 md:line-clamp-5 px-1">
                        {deskripsi || 'Program kerja inovatif dari BEM SSMI untuk memfasilitasi dan mengembangkan potensi seluruh mahasiswa.'}
                    </p>

                    <div className="flex justify-center items-center pt-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCardClick(proker);
                            }}
                            className="flex items-center gap-1.5 px-4 py-2 bg-[#F4E06D] hover:bg-white text-[#19243A] font-bold text-xs md:text-sm rounded-xl shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                            <span>Lihat Info</span>
                            <ArrowUpRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ProgramSection({ data = [] }: { data: any[] }) {
    const [selectedProker, setSelectedProker] = useState<ProkerItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = (proker: ProkerItem) => {
        setSelectedProker(proker);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProker(null);
    };

    const prokerName = selectedProker?.judul || selectedProker?.parent?.judul || selectedProker?.name || 'Program Kerja';
    const prokerDesc = selectedProker?.deskripsi || selectedProker?.parent?.deskripsi || 'Tidak ada deskripsi tersedia.';
    const birdept = selectedProker?.birdept;
    const birdeptTitle = birdept?.nama_birdept 
        ? `${birdept.jenis === 'biro' ? 'Biro' : (birdept.jenis === 'bph' ? 'BPH' : 'Departemen')} ${birdept.nama_birdept}`
        : (birdept?.nama_panggilan || 'BEM SSMI');

    return (
        <section id="home-proker" className="w-full flex flex-col items-center justify-center layout">
            <div className="w-full pb-8">
                <h2 className="text-center title">
                    Program Kerja
                </h2>
            </div>
            
            <div className="w-full">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 lg:gap-12 justify-items-center">
                    {data.map((proker, index) => {
                        const name = proker.judul || proker.parent?.judul || proker.name || 'Untitled';
                        const desc = proker.deskripsi || proker.parent?.deskripsi || '';
                        const bName = proker.birdept?.nama_panggilan || proker.birdept?.nama_birdept || '';

                        return (
                            <HomeProkerCard
                                key={proker.id || index}
                                proker={proker}
                                name={name}
                                imageSrc={proker.image_url}
                                deskripsi={desc}
                                birdeptName={bName}
                                onCardClick={handleCardClick}
                            />
                        );
                    })}
                </div>
            </div>

            {/* DETAIL MODAL (Mirip Halaman Birdept) */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={prokerName}
            >
                {selectedProker && (
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-8">
                        {/* Image Left */}
                        <div className="bg-linear-to-b from-[#324879] to-[#1E2E50] rounded-2xl flex w-full sm:w-2/3 lg:w-1/2 justify-center p-3 shadow-xl border border-white/20 shrink-0">
                            <div className="relative w-full aspect-video md:aspect-4/3 rounded-xl overflow-hidden bg-[url(/img/bg-modal.svg)] bg-cover bg-center flex items-center justify-center">
                                <img
                                    src={selectedProker.image_url || "/img/fotbar.webp"}
                                    alt={prokerName}
                                    width="500"
                                    height="400"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-[#19243A]/80 via-transparent to-transparent"></div>
                                <span className="absolute bottom-3 left-3 px-3 py-1 bg-[#F4E06D] text-[#19243A] text-xs font-bold rounded-lg shadow">
                                    Program Kerja
                                </span>
                            </div>
                        </div>

                        {/* Content Right */}
                        <div className="w-full lg:w-1/2 self-start px-2 md:px-6 flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-[#19243A] text-[#F4E06D] text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider">
                                    {birdept?.nama_panggilan ? (birdept.jenis === 'biro' ? `Biro ${birdept.nama_panggilan}` : `Departemen ${birdept.nama_panggilan}`) : 'BEM SSMI'}
                                </span>
                            </div>

                            <h4 className="text-[#19243A] font-bold text-xl sm:text-2xl md:text-3xl font-helvetica leading-tight mb-2">
                                {prokerName}
                            </h4>

                            {birdept?.nama_birdept && (
                                <p className="text-xs md:text-sm font-semibold text-[#19243A]/70 mb-4">
                                    {birdeptTitle}
                                </p>
                            )}

                            <div className="text-justify text-sm sm:text-base font-roboto text-[#19243A] leading-relaxed mb-4 max-h-48 overflow-y-auto pr-2">
                                {prokerDesc}
                            </div>

                            {/* Extra Proker attributes if available */}
                            {(selectedProker.proker?.tujuan || selectedProker.proker?.sasaran || selectedProker.proker?.waktu_mulai) && (
                                <div className="bg-white/60 border border-[#19243A]/15 rounded-xl p-3 mb-4 text-xs md:text-sm text-[#19243A] flex flex-col gap-1.5 shadow-xs">
                                    {selectedProker.proker?.tujuan && (
                                        <div className="flex items-start gap-2">
                                            <Target size={15} className="text-[#324879] shrink-0 mt-0.5" />
                                            <p><span className="font-bold">Tujuan:</span> {selectedProker.proker.tujuan}</p>
                                        </div>
                                    )}
                                    {selectedProker.proker?.sasaran && (
                                        <div className="flex items-start gap-2">
                                            <Users size={15} className="text-[#324879] shrink-0 mt-0.5" />
                                            <p><span className="font-bold">Sasaran:</span> {selectedProker.proker.sasaran}</p>
                                        </div>
                                    )}
                                    {selectedProker.proker?.waktu_mulai && (
                                        <div className="flex items-start gap-2">
                                            <Calendar size={15} className="text-[#324879] shrink-0 mt-0.5" />
                                            <p><span className="font-bold">Periode:</span> {selectedProker.proker.waktu_mulai} {selectedProker.proker.waktu_selesai ? `s/d ${selectedProker.proker.waktu_selesai}` : ''}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {birdept?.nama_panggilan && (
                                <div className="mt-2">
                                    <a
                                        href={`/birdept/${birdept.nama_panggilan.toLowerCase()}#proker-section`}
                                        className="inline-flex items-center gap-2 bg-[#19243A] hover:bg-[#2A3F63] text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md text-xs md:text-sm cursor-pointer"
                                    >
                                        <span>Buka Biro/Departemen {birdept.nama_panggilan}</span>
                                        <ArrowUpRight size={15} className="text-[#F4E06D]" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
}
