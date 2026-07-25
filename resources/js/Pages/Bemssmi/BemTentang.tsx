export default function BemTentang() {
    return (
        <section id="ssmi-tentang" className="h-min-screen flex flex-col md:flex-row items-center layout gap-10 md:gap-16">
            <div className="w-full md:w-5/12">
                <div className="w-full h-96 rounded-3xl flex items-center justify-center overflow-hidden">
                    <img src="/img/logo-lengkap.svg" alt="Logo BEM SSMI" width="400" height="400" loading="lazy" className="object-contain h-full p-4 md:p-0" />
                </div>
            </div>
            <div className="w-full md:w-7/12">
                <div className="title">
                    Apa itu BEM SSMI?
                </div>
                <p className="text-justify paragraf">
                    BEM SSMI merupakan organisasi eksekutif tingkat fakultas/sekolah yang berada di bawah naungan IPB University, Sekolah Sains Data, Matematika dan Informatika.
                </p>
                <div className="title mt-10">
                    Visi BEM SSMI?
                </div>
                <p className="text-justify paragraf">
                    Mewujudkan BEM SSMI IPB sebagai inisiator, aktivator, dan katalisator dalam
                    merealisasikan KM SSMI yang sejahtera serta menumbuhkan kolaborasi
                    berkelanjutan, demi terciptanya kemajuan KM SSMI yang menyeluruh.
                </p>
            </div>
        </section>
    );
}
