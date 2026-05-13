import React, { useState } from 'react';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Printer } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

// 1. Definisikan Interface untuk Props
interface PDFReaderProps {
    fileUrl: string;
}



function PDFReader({ fileUrl }: PDFReaderProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);

        // Mencegah PDF.js (react-pdf) menimpa title browser dengan judul metadata PDF
        setTimeout(() => {
            document.title = "Akademik - M-SPACE";
        }, 300);
    }

    const handleDownload = () => {
        window.open(fileUrl, '_blank');
    };

    return (
        <div className="flex flex-col items-center bg-[#E2E2E2] rounded-xl overflow-hidden shadow-2xl border border-gray-300">
            {/* TOOLBAR ATAS */}
            <div className="w-full bg-linear-to-b from-white to-[#F4E06D] border-b border-gray-300 p-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <button
                        disabled={pageNumber <= 1}
                        onClick={() => setPageNumber(prev => prev - 1)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-medium px-2">
                        {pageNumber} / {numPages || '--'}
                    </span>
                    <button
                        disabled={pageNumber >= (numPages ?? 0)}
                        onClick={() => setPageNumber(prev => prev + 1)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-1.5 hover:bg-white rounded-md shadow-sm transition-all"><ZoomOut size={18} /></button>
                    <span className="text-xs font-bold w-12 text-center">{Math.round(scale * 100)}%</span>
                    <button onClick={() => setScale(s => Math.min(s + 0.2, 2.0))} className="p-1.5 hover:bg-white rounded-md shadow-sm transition-all"><ZoomIn size={18} /></button>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={handleDownload} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Download">
                        <Download size={20} />
                    </button>
                    <button onClick={() => window.print()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Print">
                        <Printer size={20} />
                    </button>
                </div>
            </div>

            {/* AREA RENDER PDF */}
            <div className="w-full p-6 flex justify-center overflow-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-400">
                <Document
                    file={fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<div className="animate-pulse text-gray-500 py-20 font-medium">Menyiapkan Dokumen...</div>}
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="shadow-2xl border border-gray-400 transition-transform duration-200"
                    />
                </Document>
            </div>
        </div>
    );
}

export default function AkademikKalender() {
    const kalenderUrl = "/documents/kalender-akademik.pdf";

    return (
        <>
            <section id="akademik-kalender" className="layout">
                <div className="text-center title">
                    Kalender Akademik
                </div>
                <div className="max-w-4xl mx-auto shadow-2xl">
                    <PDFReader fileUrl={kalenderUrl} />
                </div>
            </section>

        </>
    );
}