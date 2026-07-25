export default function AboutSection() {
    return (
        <section id="home-visi" className="w-full flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 layout">
            <div className="w-full md:w-5/12">
                <img src="/img/fotbar.webp" width="1200" height="800" loading="lazy" className="w-full rounded-3xl object-cover" alt="Foto Anggota BEM SSMI" />
            </div>
            <div className="w-full md:w-7/12">
                <div className="text-left title">
                    Apa itu SSMI ?
                </div>
                <p className="text-justify paragraf">
                    Sekolah Sains Data, Matematika, dan Informatika (SSMI) IPB University resmi
                    berdiri pada 22 Maret 2024. Sekolah ini terdiri dari program studi Statistika dan Sains Data, Matematika, Ilmu Komputer, Aktuaria, dan Kecerdasan Buatan.
                    Pembentukan sekolah ini bertujuan untuk menjadikan IPB University sebagai pelopor dalam pengembangan sains data dan pemanfaatan teknologi kecerdasan buatan untuk memajukan pendidikan dan perekonomian Indonesia.
                </p>
            </div>
        </section>
    );
}
