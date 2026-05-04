import React from 'react';
import { Head } from '@inertiajs/react';
import BemBirdept from '@/layouts/bemssmi/bemssmi-birdept';
import BemDetail from '@/layouts/bemssmi/bemssmi-detail';
import BemLogo from '@/layouts/bemssmi/bemssmi-logo';
import BemMisi from '@/layouts/bemssmi/bemssmi-misi';
import BemTentang from '@/layouts/bemssmi/bemssmi-tentang';
import HeaderLayout from '@/layouts/header';
import HomeVisi from '@/layouts/home/home-visi';


export default function Bemssmi({ birdepts = [] }: { birdepts?: any[] }) {
    return (
        <>
            <Head title='BEM SSMI'>
                <link href="https://fonts.googleapis.com" rel="stylesheet" />
                <link href="https://fonts.cdnfonts.com/css/helvetica-255" rel="stylesheet" />
            </Head>
            <main className="mx-auto max-w-screen bg-[url(./../../public/img/bg.svg)] bg-center bg-repeat bg-auto [&_p]:leading-5 sm:[&_p]:leading-relaxed">

                {/* Tagline SSMI */}
                <HomeVisi>
                </HomeVisi>

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