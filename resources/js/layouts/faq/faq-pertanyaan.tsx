import { useState } from "react";

const FaqItem = ({ pertanyaan, jawaban }: { pertanyaan: string, jawaban: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                className="flex w-full bg-linear-to-b from-white to-[#F4E06D] to-200% rounded-2xl p-5 border-2 border-[#19243A] justify-between items-center cursor-pointer hover:opacity-90"
                onClick={() => setIsOpen(!isOpen)}
            >
                <p className="text-left paragraf-dark">
                    {pertanyaan}
                </p>
                <span className="text-[#19243A] transition flex items-center justify-center">
                    <svg className={`h-6 w-6 transition-all duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="px-5 md:px-10 bg-transparent rounded-lg w-full">
                        <div className="p-6 bg-white border-x-2 border-b-2 border-[#19243A] rounded-b-2xl">
                            <p className="text-justify whitespace-pre-wrap paragraf-dark">
                                {jawaban}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function FaqPertanyaan({ faqs = [] }: { faqs?: any[] }) {
    return (
        <>
            <section id="faq-pertanyaan" className="layout">
                <div className="flex flex-col gap-10 bg-[#FCF8DC] rounded-4xl p-5 md:p-10">
                    <div className="text-center title-dark">
                        Pertanyaan yang <br />
                        sering diucapkan
                    </div>

                    <div className="flex flex-col gap-6">
                        {Array.isArray(faqs) && faqs.length > 0 ? (
                            faqs.map((faq, index) => (
                                <FaqItem
                                    key={faq.id || index}
                                    pertanyaan={faq.pertanyaan}
                                    jawaban={faq.jawaban}
                                />
                            ))
                        ) : (
                            <p className="text-center paragraf-dark">Belum ada pertanyaan terkait yang tersedia saat ini.</p>
                        )}
                    </div>

                </div>
            </section>
        </>
    );
}
