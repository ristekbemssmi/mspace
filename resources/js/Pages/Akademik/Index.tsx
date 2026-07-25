import { Head } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import AkademikKalender from './AkademikKalender';
import AkademikPedoman from './AkademikPedoman';
import AkademikPrestasi from './AkademikPrestasi';

export default function Akademik() {
    return (
        <>
            <Head title="Akademik" />
            <main className="page">
                {/* Akademik Kalender */}
                <AkademikKalender />

                {/* Akademik Pedoman */}
                <AkademikPedoman />

                {/* Akademik Prestasi */}
                <AkademikPrestasi />
            </main>
        </>
    );
}

Akademik.layout = (page: React.ReactNode) => <AppLayout children={page} />;
