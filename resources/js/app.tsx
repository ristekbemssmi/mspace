import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'M-SPACE';

// Helper to support both old div-based and new script-based Inertia data-page structures
const getPageData = (id: string) => {
    if (typeof window === 'undefined') return null;

    // Try script-based format (Inertia v2+)
    const scriptEl = document.querySelector(`script[data-page="${id}"][type="application/json"]`);
    if (scriptEl?.textContent) {
        return JSON.parse(scriptEl.textContent);
    }

    // Fall back to old div-based format (Inertia v1)
    const divEl = document.getElementById(id);
    if (divEl && divEl.dataset.page) {
        return JSON.parse(divEl.dataset.page);
    }

    return null;
};

const pageData = getPageData('app');

createInertiaApp({
    page: pageData,
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx');
        const importPage = pages[`./Pages/${name}.tsx`];
        if (!importPage) {
            throw new Error(`Page not found: ./Pages/${name}.tsx`);
        }
        return importPage().then((module: any) => module.default);
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});