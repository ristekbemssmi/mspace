import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import HeaderLayout from '@/layouts/header';
import AkademikKalender from '@/layouts/akademik/akademik-kalender';
import AkademikPedoman from '@/layouts/akademik/akademik-pedoman';
import AkademikPrestasi from '@/layouts/akademik/akademik-prestasi';


export default function Akademik() {

    return (
        <>
            <Head>
                <title>Akademik</title>
                <link href="https://fonts.googleapis.com" rel="stylesheet" />
                <link href="https://fonts.cdnfonts.com/css/helvetica-255" rel="stylesheet" />
            </Head>
            <main className="mx-auto max-w-screen bg-[url(./../../public/img/bg.svg)] bg-center bg-repeat bg-auto [&_p]:leading-5 sm:[&_p]:leading-relaxed">
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