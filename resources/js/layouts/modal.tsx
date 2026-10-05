import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    const [isRendered, setIsRendered] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(isOpen);
    useEffect(() => {
        if (isOpen) {
            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            const renderTimer = window.setTimeout(() => setIsRendered(true), 0);
            const visibleTimer = window.setTimeout(() => setIsVisible(true), 10);

            return () => {
                window.clearTimeout(renderTimer);
                window.clearTimeout(visibleTimer);
                document.body.style.overflow = previousOverflow;
            };
        }

        const hideTimer = window.setTimeout(() => setIsVisible(false), 0);
        const unmountTimer = window.setTimeout(() => setIsRendered(false), 300);

        return () => {
            window.clearTimeout(hideTimer);
            window.clearTimeout(unmountTimer);
        };
    }, [isOpen]);

    if (!isRendered || typeof document === 'undefined') {
        return null;
    }

    // createPortal akan merender modal di document.body (di luar container berpencahayaan 3D)
    return createPortal(
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={onClose}
        >
            <div
                className={`relative bg-linear-to-b from-[#ffffff] to-[#F4E06D] rounded-2xl shadow-2xl p-6 md:p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out ${
                    isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup detail modal"
                    className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 bg-white text-gray-600 hover:text-red-500 rounded-full shadow-md border border-gray-200 transition-colors z-20 cursor-pointer"
                >
                    <X size={18} strokeWidth={2.5} />
                </button>

                <div>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
