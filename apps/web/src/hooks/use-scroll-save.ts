import { useEffect, useRef } from 'react';

export function useScrollSave(key: string, isReady: boolean = true) {
    const ref = useRef<HTMLElement>(null);

    // Restore scroll position
    useEffect(() => {
        const element = ref.current;
        if (!element || !isReady) return;

        const savedPosition = sessionStorage.getItem(key);
        if (savedPosition) {
            // Use requestAnimationFrame to ensure layout is ready
            requestAnimationFrame(() => {
                element.scrollTop = parseInt(savedPosition, 10);
            });
        }
    }, [key, isReady]);

    // Save scroll position
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleScroll = () => {
            if (element) {
                sessionStorage.setItem(key, element.scrollTop.toString());
            }
        };

        element.addEventListener('scroll', handleScroll);
        return () => element.removeEventListener('scroll', handleScroll);
    }, [key]);

    return ref;
}
