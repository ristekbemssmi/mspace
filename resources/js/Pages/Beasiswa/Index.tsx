import { Head } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import BeasiswaTentang from './BeasiswaTentang';
import BeasiswaCard from './BeasiswaCard';

export default function InformasiBeasiswa({ beasiswaData = [] }: { beasiswaData?: any[] }) {
    return (
        <>
            <Head title="Informasi Beasiswa" />
            <main className="page">
                {/* Header Section */}
                <BeasiswaTentang />

                {/* Cards Section */}
                <BeasiswaCard beasiswaData={beasiswaData} />
            </main>
        </>
    );
}

InformasiBeasiswa.layout = (page: React.ReactNode) => <AppLayout children={page} />;
