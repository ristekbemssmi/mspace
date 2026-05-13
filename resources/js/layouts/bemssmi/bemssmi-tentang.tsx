export default function BemTentang() {
    return (
        <>
            <section id="ssmi-tentang" className="h-min-screen flex flex-col md:flex-row items-center layout gap-10 md:gap-16">
                <div className="w-full md:w-5/12">
                    <div className="w-full h-96 rounded-3xl flex items-center justify-center overflow-hidden">
                        <img src="/img/logo-lengkap.svg" alt="Logo BEM SSMI" className="object-contain h-full p-4 md:p-0" />
                    </div>
                </div>
                <div className="w-full md:w-7/12">
                    <div className="title">
                        Apa itu BEM SSMI?
                    </div>
                    <p className="text-justify paragraf">
                        Merpati sebagai simbol ketenangan, kesetiaan, dan perdamaian. Burung ini bergerak dengan lembut namun pasti, mencerminkan langkah maju yang tidak tergesa tetapi konsisten. Kesetiaan merpati selalu kembali ke asal menjadi gambaran tentang pijakan kuat pada akar dan nilai sendiri. Sifat damainya menunjukkan bahwa kemandirian tidak harus keras, melainkan bisa tumbuh dari arah yang tenang.                    </p>
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
        </>
    );
}
