export default function BemTentang() {
    return (
        <>
            <section id="ssmi-tentang" className="w-full h-min-screen flex flex-col md:flex-row items-center justify-center p-10 md:p-16 mt-16 md:m-0 gap-10 md:gap-16">
                <div className="w-full md:w-5/12">
                    <div className="w-full h-96 bg-white rounded-3xl"></div>
                </div>
                <div className="w-full md:w-7/12">
                    <div className="bg-linear-to-b from-white to-[#F4E06D] bg-clip-text text-transparent text-3xl md:text-5xl font-helvetica font-bold mb-3">
                        Apa itu BEM SSMI?
                    </div>
                    <p className="text-lg md:text-2xl text-[#F1F5FF] text-justify font-roboto">
                        Merpati sebagai simbol ketenangan, kesetiaan, dan perdamaian. Burung ini bergerak dengan lembut namun pasti, mencerminkan langkah maju yang tidak tergesa tetapi konsisten. Kesetiaan merpati selalu kembali ke asal menjadi gambaran tentang pijakan kuat pada akar dan nilai sendiri. Sifat damainya menunjukkan bahwa kemandirian tidak harus keras, melainkan bisa tumbuh dari arah yang tenang.                    </p>
                    <div className="bg-linear-to-b from-white to-[#F4E06D] bg-clip-text text-transparent text-3xl md:text-5xl font-helvetica font-bold mb-3 mt-5">
                        Visi BEM SSMI?
                    </div>
                    <p className="text-lg md:text-2xl text-[#F1F5FF] text-justify font-roboto">
                        Mewujudkan BEM SSMI IPB sebagai inisiator, aktivator, dan katalisator dalam
                        merealisasikan KM SSMI yang sejahtera serta menumbuhkan kolaborasi
                        berkelanjutan, demi terciptanya kemajuan KM SSMI yang menyeluruh.
                    </p>
                </div>
            </section>
        </>
    );
}
