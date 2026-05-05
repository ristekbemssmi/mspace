export default function AkademikPedoman() {
    return (
        <>
            <section id="faq-pertanyaan">
                <div className="p-10 md:p-16 text-center font-helvetica mx-auto">
                    <div className="pb-5 bg-linear-to-b dark:from-white dark:to-[#F4E06D] from-[#324879] to-[#19243A] bg-clip-text text-transparent font-black text-2xl md:text-5xl">
                        Buku Pedoman
                    </div>
                    <div className="flex flex-col gap-10 bg-linear-to-b from-white to-[#F4E06D] to-150% rounded-4xl p-5 md:p-10 border-2 border-black">
                        <div className="flex gap-6 items-center">
                            <img src="" alt="Logo" className="w-1/5 shrink-0" />
                            <div className="flex flex-col gap-2">
                                <div className="text-left bg-linear-to-b from-[#324879] to-[#19243A] bg-clip-text text-transparent font-black text-2xl md:text-4xl">
                                    Buku Panduan Akademik
                                </div>
                                <p className="text-justify">Buku panduan akademik adalah dokumen resmi yang dikeluarkan oleh Institut Pertanian Bogor yang berisi informasi rinci yang membantu mahasiswa menjalani pendidikan secara sistematis dan sesuai prosedur.</p>
                                <div className="flex gap-2">
                                    <a href="" className="block rounded-4xl border-2 border-black px-2 py-1 hover:scale-105 transition-all">Unduh</a>
                                    <a href="" className="block rounded-4xl border-2 border-black px-2 py-1 hover:scale-105 transition-all">Lihat</a>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-6 items-center">
                            <img src="" alt="Logo" className="w-1/5 shrink-0" />
                            <div className="flex flex-col gap-2">
                                <div className="text-left bg-linear-to-b from-[#324879] to-[#19243A] bg-clip-text text-transparent font-black text-2xl md:text-4xl">
                                    Buku Panduan MBKM
                                </div>
                                <p className="text-justify">Buku ini merupakan Buku Panduan Merdeka Belajar Kampus Merdeka yang diper siapkan pemerintah untuk mendukung implementasi Kurikulum Pendidikan Tinggi  (KPT)  di  Perguruan Tinggi.</p>
                                <div className="flex gap-2">
                                    <a href="" className="block rounded-4xl border-2 border-black px-2 py-1 hover:scale-105 transition-all">Unduh</a>
                                    <a href="" className="block rounded-4xl border-2 border-black px-2 py-1 hover:scale-105 transition-all">Lihat</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
