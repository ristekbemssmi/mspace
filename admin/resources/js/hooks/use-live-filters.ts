import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export function useLiveFilters(
    url: string,
    filters: Record<string, string>,
    valid = true,
) {
    const query = JSON.stringify(filters);
    const [applied, setApplied] = useState(query);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        if (query === applied || !valid) {
            return;
        }

        let cancel: (() => void) | undefined;
        const timer = setTimeout(() => {
            setLoading(true);
            setError('');
            router.get(url, JSON.parse(query), {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onCancelToken: (token) => {
                    cancel = () => token.cancel();
                },
                onSuccess: () => {
                    setApplied(query);
                },
                onError: (errors) => setError(Object.values(errors).join(' ')),
                onFinish: () => setLoading(false),
            });
        }, 350);

        return () => {
            clearTimeout(timer);
            cancel?.();
        };
    }, [query, applied, url, valid]);

    return { loading, pending: loading || query !== applied, error };
}
