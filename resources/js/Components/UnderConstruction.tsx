import React from 'react';
import { Head } from '@inertiajs/react';
import { Construction, ArrowLeft } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';

interface UnderConstructionProps {
    pageTitle: string;
    description: string;
}

export default function UnderConstruction({ pageTitle, description }: UnderConstructionProps) {
    return (
        <>
            <Head title={pageTitle} />
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}} />
            
            <main className="page min-h-[75vh] flex items-center justify-center py-12">
                <div className="layout flex flex-col items-center justify-center">
                    <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-[32px] p-8 md:p-12 text-center shadow-2xl flex flex-col items-center gap-6 relative overflow-hidden">
                        {/* Decorative Background Glows */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#F4E06D]/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#1f58d4]/20 rounded-full blur-3xl pointer-events-none"></div>
                        
                        {/* Icon with Floating Animation */}
                        <div className="animate-float p-5 bg-[#F4E06D]/15 border border-[#F4E06D]/30 rounded-2xl text-[#F4E06D] shadow-inner">
                            <Construction size={48} strokeWidth={1.5} />
                        </div>
                        
                        {/* Title & Desc */}
                        <div className="space-y-4">
                            <h2 className="title mb-0 drop-shadow-md">
                                {pageTitle}
                            </h2>
                            <p className="text-white/80 font-roboto text-base sm:text-lg md:text-xl leading-relaxed max-w-md mx-auto">
                                {description}
                            </p>
                        </div>
                        
                        {/* Action Link */}
                        <a 
                            href="/" 
                            className="flex items-center gap-2 bg-[#F4E06D] hover:bg-[#e5d25c] hover:scale-105 active:scale-95 text-[#19243A] font-bold px-6 py-3 rounded-full shadow-lg transition duration-300 text-sm md:text-base mt-4"
                        >
                            <ArrowLeft size={16} />
                            <span>Kembali ke Beranda</span>
                        </a>
                    </div>
                </div>
            </main>
        </>
    );
}

UnderConstruction.layout = (page: React.ReactNode) => <AppLayout children={page} />;
