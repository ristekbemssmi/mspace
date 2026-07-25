import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import FaqSearch from './FaqSearch';
import FaqPenjelasan from './FaqPenjelasan';
import FaqPertanyaan from './FaqPertanyaan';

export default function Faq({ faqs = [] }: { faqs?: any[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFaqs = faqs.filter((faq) => {
        return faq.pertanyaan?.toLowerCase().includes(searchQuery.toLowerCase()) || 
               faq.jawaban?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <>
            <Head title="FAQ" />
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

Faq.layout = (page: React.ReactNode) => <AppLayout children={page} />;
