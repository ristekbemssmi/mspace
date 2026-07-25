import React, { ReactNode, useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    const [isRendered, setIsRendered] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setIsRendered(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 ease-out ${isVisible ? 'bg-opacity-50 opacity-100' : 'bg-opacity-0 opacity-0'
                }`}
            onClick={onClose}
        >
            <div
                className={`relative bg-linear-to-b from-[#ffffff] to-[#F4E06D] rounded-lg shadow-xl p-6 max-w-6xl w-full mx-4 transform transition-all duration-300 ease-out ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup detail modal"
                    className="absolute -top-3 -right-3 flex items-center justify-center w-8 h-8 bg-white text-gray-500 hover:text-red-500 rounded-full shadow-md border border-gray-200 transition-colors z-10"
                >
                    <X size={16} strokeWidth={3} />
                </button>

                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
