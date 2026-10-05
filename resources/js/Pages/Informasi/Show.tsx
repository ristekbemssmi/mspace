import { Head } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { safeExternalUrl, safePosterUrl } from '@/lib/safe-url';

type BeasiswaDetail = {
    organizer: string | null;
    opensOn: string | null;
    closesOn: string | null;
    registrationUrl: string | null;
    posterUrl: string | null;
    instagramUrl: string | null;
    scholarshipRequirements: { id: number; requirement: string; description: string }[];
    scholarshipBenefits: { id: number; benefit: string; description: string }[];
};

type LombaDetail = {
    organizer: string | null;
    registrationUrl: string | null;
    opensOn: string | null;
    closesOn: string | null;
};

type Informasi = {
    id: number;
    title: string;
    description: string;
    source: string | null;
    category: string;
    publishedAt: string;
    expiresAt: string | null;
    birdept: { name: string; abbreviation: string } | null;
    beasiswa: BeasiswaDetail | null;
    lomba: LombaDetail | null;
    detail: Record<string, string | null> | null;
    images: { id: number; url: string }[];
};

const formatDate = (value: string) => new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta',
});
const formatPublishedAt = (value: string) => new Date(value).toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta',
});

export default function InformasiShow({ information }: { information: Informasi }) {
    const [activeImage, setActiveImage] = useState<number | null>(null);
    const images = information.images || [];
    const registrationUrl = safeExternalUrl(information.beasiswa?.registrationUrl);
    const posterUrl = safePosterUrl(information.beasiswa?.posterUrl);
    const instagramUrl = safeExternalUrl(information.beasiswa?.instagramUrl);
    const lombaRegistrationUrl = safeExternalUrl(information.lomba?.registrationUrl);
    const extraFields: Record<string, { key: string; label: string; date?: boolean }[]> = {
        kegiatan: [
            { key: 'eventAt', label: 'Waktu kegiatan', date: true },
            { key: 'location', label: 'Lokasi' },
            { key: 'organizer', label: 'Penyelenggara' },
        ],
        alumni: [
            { key: 'name', label: 'Nama alumni' },
            { key: 'cohort', label: 'Angkatan' },
            { key: 'topic', label: 'Topik' },
        ],
        wisuda: [
            { key: 'graduationPeriod', label: 'Periode wisuda' },
            { key: 'registrationSteps', label: 'Alur pendaftaran' },
        ],
        magang: [
            { key: 'company', label: 'Perusahaan' },
            { key: 'position', label: 'Posisi' },
            { key: 'duration', label: 'Durasi' },
        ],
    };
    const visibleFields = (extraFields[information.category] || []).filter((field) => information.detail?.[field.key]);

    useEffect(() => {
        if (activeImage === null) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setActiveImage(null);
            if (event.key === 'ArrowRight') setActiveImage((current) => current === null ? null : (current + 1) % images.length);
            if (event.key === 'ArrowLeft') setActiveImage((current) => current === null ? null : (current - 1 + images.length) % images.length);
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [activeImage, images.length]);

    return <>
        <Head title={information.title} />
        <main className="page dark min-h-screen pb-24">
            <article className="mx-auto max-w-6xl space-y-9">
                <header className="space-y-5 text-center">
                    <h1 className="title">{information.title}</h1>
                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                        <span className="paragraf capitalize">{information.category}</span>
                        {information.birdept && <span className="paragraf">{information.birdept.name}</span>}
                        <time className="paragraf" dateTime={information.publishedAt}>Terbit {formatPublishedAt(information.publishedAt)} WIB</time>
                    </div>
                    {information.expiresAt && <p className="paragraf">Berlaku sampai {formatDate(information.expiresAt)}</p>}
                </header>

                {images.length > 0 && <div className={`grid gap-4 ${images.length > 1 ? 'sm:grid-cols-2' : ''} ${images.length > 2 ? 'lg:grid-cols-3' : ''}`}>
                    {images.map((image, index) => <button
                        key={image.id}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        className="group flex min-h-48 items-center justify-center overflow-hidden rounded-2xl bg-black/20 focus-visible:outline-4 focus-visible:outline-[#F4E06D]"
                        aria-label={`Perbesar gambar ${index + 1} dari ${images.length}`}
                    >
                        <img src={image.url} alt={`Dokumentasi ${information.title} ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} className="max-h-[36rem] w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" />
                    </button>)}
                </div>}

                <div className="space-y-7">
                    <p className="paragraf whitespace-pre-line">{information.description}</p>
                    {information.source && <p className="paragraf">Sumber: {information.source}</p>}
                </div>

                {visibleFields.length > 0 && <section className="space-y-4 border-t border-white/25 pt-8">
                    <h2 className="subtitle">Rincian Informasi</h2>
                    <dl className="space-y-3">{visibleFields.map((field) => <div key={field.key} className="paragraf">
                        <dt className="inline font-bold">{field.label}: </dt>
                        <dd className="inline whitespace-pre-line">{field.date ? formatPublishedAt(information.detail![field.key]!) : information.detail![field.key]}</dd>
                    </div>)}</dl>
                </section>}

                {information.beasiswa && <section className="space-y-7 border-t border-white/25 pt-8">
                    {information.beasiswa.organizer && <p className="paragraf"><strong>Penyelenggara:</strong> {information.beasiswa.organizer}</p>}
                    {(information.beasiswa.opensOn || information.beasiswa.closesOn) && <p className="paragraf">Pendaftaran: {information.beasiswa.opensOn ? formatDate(information.beasiswa.opensOn) : 'Belum diumumkan'} sampai {information.beasiswa.closesOn ? formatDate(information.beasiswa.closesOn) : 'Belum diumumkan'}</p>}
                    {information.beasiswa.scholarshipRequirements.length > 0 && <div>
                        <h2 className="subtitle">Persyaratan</h2>
                        <ul className="list-disc space-y-2 pl-6">{information.beasiswa.scholarshipRequirements.map((item) => <li className="paragraf" key={item.id}>{item.requirement}: {item.description}</li>)}</ul>
                    </div>}
                    {information.beasiswa.scholarshipBenefits.length > 0 && <div>
                        <h2 className="subtitle">Manfaat</h2>
                        <ul className="list-disc space-y-2 pl-6">{information.beasiswa.scholarshipBenefits.map((item) => <li className="paragraf" key={item.id}>{item.benefit}: {item.description}</li>)}</ul>
                    </div>}
                    {registrationUrl && <a href={registrationUrl} target="_blank" rel="noopener noreferrer" className="inline-block rounded-xl bg-[#F4E06D] px-6 py-3 font-bold text-[#19243A] hover:bg-white">Buka pendaftaran</a>}
                    {(posterUrl || instagramUrl) && <div className="flex flex-wrap gap-3">
                        {posterUrl && <a href={posterUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/40 px-5 py-2 font-roboto font-bold text-white hover:bg-white/10">Lihat poster</a>}
                        {instagramUrl && <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/40 px-5 py-2 font-roboto font-bold text-white hover:bg-white/10">Instagram</a>}
                    </div>}
                </section>}

                {information.lomba && <section className="space-y-5 border-t border-white/25 pt-8">
                    <h2 className="subtitle">Rincian Lomba</h2>
                    {information.lomba.organizer && <p className="paragraf"><strong>Penyelenggara:</strong> {information.lomba.organizer}</p>}
                    {(information.lomba.opensOn || information.lomba.closesOn) && <p className="paragraf">Pendaftaran: {information.lomba.opensOn ? formatDate(information.lomba.opensOn) : 'Belum diumumkan'} sampai {information.lomba.closesOn ? formatDate(information.lomba.closesOn) : 'Belum diumumkan'}</p>}
                    {lombaRegistrationUrl && <a href={lombaRegistrationUrl} target="_blank" rel="noopener noreferrer" className="inline-block rounded-xl bg-[#F4E06D] px-6 py-3 font-bold text-[#19243A] hover:bg-white">Daftar lomba</a>}
                </section>}
            </article>
        </main>

        {activeImage !== null && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10192D]/95 p-4" role="dialog" aria-modal="true" aria-label={`Gambar ${activeImage + 1} dari ${images.length}`} onClick={() => setActiveImage(null)}>
            <button type="button" aria-label="Tutup gambar" onClick={() => setActiveImage(null)} className="absolute right-4 top-4 rounded-full bg-white/15 p-3 text-white hover:bg-white/30"><X size={24} /></button>
            {images.length > 1 && <button type="button" aria-label="Gambar sebelumnya" onClick={(event) => { event.stopPropagation(); setActiveImage((activeImage - 1 + images.length) % images.length); }} className="absolute left-3 rounded-full bg-white/15 p-3 text-white hover:bg-white/30 sm:left-6"><ChevronLeft size={26} /></button>}
            <img src={images[activeImage].url} alt={`Dokumentasi ${information.title} ${activeImage + 1}`} onClick={(event) => event.stopPropagation()} className="max-h-[85vh] max-w-[85vw] object-contain" />
            {images.length > 1 && <button type="button" aria-label="Gambar berikutnya" onClick={(event) => { event.stopPropagation(); setActiveImage((activeImage + 1) % images.length); }} className="absolute right-3 rounded-full bg-white/15 p-3 text-white hover:bg-white/30 sm:right-6"><ChevronRight size={26} /></button>}
            {images.length > 1 && <span className="absolute bottom-4 text-sm text-white">{activeImage + 1} / {images.length}</span>}
        </div>}
    </>;
}

InformasiShow.layout = (page: React.ReactNode) => <AppLayout children={page} />;
