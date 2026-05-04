export default function HomeInfo() {
    return (
        <>
            <section id="news" className="w-full relative min-h-screen flex flex-col items-center justify-center p-10 md:p-16 gap-10 md:gap-16">
                <div className="w-full text-center">
                    <h2 className="bg-linear-to-b from-white to-[#F4E06D] bg-clip-text text-transparent font-bold text-4xl md:text-7xl mb-5 font-helvetica">SSMI NEWS</h2>
                    <p className="text-xl md:text-3xl text-[#F1F5FF] font-roboto">
                        Menghadirkan informasi-informasi seputar SSMI IPB.
                    </p>
                </div>
                <div className="relative w-full flex items-center justify-center gap-4 md:gap-8">
                    <div className="hidden md:block w-32 h-64 bg-white/20 rounded-3xl blur-[2px] opacity-50 shrink-0"></div>
                    <div className="w-10/12 md:w-9/12 h-96 bg-white rounded-[40px] shadow-2xl z-10 shrink-0"></div>
                    <div className="hidden md:block w-32 h-64 bg-white/20 rounded-3xl blur-[2px] opacity-50 shrink-0"></div>
                    <button className="absolute left-4 md:left-10 z-20 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button className="absolute right-4 md:right-10 z-20 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>

                <div className="flex justify-center gap-2 mt-8">
                    <button className="w-3 h-3 rounded-full bg-[#F4E06D]"></button>
                    <button className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/50 transition"></button>
                    <button className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/50 transition"></button>
                </div>
            </section>
        </>
    );
}
