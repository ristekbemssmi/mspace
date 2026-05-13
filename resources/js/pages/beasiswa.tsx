import { Head } from '@inertiajs/react';
import React from 'react';
import HeaderLayout from '@/layouts/header';
import BeasiswaTentang from '@/layouts/beasiswa/beasiswa-tentang';
import BeasiswaCard from '@/layouts/beasiswa/beasiswa-card';

export default function InformasiBeasiswa({ beasiswaData = [] }: { beasiswaData?: any[] }) {
    return (
        <>
            <Head>
                <title>Informasi Beasiswa</title>
                <link href="https://fonts.googleapis.com" rel="stylesheet" />
                <link href="https://fonts.cdnfonts.com/css/helvetica-255" rel="stylesheet" />
            </Head>

            <main className="page">

                {/* Header Section */}
                <BeasiswaTentang />

                {/* Cards Section */}
                <BeasiswaCard beasiswaData={beasiswaData} />

            </main>
        </>
    );
}

// Menerapkan layout header dan footer yang sama seperti halaman akademik
InformasiBeasiswa.layout = (page: React.ReactNode) => <HeaderLayout children={page} />;