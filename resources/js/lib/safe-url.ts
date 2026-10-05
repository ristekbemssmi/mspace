export function safeExternalUrl(value: string | null | undefined): string | null {
    if (!value) {
return null;
}

    try {
        const url = new URL(value);

        return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
    } catch {
        return null;
    }
}

export function safePosterUrl(value: string | null | undefined): string | null {
    if (!value) {
return null;
}

    if (/^\/?img\/[a-zA-Z0-9_./-]+$/.test(value) && !value.includes('..')) {
        return `/${value.replace(/^\//, '')}`;
    }

    return safeExternalUrl(value);
}
