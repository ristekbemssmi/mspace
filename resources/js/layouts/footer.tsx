import React from 'react';
import { Phone, Mail, MessageCircle, Send } from 'lucide-react';

export default function FooterLayout() {
    return (
        <footer className="relative w-full text-white pt-16 pb-8">
            {/* Background Image Overlay */}
            {/* <div
                className="absolute inset-0 -z-10 opacity-10 bg-cover bg-center"
                style={{ backgroundImage: "url('/img/koin.png')" }}
            ></div> */}
            <div className="absolute inset-0 -z-20 bg-[#19243A]"></div>

            <div className="container mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-12 items-start px-6 md:px-12">

                    {/* Column: Brand & Socials (Top on Mobile) */}
                    <div className="col-span-2 md:col-span-1 order-1 md:order-2 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-4 md:gap-6">
                            <img src="/img/logo.svg" alt="Logo BEM SSMI" className="w-12 md:w-20 h-auto" />
                            <div className="text-left">
                                <h2 className="bg-linear-to-b from-[#F5F5F5] to-[#B0B0B0] bg-clip-text text-transparent text-xl sm:text-2xl md:text-4xl font-bold font-helvetica">
                                    BEM SSMI IPB
                                </h2>
                                <p className="text-sm sm:text-base md:text-xl bg-linear-to-b from-[#F5F5F5] to-[#B0B0B0] bg-clip-text text-transparent font-roboto leading-tight">
                                    Langkah Berdikari
                                </p>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-4 mt-2 md:mt-4">
                            <a href="mailto:bemssmi@apps.ipb.ac.id" className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all hover:scale-110">
                                <Mail size={18} />
                            </a>
                            <a href="#" className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all hover:scale-110">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </a>
                            <a href="https://wa.me/628123650305" className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all hover:scale-110">
                                <MessageCircle size={18} />
                            </a>
                            <a href="https://instagram.com/bemssmiipb" className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all hover:scale-110">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                        </div>
                    </div>

                    {/* Column: Tautan Cepat */}
                    <div className="col-span-1 md:col-span-1 order-2 md:order-1 flex flex-col gap-4 text-left">
                        <h3 className="text-lg md:text-2xl font-bold font-helvetica">Tautan Cepat</h3>
                        <ul className="flex flex-col gap-2 text-white/70 font-helvetica text-xs md:text-xl">
                            <li><a href="/informasi-beasiswa" className="hover:text-[#F4E06D] transition-colors">Informasi Beasiswa</a></li>
                            <li><a href="/informasi-magang" className="hover:text-[#F4E06D] transition-colors">Informasi Magang</a></li>
                            <li><a href="/proker" className="hover:text-[#F4E06D] transition-colors">Program Kerja</a></li>
                        </ul>
                    </div>

                    {/* Column: Info Kontak */}
                    <div className="col-span-1 md:col-span-1 order-3 md:order-3 flex flex-col gap-4 text-right md:text-right md:items-end">
                        <h3 className="text-lg md:text-2xl font-bold font-helvetica">Info Kontak</h3>
                        <div className="flex flex-col gap-3 text-white/70 font-helvetica text-[10px] sm:text-xs md:text-xl md:items-end">
                            <div className="flex items-center justify-end gap-2 md:gap-3">
                                <span className="order-1 md:order-1">08123650305 (Kemal)</span>
                                <Phone size={14} className="text-[#F4E06D] order-2 md:order-2" />
                            </div>
                            <div className="flex items-center justify-end gap-2 md:gap-3">
                                <span className="order-1 md:order-1">bemssmi@apps.ipb.ac.id</span>
                                <Mail size={14} className="text-[#F4E06D] order-2 md:order-2" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-white/10 text-center text-white text-xs md:text-sm">
                    <p>Copyright © 2026 BEM SSMI IPB - All rights reserved</p>
                </div>
            </div>
        </footer>
    );
}
