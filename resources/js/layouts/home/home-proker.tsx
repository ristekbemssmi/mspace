import React from 'react';

interface ProkerProps {
    name: string;
    imageSrc: string;
}

const HomeProkerCard = ({ name, imageSrc }: ProkerProps) => {
    return (
        <div className="relative w-full aspect-square rounded-4xl overflow-hidden shadow-lg group cursor-pointer border-2 border-transparent hover:border-[#F4E06D]/30 transition-all duration-300">
            {/* Background Image */}
            <img 
                src={imageSrc} 
                alt={name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = '/img/fotbar.png';
                }}
            />

            {/* Blue Tint Overlay */}
            <div className="absolute inset-0 bg-[#19243A]/60 mix-blend-multiply group-hover:bg-[#19243A]/40 transition-colors duration-500"></div>
            <div className="absolute inset-0 bg-linear-to-t from-[#19243A]/90 via-[#19243A]/40 to-[#19243A]/40"></div>

            {/* Text Content */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
                <h3 className="text-center bg-linear-to-b dark:from-white dark:to-[#F4E06D] from-[#324879] to-[#19243A] bg-clip-text text-transparent text-xl sm:text-2xl md:text-4xl font-bold font-helvetica drop-shadow-xl transition-transform duration-300 group-hover:-translate-y-1">
                    {name}
                </h3>
            </div>
        </div>
    );
};

export default function HomeProker({ data = [] }: { data: any[] }) {
    return (
        <section id="home-proker" className="w-full flex flex-col items-center justify-center layout">
            <div className="w-full pb-8">
                <h2 className="text-center title">
                    Program Kerja
                </h2>
            </div>

            <div className="w-full">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 lg:gap-12 justify-items-center">
                    {data.map((proker, index) => (
                        <HomeProkerCard
                            key={proker.id || index}
                            name={proker.parent?.judul || 'Untitled'}
                            imageSrc={`/img/proker/${proker.id}.png`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}