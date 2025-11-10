import { useEffect, useRef, useState } from 'react';

interface UseWindowWidthSSRResult {
    ready: boolean;
    width: number;
}

export const useWindowWidthSSR = (): UseWindowWidthSSRResult => {
    const isClient = typeof window !== 'undefined';

    const [state, setState] = useState(() => ({
        ready: false,
        width: isClient ? window.innerWidth : 0,
    }));

    const frame = useRef<number | null>(null);

    useEffect(() => {
        if (!isClient) return;

        const update = () =>
            setState({ ready: true, width: window.innerWidth });

        const onResize = () => {
            if (frame.current != null) cancelAnimationFrame(frame.current);
            frame.current = requestAnimationFrame(update);
        };

        update();

        window.addEventListener('resize', onResize, { passive: true });
        return () => {
            if (frame.current != null) cancelAnimationFrame(frame.current);
            window.removeEventListener('resize', onResize);
        };
    }, [isClient]);

    return state;
};
