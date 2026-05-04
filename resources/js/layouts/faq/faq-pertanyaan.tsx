import { useState } from "react";

export default function FaqPertanyaan() {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <>
            <section id="faq-pertanyaan">
                <div className="p-10 md:p-16 text-center font-helvetica">
                    <div className="flex flex-col gap-10 bg-[#FCF8DC] rounded-4xl p-5">
                        <div className="pb-2 bg-linear-to-b from-[#324879] to-[#19243A] bg-clip-text text-transparent font-black text-2xl md:text-5xl">
                            Pertanyaan yang<br className="hidden md:block"/>
                            sering diucapkan
                        </div>
                        <div>
                            <button className="flex w-full bg-linear-to-b from-white to-[#F4E06D] to-200% rounded-2xl p-5 border-2 border-[#19243A]">
                                <p className="text-lg md:text-2xl text-left text-black font-normal">
                                    Dapatkan Informasi Seputar SSMI melalui website ini
                                </p>
                                <span className="text-[#19243A] group-hover:text-[#1f58d4] group-hover:scale-110 transition flex items-center justify-center"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    <svg className={`h-4 w-4 transition-all ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </span>
                            </button>
                            <div className={`px-5 md:px-10 bg-transparent rounded-lg w-full right-4 top-full transition-all overflow-hidden
                                ${isDropdownOpen ? 'block' : 'hidden'}`}>
                                <div className="p-6 bg-white border-x-2 border-b-2 border-[#19243A] rounded-b-2xl">
                                    <p className="text-justify text-lg md:text-2xl text-black font-normal">
                                        Sekolah Sains Data, Matematika, dan Informatika (SSMI) IPB University merupakan salah satu unit akademik di IPB yang berfokus pada pengembangan ilmu pengetahuan di bidang matematika, statistika, ilmu komputer, kecerdasan artifisial, serta aktuaria. SSMI menjadi wadah bagi mahasiswa untuk mempelajari, mengembangkan, dan menerapkan ilmu 
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className="flex w-full bg-linear-to-b from-white to-[#F4E06D] to-200% rounded-2xl p-5 border-2 border-[#19243A]">
                                <p className="text-lg md:text-2xl text-left text-black font-normal">
                                    Dapatkan Informasi Seputar SSMI melalui website ini
                                </p>
                                <span className="text-[#19243A] group-hover:text-[#1f58d4] group-hover:scale-110 transition flex items-center justify-center"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    <svg className={`h-4 w-4 transition-all ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </span>
                            </button>
                            <div className={`px-5 md:px-10 bg-transparent rounded-lg w-full right-4 top-full transition-all overflow-hidden
                                ${isDropdownOpen ? 'block' : 'hidden'}`}>
                                <div className="p-6 bg-white border-x-2 border-b-2 border-[#19243A] rounded-b-2xl">
                                    <p className="text-justify text-lg md:text-2xl text-black font-normal">
                                        Sekolah Sains Data, Matematika, dan Informatika (SSMI) IPB University merupakan salah satu unit akademik di IPB yang berfokus pada pengembangan ilmu pengetahuan di bidang matematika, statistika, ilmu komputer, kecerdasan artifisial, serta aktuaria. SSMI menjadi wadah bagi mahasiswa untuk mempelajari, mengembangkan, dan menerapkan ilmu 
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </section>
        </>
    );
}
