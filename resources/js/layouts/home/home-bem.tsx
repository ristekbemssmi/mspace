export default function HomeBEM() {
    return (
        <>
            <section id="bem" className="w-full min-h-screen flex flex-col md:flex-row-reverse items-center justify-center p-10 md:p-16 gap-10 md:gap-16">
                <div className="w-full md:w-5/12">
                    <img src="./img/logo-lengkap.svg" alt="BEM SSMI" className="w-full min-h-full" />
                </div>
                <div className="w-full md:w-7/12">
                    <div className="bg-linear-to-b from-white to-[#F4E06D] bg-clip-text text-transparent text-3xl md:text-5xl font-helvetica font-bold mb-3">
                        BEM SSMI IPB<br />
                        2025 - 2026<br />
                    </div>
                    <p className="text-lg md:text-2xl text-[#F1F5FF] text-justify font-roboto">
                        Sekolah Sains Data, Matematika, dan Informatika (SSMI) IPB University merupakan salah satu unit akademik di IPB yang berfokus pada pengembangan ilmu pengetahuan di bidang matematika, statistika, ilmu komputer, kecerdasan artifisial, serta aktuaria. SSMI menjadi wadah bagi mahasiswa untuk mempelajari, mengembangkan, dan menerapkan ilmu.
                    </p>
                </div>
            </section>
        </>
    );
}
