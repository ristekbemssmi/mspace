import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import AkademikKalender from '@/layouts/akademik/akademik-kalender';
import AkademikPedoman from '@/layouts/akademik/akademik-pedoman';
import AkademikPrestasi from '@/layouts/akademik/akademik-prestasi';
import HeaderLayout from '@/layouts/header';


export default function Akademik() {

    return (
        <>
            <Head>
                <title>Akademik</title>
                <link href="https://fonts.googleapis.com" rel="stylesheet" />
                <link href="https://fonts.cdnfonts.com/css/helvetica-255" rel="stylesheet" />
            </Head>
            <main className="page">
                {/* Akademik Kalender */}
                <AkademikKalender>
                </AkademikKalender>

                {/* Akademik Pedoman */}
                <AkademikPedoman>
                </AkademikPedoman>

                {/* Akademik Prestasi */}
                <AkademikPrestasi>
                </AkademikPrestasi>
            </main>
        </>
    );
}

// 4. Beri tipe data React.ReactNode pada parameter page
Akademik.layout = (page: React.ReactNode) => <HeaderLayout children={page} />;