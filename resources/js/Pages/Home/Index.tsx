import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import AboutSection from './AboutSection';
import FaqSection from './FaqSection';
import HeroSection from './HeroSection';
import InfoSection from './InfoSection';
import ProgramSection from './ProgramSection';
import SloganSection from './SloganSection';

export default function Home({ news, faqs, prokers }: { news: any[], faqs: any[], prokers: any[] }) {
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
            <Head title="Home" />
            <main className="page">
                {/* Welcome */}
                <div className="reveal reveal-up">
                    <HeroSection />
                </div>

                {/* Slogan */}
                <div className="reveal reveal-up">
                    <SloganSection />
                </div>

                {/* About SSMI */}
                <div className="reveal reveal-right">
                    <AboutSection />
                </div>

                {/* News */}
                <div className="reveal reveal-up">
                    <InfoSection data={news} />
                </div>

                {/* Proker */}
                <div className="reveal reveal-up">
                    <ProgramSection data={prokers} />
                </div>

                {/* FAQ */}
                <div className="reveal reveal-up">
                    <FaqSection data={faqs} />
                </div>
            </main>
        </>
    );
}

Home.layout = (page: React.ReactNode) => <AppLayout children={page} />;
