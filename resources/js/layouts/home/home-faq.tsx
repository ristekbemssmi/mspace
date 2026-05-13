import React, { useState } from 'react';

const FaqItem = ({ pertanyaan, jawaban }: { pertanyaan: string, jawaban: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                className="flex w-full bg-linear-to-b from-white to-[#F4E06D] to-200% rounded-2xl p-5 border-2 border-[#19243A] justify-between items-center cursor-pointer hover:opacity-90 transition-all duration-300"
                onClick={() => setIsOpen(!isOpen)}
            >
                <p className="text-left paragraf-dark">
                    {pertanyaan}
                </p>
                <span className="paragraf-dark transition flex items-center justify-center shrink-0">
                    <svg className={`h-6 w-6 transition-all duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="px-5 md:px-10 bg-transparent rounded-lg w-full">
                        <div className="p-6 bg-white border-x-2 border-b-2 border-[#19243A] rounded-b-2xl shadow-xl">
                            <p className="text-justify whitespace-pre-wrap paragraf-dark text-sm md:text-base leading-relaxed">
                                {jawaban}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function HomeFaq({ data = [] }: { data: any[] }) {
    if (data.length === 0) return null;

    return (
        <section id="home-faq" className="w-full py-20 relative">
            <div className="container mx-auto flex flex-col items-center">
                <div className="text-center mb-12">
                    <h2 className="title text-3xl md:text-4xl lg:text-5xl mb-4">
                        FAQ
                    </h2>
                </div>

                <div className="w-full max-w-4xl flex flex-col gap-6">
                    {data.map((item, index) => (
                        <FaqItem
                            key={item.id || index}
                            pertanyaan={item.pertanyaan}
                            jawaban={item.jawaban}
                        />
                    ))}
                </div>

                <div className="mt-16">
                    <a
                        href="/faq"
                        className="bg-linear-to-b from-white to-[#F4E06D] text-[#19243A] px-8 py-3 rounded-full font-bold text-base shadow-xl hover:scale-105 transition-transform active:scale-95 inline-block"
                    >
                        Info Selengkapnya
                    </a>
                </div>
            </div>
        </section>
    );
}
