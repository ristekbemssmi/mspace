export default function FaqSearch() {
    return (
        <>
            <section id="faq-search" className="px-10 md:px-20 pt-24 md:pt-40">
                <form action="get" className="py-4 px-10 w-full flex justify-center items-center gap-10 rounded-4xl bg-[#FCF8DC] border-2 border-gray-300 focus:ring-2 focus:ring-blue-500">
                    <button type="submit" className="hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="28" viewBox="0 0 32 28" fill="none">
                            <path d="M19.4769 17.9124C22.9802 13.5901 22.2367 7.18164 17.8162 3.59872C13.3956 0.0157892 6.97209 0.615166 3.46878 4.93746C-0.0345212 9.25976 0.709036 15.6682 5.12957 19.2511C9.5501 22.8341 15.9736 22.2347 19.4769 17.9124ZM19.4769 17.9124L29.8822 26.3461" stroke="#1E2E50" stroke-width="2.51852" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <input type="text" placeholder='Cari pertanyaan...' 
                    className='w-full h-full border-none focus:outline-none text-lg md:text-2xl'/>
                </form>
            </section>
        </>
    );
}
