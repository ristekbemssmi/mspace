export default function HomeBEM() {
    return (
        <>
            <section id="home-bem" className="w-full min-h-screen flex flex-col md:flex-row-reverse items-center justify-center gap-10 md:gap-16 layout">
                <div className="w-full flex justify-center md:w-5/12">
                    <img src="./img/logo-lengkap.svg" alt="BEM SSMI" className="w-full sm:w-2/3 md:w-full" />
                </div>
                <div className="w-full md:w-7/12">
                    <div className="text-left title">
                        BEM SSMI IPB <br className="hidden md:inline" />
                        2025 - 2026
                    </div>
                    <p className="text-justify paragraf">
                        Sekolah Sains Data, Matematika, dan Informatika (SSMI) IPB University merupakan salah satu unit akademik di IPB yang berfokus pada pengembangan ilmu pengetahuan di bidang matematika, statistika, ilmu komputer, kecerdasan artifisial, serta aktuaria. SSMI menjadi wadah bagi mahasiswa untuk mempelajari, mengembangkan, dan menerapkan ilmu.
                    </p>
                </div>
            </section>
        </>
    );
}
