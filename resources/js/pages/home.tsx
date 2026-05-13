import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import HeaderLayout from '@/layouts/header';
import HomeBeasiswa from '@/layouts/home/home-beasiswa';
import HomeBEM from '@/layouts/home/home-bem';
import HomeInfo from '@/layouts/home/home-info';
import HomeFaq from '@/layouts/home/home-faq';
// import HomeLogo from '@/layouts/home/home-logo';
import HomeVisi from '@/layouts/home/home-visi';
import HomeSlogan from '@/layouts/home/home-slogan';
import FooterLayout from '@/layouts/footer';
import HomeProker from '@/layouts/home/home-proker';

import HomeWelcome from '@/layouts/home/home-welcome';

export default function Home({ news, scholarships, faqs, prokers }: { news: any[], scholarships: any[], faqs: any[], prokers: any[] }) {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Head title='Home'>
                <link href="https://fonts.googleapis.com" rel="stylesheet" />
                <link href="https://fonts.cdnfonts.com/css/helvetica-255" rel="stylesheet" />
            </Head>
            <main className="page">

                {/* Welcome */}
                <div className="reveal reveal-up">
                    <HomeWelcome />
                </div>

                {/* Visi dan Misi */}
                <div className="reveal reveal-up">
                    <HomeSlogan />
                </div>

                {/* SSMI */}
                <div className="reveal reveal-right">
                    <HomeVisi />
                </div>

                {/* News */}
                <div className="reveal reveal-up">
                    <HomeInfo data={news} />
                </div>

                {/* Proker */}
                <div className="reveal reveal-up">
                    <HomeProker data={prokers} />
                </div>

                {/* Info Beasiswa */}
                <div className="reveal reveal-up">
                    <HomeBeasiswa data={scholarships} />
                </div>

                {/* FAQ */}
                <div className="reveal reveal-up">
                    <HomeFaq data={faqs} />
                </div>
            </main>
            {/* Footer */}
            <FooterLayout />
        </>
    );
}

Home.layout = (page: React.ReactNode) => <HeaderLayout children={page} />;