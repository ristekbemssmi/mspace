export default function AkademikPrestasi() {
    return (
        <section id="akademik-prestasi" className="w-full relative min-h-screen flex flex-col items-center justify-center p-10 md:p-16 gap-10 md:gap-16">
            <div className="w-full text-center">
                <h2 className="title">
                    Prestasi KM SSMI
                </h2>
            </div>
            <div className="relative w-full flex items-center justify-center gap-4 md:gap-8">
                <div className="hidden md:block w-32 h-64 bg-white/20 rounded-3xl blur-[2px] opacity-50 shrink-0"></div>
                <div className="w-10/12 md:w-9/12 h-96 bg-white rounded-[40px] shadow-2xl z-10 shrink-0"></div>
                <div className="hidden md:block w-32 h-64 bg-white/20 rounded-3xl blur-[2px] opacity-50 shrink-0"></div>
                <button type="button" aria-label="Slide sebelumnya" className="absolute left-4 md:left-10 z-20 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <button type="button" aria-label="Slide berikutnya" className="absolute right-4 md:right-10 z-20 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>

            <div className="flex justify-center gap-2 mt-8">
                <button type="button" aria-label="Ke slide 1" className="w-3 h-3 rounded-full bg-[#F4E06D]"></button>
                <button type="button" aria-label="Ke slide 2" className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/50 transition"></button>
                <button type="button" aria-label="Ke slide 3" className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/50 transition"></button>
            </div>
        </section>
    );
}
