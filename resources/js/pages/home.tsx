import { Head } from '@inertiajs/react';
import HeaderLayout from '@/layouts/header';
import HomeBeasiswa from '@/layouts/home/home-beasiswa';
import HomeBEM from '@/layouts/home/home-bem';
import HomeInfo from '@/layouts/home/home-info';
// import HomeLogo from '@/layouts/home/home-logo';
import HomeSSMI from '@/layouts/home/home-ssmi';
import HomeVisi from '@/layouts/home/home-visi';
// import FooterLayout from '@/layouts/footer';

export default function Home() {
    return (
        <>
            <Head title='Home'>
                <link href="https://fonts.googleapis.com" rel="stylesheet" />
                <link href="https://fonts.cdnfonts.com/css/helvetica-255" rel="stylesheet" />
            </Head>
            <main className="mx-auto max-w-screen bg-[url(./../../public/img/bg.svg)] bg-center bg-repeat bg-auto [&_p]:leading-5 sm:[&_p]:leading-relaxed">

                {/* Visi dan Misi */}
                <HomeVisi>
                </HomeVisi>

                {/* SSMI */}
                <HomeSSMI>
                </HomeSSMI>

                {/* BEM */}
                <HomeBEM>
                </HomeBEM>
                

                {/* News */}
                <HomeInfo>
                </HomeInfo>
                

                {/* Info Beasiswa */}
                <HomeBeasiswa>
                </HomeBeasiswa>
                
            </main>
        </>
    );
}

Home.layout = (page: React.ReactNode) => <HeaderLayout children={page} />;