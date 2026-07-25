export default function AkademikPedoman() {
    return (
        <section id="akademik-pedoman" className="layout">
            <div className="text-center title">
                Buku Pedoman
            </div>
            <div className="flex flex-col gap-10 bg-linear-to-b from-white to-[#F4E06D] to-150% rounded-4xl p-5 md:p-10 border-2 border-black">
                <div className="flex gap-6 items-center">
                    <img src="https://www.ipb.ac.id/wp-content/uploads/2025/08/Logo-IPB-New.png" alt="Logo IPB" width="100" height="100" loading="lazy" className="w-1/5 shrink-0" />
                    <div className="flex flex-col gap-2">
                        <div className="text-left subtitle-dark">
                            Buku Panduan Akademik
                        </div>
                        <p className="text-justify paragraf-dark">Buku panduan akademik adalah dokumen resmi yang dikeluarkan oleh Institut Pertanian Bogor yang berisi informasi rinci yang membantu mahasiswa menjalani pendidikan secara sistematis dan sesuai prosedur.</p>
                        <div className="flex gap-2">
                            <a href="" className="text-lg md:text-xl block rounded-4xl border-2 border-black px-2 py-1 hover:bg-[#324879] hover:text-white transition-all">Unduh</a>
                            <a href="" className="text-lg md:text-xl block rounded-4xl border-2 border-black px-2 py-1 hover:bg-[#324879] hover:text-white transition-all">Lihat</a>
                        </div>
                    </div>
                </div>
                <div className="flex gap-6 items-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Logo_Kampus_Merdeka_Kemendikbud.png/1920px-Logo_Kampus_Merdeka_Kemendikbud.png" alt="Logo Kampus Merdeka" width="100" height="100" loading="lazy" className="w-1/5 shrink-0" />
                    <div className="flex flex-col gap-2">
                        <div className="text-left subtitle-dark">
                            Buku Panduan MBKM
                        </div>
                        <p className="text-justify paragraf-dark">Buku ini merupakan Buku Panduan Merdeka Belajar Kampus Merdeka yang dipersiapkan pemerintah untuk mendukung implementasi Kurikulum Pendidikan Tinggi (KPT) di Perguruan Tinggi.</p>
                        <div className="flex gap-2">
                            <a href="" className="text-lg md:text-xl block rounded-4xl border-2 border-black px-2 py-1 hover:bg-[#324879] hover:text-white transition-all">Unduh</a>
                            <a href="" className="text-lg md:text-xl block rounded-4xl border-2 border-black px-2 py-1 hover:bg-[#324879] hover:text-white transition-all">Lihat</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
