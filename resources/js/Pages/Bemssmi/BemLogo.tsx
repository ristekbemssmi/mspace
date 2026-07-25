export default function BemLogo() {
    return (
        <section id="ssmi-logo" className="layout">
            <div className="text-center title">Makna Logo Langkah Berdikari</div>
            <div className="w-full flex flex-col md:flex-row-reverse items-center justify-center gap-10 md:gap-16">
                <div className="w-full md:w-5/12">
                    <img src="/img/logo-lengkap.svg" alt="Makna Logo" width="500" height="500" loading="lazy" className="w-full" />
                </div>
                <div className="w-full md:w-7/12">
                    <p className="text-justify paragraf">
                        Logo ini terdiri dari beberapa elemen yang saling melengkapi yaitu burung merpati, ombak, lingkaran, dua helai daun, dan akar merpati yang menyerupai akar. Menghadirkan sebuah identitas visual yang menekankan keterhubungan antara perdamaian, gerak maju, keutuhan, pertumbuhan, dan akar yang kokoh, sehingga setiap elemen yang ditampilkan bukan sekadar ornamen, melainkan simbol perjalanan yang berkesinambungan dan berlandaskan fondasi yang kuat.
                    </p>
                </div>
            </div>
        </section>
    );
}
