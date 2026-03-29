export default function HomeBeasiswa() {
    return (
        <>
            <section id="beasiswa" className="w-full min-h-screen flex flex-col items-center justify-center p-16 gap-10 md:gap-16">
                <h2 className="bg-linear-to-b from-white to-[#F4E06D] bg-clip-text text-transparent font-bold text-4xl md:text-7xl mb-5 font-helvetica">Info Beasiswa</h2>
                <div className="w-full md:w-9/12 lg:w-7/12 flex flex-row-reverse h-96 bg-[url(./../../public/img/beasiswa.png)] bg-origin-border bg-no-repeat bg-center bg-cover rounded-2xl overflow-hidden">
                    <div className="w-3/4 h-full bg-linear-to-r from-[#D58641]/0 via-[#D58641]/70 via-30% to-[#F4E06D] flex items-start justify-end p-5">
                        <div className="w-1/2 h-full flex flex-col items-end justify-center gap-4">
                            <h2 className="font-helvetica text-4xl/[48px] font-bold text-right text-[#324879]">Nama Beasiswa</h2>
                            <p className="text-justify font-roboto tracking-[-0.72px]">Sekolah Sains Data, Matematika, dan Informatika (SSMI) IPB University merupakan salah satu unit akademik di IPB yang berfokus pada pengembangan ilmu </p>
                            <button className="cursor-pointer bg-[#19243A] text-[#F4E06D] font-bold p-1 rounded-lg hover:bg-[#2a3c60] transition font-helvetica">
                                Persyaratan
                            </button>
                            <button className="cursor-pointer bg-[#19243A] text-[#F4E06D] font-bold p-1 rounded-lg hover:bg-[#2a3c60] transition font-helvetica">
                                Daftar Sekarang
                            </button>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
