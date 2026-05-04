export default function HomeLogo() {
    return (
        <>
            <section id="makna-logo" className="w-full min-h-screen flex flex-col md:flex-row items-center justify-center p-10 md:p-16 gap-10 md:gap-16">
                <div className="w-full md:w-5/12">
                    <img src="./img/logo-lengkap.svg" alt="Makna Logo" className="w-full" />
                </div>
                <div className="w-full md:w-7/12">
                    <h2 className="font-bold bg-linear-to-b from-white to-[#F4E06D] bg-clip-text text-transparent text-4xl md:text-7xl pb-5 mb-5">Makna Logo</h2>
                    <p className="text-xl md:text-3xl text-[#F1F5FF] text-justify font-roboto">
                        Sekolah Sains Data, Matematika, dan Informatika (SSMI) IPB University merupakan salah satu unit akademik di IPB yang berfokus pada pengembangan ilmu pengetahuan di bidang matematika, statistika, ilmu komputer, kecerdasan artifisial, serta aktuaria. SSMI menjadi wadah bagi mahasiswa untuk mempelajari, mengembangkan, dan menerapkan ilmu
                    </p>
                </div>
            </section>
        </>
    );
}
