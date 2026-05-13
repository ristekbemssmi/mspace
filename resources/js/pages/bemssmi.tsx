import { Head } from '@inertiajs/react';
import React from 'react';
import BemBirdept from '@/layouts/bemssmi/bemssmi-birdept';
import BemDetail from '@/layouts/bemssmi/bemssmi-detail';
import BemLogo from '@/layouts/bemssmi/bemssmi-logo';
import BemMisi from '@/layouts/bemssmi/bemssmi-misi';
import BemTentang from '@/layouts/bemssmi/bemssmi-tentang';
import BemVisi from '@/layouts/bemssmi/bemssmi-visi';
import HeaderLayout from '@/layouts/header';


export default function Bemssmi({ birdepts = [] }: { birdepts?: any[] }) {
    return (
        <>
            <Head title='BEM SSMI'>
                <link href="https://fonts.googleapis.com" rel="stylesheet" />
                <link href="https://fonts.cdnfonts.com/css/helvetica-255" rel="stylesheet" />
            </Head>
            <main className="page">

                {/* Tagline SSMI */}
                <BemVisi>
                </BemVisi>

                {/* Bem SSMI */}
                <BemTentang>
                </BemTentang>

                {/* Bem Misi */}
                <BemMisi>
                </BemMisi>

                {/* Bem Logo */}
                <BemLogo>
                </BemLogo>

                {/* Bem Logo Detail */}
                <BemDetail>
                </BemDetail>

                {/* Bem Birdept */}
                <BemBirdept birdepts={birdepts}>
                </BemBirdept>

            </main>
        </>
    );
}

Bemssmi.layout = (page: React.ReactNode) => <HeaderLayout children={page} />;