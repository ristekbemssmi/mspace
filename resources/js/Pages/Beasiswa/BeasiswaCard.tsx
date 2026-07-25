import React, { useState } from 'react';
import { X, Calendar, ClipboardList, Send, Image as ImageIcon } from 'lucide-react';

interface Syarat {
    nama_syarat: string;
    keterangan: string;
}

interface Benefit {
    nama_benefit: string;
    keterangan: string;
}

interface BeasiswaItem {
    id: number;
    judul: string;
    beasiswa: {
        penyelenggara: string;
        tanggal_buka: string;
        tanggal_tutup: string;
        link_poster: string;
        link_instagram: string;
        link_pendaftaran: string;
        syarat_beasiswa: Syarat[];
        benefit_beasiswa: Benefit[];
    }
}

const DetailModal = ({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: BeasiswaItem | null }) => {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#FCF8DC] w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl border-2 border-[#1D2B44] animate-in zoom-in-95 duration-300">
                <div className="relative p-6 md:p-8 border-b-2 border-[#1D2B44]/10 bg-white/50">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup detail modal"
                        className="absolute right-6 top-6 p-2 rounded-full hover:bg-black/5 transition-colors"
                    >
                        <X size={24} className="text-[#1D2B44]" />
                    </button>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1D2B44] pr-12 text-center font-helvetica uppercase tracking-tight">
                        {data.judul}
                    </h2>
                </div>

                <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-8">
                        <div className="bg-white border-2 border-[#1D2B44] rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4 text-[#1D2B44]">
                                <ClipboardList size={24} />
                                <h3 className="text-xl font-bold font-helvetica uppercase">Persyaratan</h3>
                            </div>
                            <ul className="space-y-3">
                                {data.beasiswa.syarat_beasiswa.map((syarat, idx) => (
                                    <li key={idx} className="flex gap-3 text-[#1D2B44]/80">
                                        <span className="font-bold shrink-0">{idx + 1}.</span>
                                        <span className="font-roboto leading-relaxed">
                                            <span className="font-bold text-[#1D2B44]">{syarat.nama_syarat}:</span> {syarat.keterangan}
                                        </span>
                                    </li>
                                ))}
                                {data.beasiswa.syarat_beasiswa.length === 0 && (
                                    <p className="text-gray-500 italic">Tidak ada syarat khusus yang dicantumkan.</p>
                                )}
                            </ul>
                        </div>

                        <div className="bg-white border-2 border-[#1D2B44] rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4 text-[#1D2B44]">
                                <Calendar size={24} />
                                <h3 className="text-xl font-bold font-helvetica uppercase">Timeline Pendaftaran</h3>
                            </div>
                            <div className="space-y-3 font-roboto">
                                <div className="flex gap-3 text-[#1D2B44]/80">
                                    <span className="font-bold shrink-0">1.</span>
                                    <p>Dibuka pada: <span className="font-bold text-[#1D2B44]">{new Date(data.beasiswa.tanggal_buka).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
                                </div>
                                <div className="flex gap-3 text-[#1D2B44]/80">
                                    <span className="font-bold shrink-0">2.</span>
                                    <p>Ditutup pada: <span className="font-bold text-[#1D2B44]">{new Date(data.beasiswa.tanggal_tutup).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-center">
                            {data.beasiswa.link_pendaftaran && (
                                <a
                                    href={data.beasiswa.link_pendaftaran}
                                    target="_blank"
                                    className="flex items-center gap-2 bg-[#1D2B44] hover:bg-[#2A3F63] text-white px-8 py-3 rounded-xl transition-all font-bold shadow-lg shadow-[#1D2B44]/20 active:scale-95"
                                >
                                    Daftar Sekarang!
                                    <Send size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function BeasiswaCard({ beasiswaData = [] }: { beasiswaData?: BeasiswaItem[] }) {
    const [selectedBeasiswa, setSelectedBeasiswa] = useState<BeasiswaItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openDetail = (item: BeasiswaItem) => {
        setSelectedBeasiswa(item);
        setIsModalOpen(true);
    };

    return (
        <div className="w-full space-y-8 mb-20">
            {beasiswaData.map((item, index) => (
                <div key={item.id || index} className="bg-[#FCF8DC] rounded-[30px] p-8 md:p-10 shadow-xl border-2 border-transparent hover:border-[#1D2B44]/10 transition-all group">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-4">
                            <h3 className="text-2xl md:text-3xl font-bold text-[#1D2B44] font-helvetica uppercase tracking-tight leading-tight">
                                {item.judul}
                            </h3>

                            <div className="space-y-2">
                                {item.beasiswa?.benefit_beasiswa?.map((benefit, idx) => (
                                    <div key={idx} className="flex gap-2 text-[#1D2B44]/80 items-baseline">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#1D2B44] mt-2 shrink-0"></div>
                                        <p className="paragraf-dark text-base! md:text-lg!">
                                            <span className="font-bold">{benefit.nama_benefit}:</span> {benefit.keterangan}
                                        </p>
                                    </div>
                                ))}

                                <p className="text-xs text-[#1D2B44]/60 italic mt-6 font-normal">
                                    *Informasi lebih lengkap silakan klik tombol persyaratan
                                </p>
                            </div>
                        </div>

                        {item.beasiswa ? (
                            <div className="md:w-1/3 flex flex-col justify-between items-start md:items-end gap-6">
                                <div className="text-left md:text-right">
                                    <p className="text-sm font-bold text-[#1D2B44]/50 uppercase tracking-widest mb-1">Periode Pendaftaran</p>
                                    <div className="space-y-1 font-bold text-[#1D2B44] paragraf-dark text-base!">
                                        <p>
                                            {item.beasiswa.tanggal_buka ? new Date(item.beasiswa.tanggal_buka).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'} -
                                            {item.beasiswa.tanggal_tutup ? new Date(item.beasiswa.tanggal_tutup).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                                        </p>
                                        <p className="text-xs font-normal text-[#1D2B44]/70">
                                            {item.beasiswa.tanggal_tutup ? new Date(item.beasiswa.tanggal_tutup).getFullYear() : ''}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 justify-start md:justify-end w-full">
                                    {item.beasiswa.link_poster && (
                                        <a
                                            href={item.beasiswa.link_poster}
                                            target="_blank"
                                            className="flex items-center gap-2 bg-white border-2 border-[#1D2B44] text-[#1D2B44] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#1D2B44] hover:text-white transition-all shadow-sm"
                                        >
                                            <ImageIcon size={14} />
                                            Poster
                                        </a>
                                    )}

                                    {item.beasiswa.link_instagram && (
                                        <a
                                            href={item.beasiswa.link_instagram}
                                            target="_blank"
                                            className="flex items-center gap-2 bg-white border-2 border-[#1D2B44] text-[#1D2B44] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#1D2B44] hover:text-white transition-all shadow-sm"
                                        >
                                            <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                            Instagram
                                        </a>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => openDetail(item)}
                                        className="flex items-center gap-2 bg-[#1D2B44] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#2A3F63] transition-all shadow-md active:scale-95"
                                    >
                                        <ClipboardList size={14} />
                                        Persyaratan
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="md:w-1/3 flex items-center justify-center italic text-[#1D2B44]/40 text-sm">
                                Detail informasi belum tersedia
                            </div>
                        )}
                    </div>
                </div>
            ))}

            <DetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedBeasiswa}
            />
        </div>
    );
}
