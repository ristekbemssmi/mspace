import { Head } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import BemBirdept from './BemBirdept';
import BemDetail from './BemDetail';
import BemLogo from './BemLogo';
import BemMisi from './BemMisi';
import BemTentang from './BemTentang';
import BemVisi from './BemVisi';

export default function Bemssmi({ units = [] }: { units?: any[] }) {
    return (
        <>
            <Head title="BEM SSMI" />
            <main className="page">
                {/* Tagline SSMI */}
                <BemVisi />

                {/* Bem SSMI */}
                <BemTentang />

                {/* Bem Misi */}
                <BemMisi />

                {/* Bem Logo */}
                <BemLogo />

                {/* Bem Logo Detail */}
                <BemDetail />

                {/* Bem Birdept */}
                <BemBirdept units={units} />
            </main>
        </>
    );
}

Bemssmi.layout = (page: React.ReactNode) => <AppLayout children={page} />;
