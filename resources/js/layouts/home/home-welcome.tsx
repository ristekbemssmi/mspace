import { useState, useEffect } from 'react';

export default function HomeWelcome() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 768);
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    const maskX = isMobile ? '30%' : '60%';

    return (
        <section id="welcome" className="relative layout min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-9rem)] flex items-center mb-20">
            {/* Background Image Setup */}
            <div className="absolute top-0 -right-100 md:-right-32 h-full w-[calc(100%+20rem)] md:w-[calc(60%+8rem)] -z-10 overflow-hidden opacity-40 md:opacity-100">
                <div
                    className="w-full h-full bg-cover bg-right md:bg-top-right"
                    style={{
                        backgroundImage: `url('/img/welcome.png')`,
                        WebkitMaskImage: `
                            linear-gradient(to right, transparent 0%, black ${maskX}),
                            linear-gradient(to top, transparent 0%, black 50%)
                        `,
                        WebkitMaskComposite: 'source-in',
                        maskImage: `
                            linear-gradient(to right, transparent 0%, black ${maskX}),
                            linear-gradient(to top, transparent 0%, black 50%)
                        `,
                        maskComposite: 'intersect'
                    }}
                >
                </div>
            </div>



            {/* Content Setup */}
            <div className="w-full md:w-6/10 z-20">
                {/* Main Title */}
                <h1 className="title">
                    Sekolah Sains <br />
                    Data Matematika <br />
                    dan Informatika
                </h1>

                {/* Subtitle / Paragraph */}
                <p className="text-white/80 text-base sm:text-lg md:text-xl font-roboto md:w-5/6 leading-relaxed mt-8">
                    Selamat datang di M-SPACE website resmi BEM SSMI IPB University 2025/2026. Kami menyajikan informasi seputar civitas SSMI.
                </p>
            </div>
        </section>

    );
}
