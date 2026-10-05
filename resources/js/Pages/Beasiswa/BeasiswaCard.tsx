import { X, Calendar, ClipboardList, Send, Image as ImageIcon } from 'lucide-react';
import React, { useState } from 'react';
import { safeExternalUrl, safePosterUrl } from '@/lib/safe-url';

interface Syarat {
    requirement: string;
    description: string;
}

interface Benefit {
    benefit: string;
    description: string;
}

interface BeasiswaItem {
    id: number;
    title: string;
    beasiswa: {
        organizer: string;
        opensOn: string;
        closesOn: string;
        posterUrl: string;
        instagramUrl: string;
        registrationUrl: string;
        scholarshipRequirements: Syarat[];
        scholarshipBenefits: Benefit[];
    }
}

const DetailModal = ({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: BeasiswaItem | null }) => {
    if (!isOpen || !data) {
return null;
}

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
                        {data.title}
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
                                {data.beasiswa.scholarshipRequirements.map((syarat, idx) => (
                                    <li key={idx} className="flex gap-3 text-[#1D2B44]/80">
                                        <span className="font-bold shrink-0">{idx + 1}.</span>
                                        <span className="font-roboto leading-relaxed">
                                            <span className="font-bold text-[#1D2B44]">{syarat.requirement}:</span> {syarat.description}
                                        </span>
                                    </li>
                                ))}
                                {data.beasiswa.scholarshipRequirements.length === 0 && (
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
                                    <p>Dibuka pada: <span className="font-bold text-[#1D2B44]">{data.beasiswa.opensOn ? new Date(data.beasiswa.opensOn).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Belum diumumkan'}</span></p>
                                </div>
                                <div className="flex gap-3 text-[#1D2B44]/80">
                                    <span className="font-bold shrink-0">2.</span>
                                    <p>Ditutup pada: <span className="font-bold text-[#1D2B44]">{data.beasiswa.closesOn ? new Date(data.beasiswa.closesOn).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Belum diumumkan'}</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-center">
                            {safeExternalUrl(data.beasiswa.registrationUrl) && (
                                <a
                                    href={safeExternalUrl(data.beasiswa.registrationUrl) || undefined}
                                    target="_blank"
                                    rel="noopener noreferrer"
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
        <div className="mx-auto mb-20 w-full max-w-6xl space-y-9">
            {beasiswaData.length === 0 && <p className="paragraf text-center">Belum ada informasi beasiswa yang aktif.</p>}
            {beasiswaData.map((item, index) => (
                <article key={item.id || index} className="rounded-xl border border-[#F4E06D]/40 bg-[#FCF8DC] p-6 shadow-lg sm:p-8 lg:p-10">
                    <h3 className="subtitle-dark mb-5 pb-0! text-xl! sm:text-2xl!">
                                {item.title}
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2 md:gap-10">
                        <div className="space-y-2">
                                {item.beasiswa?.scholarshipBenefits?.map((benefit, idx) => (
                                    <div key={idx} className="flex items-baseline gap-2">
                                        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#19243A]" />
                                        <p className="paragraf-dark text-sm! sm:text-base!">
                                            <span className="font-bold">{benefit.benefit}:</span> {benefit.description}
                                        </p>
                                    </div>
                                ))}
                                {!item.beasiswa?.scholarshipBenefits?.length && <p className="paragraf-dark text-sm! sm:text-base!">Informasi manfaat beasiswa belum tersedia.</p>}
                                <p className="paragraf-dark pt-2 text-xs! italic">
                                    Untuk keterangan lebih lanjut, lihat detail beasiswa.
                                </p>
                        </div>

                        {item.beasiswa ? (
                            <div className="flex flex-col justify-between gap-7">
                                <div>
                                    <p className="paragraf-dark mb-2 text-sm! font-bold sm:text-base!">Periode Pendaftaran</p>
                                    <ul className="list-disc space-y-1 pl-5">
                                        <li className="paragraf-dark text-sm! sm:text-base!">Dibuka: {item.beasiswa.opensOn ? new Date(item.beasiswa.opensOn).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Belum diumumkan'}</li>
                                        <li className="paragraf-dark text-sm! sm:text-base!">Ditutup: {item.beasiswa.closesOn ? new Date(item.beasiswa.closesOn).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Belum diumumkan'}</li>
                                    </ul>
                                </div>

                                <div className="flex flex-wrap gap-2 md:justify-end">
                                    {safePosterUrl(item.beasiswa.posterUrl) && (
                                        <a
                                            href={safePosterUrl(item.beasiswa.posterUrl) || undefined}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-md bg-[#19243A] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#324879] focus-visible:outline-4 focus-visible:outline-[#F4E06D]"
                                        >
                                            <ImageIcon size={14} />
                                            Poster
                                        </a>
                                    )}

                                    {safeExternalUrl(item.beasiswa.instagramUrl) && (
                                        <a
                                            href={safeExternalUrl(item.beasiswa.instagramUrl) || undefined}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-md bg-[#19243A] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#324879] focus-visible:outline-4 focus-visible:outline-[#F4E06D]"
                                        >
                                            <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                            Instagram
                                        </a>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => openDetail(item)}
                                        className="inline-flex items-center gap-2 rounded-md bg-[#19243A] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#324879] focus-visible:outline-4 focus-visible:outline-[#F4E06D]"
                                    >
                                        <ClipboardList size={14} />
                                        Detail
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="paragraf-dark text-sm! italic sm:text-base!">
                                Detail informasi belum tersedia
                            </div>
                        )}
                    </div>
                </article>
            ))}

            <DetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedBeasiswa}
            />
        </div>
    );
}
