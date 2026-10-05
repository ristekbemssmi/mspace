import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, Search } from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export type CategoryItem = {
    id: number;
    title: string;
    description: string;
    publishedAt: string;
    expiresAt: string | null;
    birdept: string | null;
    detailUrl: string;
    detail: Record<string, string | null> | null;
};

export type DetailField = {
    key: string;
    label: string;
    format?: 'date' | 'datetime';
};

type Props = {
    title: string;
    introduction: string;
    searchLabel: string;
    items: CategoryItem[];
    fields: DetailField[];
    headerLink?: { href: string; label: string };
};

const dateFormat = (value: string, withTime = false) => new Date(value).toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    timeZone: 'Asia/Jakarta',
});

function InformationCategoryPage({ title, introduction, searchLabel, items, fields, headerLink }: Props) {
    const [search, setSearch] = useState('');
    const filteredItems = items.filter((item) =>
        `${item.title} ${item.description} ${item.birdept || ''}`.toLocaleLowerCase('id-ID')
            .includes(search.trim().toLocaleLowerCase('id-ID')),
    );

    return <>
        <Head title={title} />
        <main className="page dark min-h-screen pb-20">
            <section className="layout mx-auto max-w-5xl text-center">
                <h1 className="title">{title}</h1>
                <p className="paragraf">{introduction}</p>
                {headerLink && <a href={headerLink.href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-md bg-[#FCF8DC] px-6 py-2.5 font-roboto font-bold text-[#19243A] transition hover:bg-white focus-visible:outline-4 focus-visible:outline-[#F4E06D]">{headerLink.label}</a>}
            </section>

            <section className="mx-auto max-w-6xl space-y-6" aria-label={`Daftar ${title.toLocaleLowerCase('id-ID')}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="paragraf">{filteredItems.length} informasi tersedia</p>
                    <label className="relative block w-full sm:max-w-xs">
                        <span className="sr-only">{searchLabel}</span>
                        <Search aria-hidden="true" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/75" />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={searchLabel}
                            className="w-full rounded-lg border border-white/40 bg-[#19243A]/55 py-2.5 pl-10 pr-3 font-roboto text-white placeholder:text-white/75 focus-visible:outline-2 focus-visible:outline-[#F4E06D]"
                        />
                    </label>
                </div>

                {filteredItems.length === 0 && <div className="rounded-xl border border-white/25 bg-white/10 px-6 py-10 text-center">
                    <p className="paragraf">{items.length === 0 ? `Belum ada ${title.toLocaleLowerCase('id-ID')} yang aktif.` : 'Tidak ada informasi yang sesuai pencarian.'}</p>
                </div>}

                {filteredItems.map((item) => {
                    const availableFields = fields.filter((field) => item.detail?.[field.key]);
                    return <article key={item.id} className="rounded-xl border border-[#F4E06D]/40 bg-[#FCF8DC] p-6 shadow-lg sm:p-8 lg:p-10">
                        <h2 className="subtitle-dark mb-4 pb-0! text-xl! sm:text-2xl!">{item.title}</h2>
                        <div className="grid gap-7 md:grid-cols-2 md:gap-10">
                            <div className="space-y-4">
                                <p className="paragraf-dark whitespace-pre-line text-sm! sm:text-base!">{item.description}</p>
                                <p className="paragraf-dark text-sm! sm:text-base!">
                                    {item.birdept || 'BEM SSMI'} · Terbit {dateFormat(item.publishedAt)}
                                </p>
                            </div>
                            <div className="flex flex-col justify-between gap-6">
                                <div>
                                    <h3 className="paragraf-dark mb-2 text-sm! font-bold sm:text-base!">Rincian Informasi</h3>
                                    {availableFields.length > 0 ? <dl className="space-y-2">
                                        {availableFields.map((field) => <div key={field.key} className="paragraf-dark text-sm! sm:text-base!">
                                            <dt className="inline font-bold">{field.label}: </dt>
                                            <dd className="inline whitespace-pre-line">{field.format ? dateFormat(item.detail![field.key]!, field.format === 'datetime') : item.detail![field.key]}</dd>
                                        </div>)}
                                    </dl> : <p className="paragraf-dark text-sm! sm:text-base!">Rincian tambahan belum tersedia.</p>}
                                </div>
                                <Link href={item.detailUrl} className="inline-flex w-fit items-center gap-2 self-start rounded-md bg-[#19243A] px-5 py-2.5 font-roboto text-sm font-bold text-white transition hover:bg-[#324879] focus-visible:outline-4 focus-visible:outline-[#F4E06D] md:self-end">
                                    Lihat detail <ArrowUpRight size={17} />
                                </Link>
                            </div>
                        </div>
                    </article>;
                })}
            </section>
        </main>
    </>;
}

export const informationCategoryLayout = (page: React.ReactNode) => <AppLayout children={page} />;

export default InformationCategoryPage;
