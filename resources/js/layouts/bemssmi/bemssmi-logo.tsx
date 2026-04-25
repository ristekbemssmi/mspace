export default function BemLogo() {
    return (
        <>
            <section id="ssmi-logo" className="p-5 sm:p-14 md:p-16">
                <div className="font-bold bg-linear-to-b from-white to-[#F4E06D] bg-clip-text text-transparent text-3xl md:text-5xl pb-3 text-center">Makna Logo Berdikari</div>
                <div className="w-full flex flex-col md:flex-row-reverse items-center justify-center gap-10 md:gap-16">
                    <div className="w-full md:w-5/12">
                        <img src="./img/logo-lengkap.svg" alt="Makna Logo" className="w-full" />
                    </div>
                    <div className="w-full md:w-7/12">
                        <p className="text-xl md:text-3xl text-[#F1F5FF] text-justify font-roboto">
                            Logo ini terdiri dari beberapa elemen yang saling melengkapi yaitu burung merpati, ombak, lingkaran, dua helai daun, dan akar merpati yang menyerupai akar. Menghadirkan sebuah identitas visual yang menekankan keterhubungan antara perdamaian, gerak maju, keutuhan, pertumbuhan, dan akar yang kokoh, sehingga setiap elemen yang ditampilkan bukan sekadar ornamen, melainkan simbol perjalanan yang berkesinambungan dan berlandaskan fondasi yang kuat.                        </p>
                    </div>
                </div>
                
            </section>
        </>
    );
}
