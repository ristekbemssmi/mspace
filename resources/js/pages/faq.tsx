import React from 'react';
import { Head } from '@inertiajs/react';
import FaqPenjelasan from '@/layouts/faq/faq-penjelasan';
import FaqPertanyaan from '@/layouts/faq/faq-pertanyaan';
import HeaderLayout from '@/layouts/header';
import FaqSearch from '@/layouts/faq/faq-search';


export default function faq({ faqs = [] }: { faqs?: any[] }) {
    return (
        <>
            <Head title='FAQ'>
                <link href="https://fonts.googleapis.com" rel="stylesheet" />
                <link href="https://fonts.cdnfonts.com/css/helvetica-255" rel="stylesheet" />
            </Head>
            <main className="mx-auto max-w-screen min-h-screen bg-[url(./../../public/img/bg.svg)] bg-center bg-repeat bg-auto [&_p]:leading-5 sm:[&_p]:leading-relaxed">

                {/* Search */}
                <FaqSearch>
                </FaqSearch>

                {/* Penjelasan */}
                <FaqPenjelasan>
                </FaqPenjelasan>

                {/* Pertanyaan */}
                <FaqPertanyaan faqs={faqs}>
                </FaqPertanyaan>

            </main>
        </>
    );
}

faq.layout = (page: React.ReactNode) => <HeaderLayout children={page} />;