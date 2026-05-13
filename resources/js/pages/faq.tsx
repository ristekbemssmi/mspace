import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import FaqPenjelasan from '@/layouts/faq/faq-penjelasan';
import FaqPertanyaan from '@/layouts/faq/faq-pertanyaan';
import FaqSearch from '@/layouts/faq/faq-search';
import HeaderLayout from '@/layouts/header';


export default function faq({ faqs = [] }: { faqs?: any[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFaqs = faqs.filter((faq) => {
        return faq.pertanyaan?.toLowerCase().includes(searchQuery.toLowerCase()) || 
               faq.jawaban?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <>
            <Head title='FAQ'>
                <link href="https://fonts.googleapis.com" rel="stylesheet" />
                <link href="https://fonts.cdnfonts.com/css/helvetica-255" rel="stylesheet" />
            </Head>
            <main className="page">

                {/* Search */}
                <FaqSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                {/* Penjelasan */}
                <FaqPenjelasan />

                {/* Pertanyaan */}
                <FaqPertanyaan faqs={filteredFaqs} />

            </main>
        </>
    );
}

faq.layout = (page: React.ReactNode) => <HeaderLayout children={page} />;