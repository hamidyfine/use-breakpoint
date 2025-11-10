import { useCallback, useMemo } from 'react';

import { config } from './config';
import { useBreakpointContext } from './hook';
import type { BreakpointKey, UseBreakpointHelpers } from './types';
import { useWindowWidthSSR } from './use-window-width';

export const useBreakpoint = (): { current: BreakpointKey } & Omit<UseBreakpointHelpers, 'ready'> => {
    const {
        breakpoints = config.breakpoints,
        defaultBreakpoint = config.defaultBreakpoint,
        guardSSR = config.guardSSR,
    } = useBreakpointContext();

    const { ready, width } = useWindowWidthSSR();
    const guard = guardSSR && !ready;

    const sortedEntries = useMemo(() => {
        return Object.entries(breakpoints).sort(([, aWidth], [, bWidth]) => aWidth - bWidth);
    }, [breakpoints]);

    // Helper to get the previous breakpoint's maxWidth (or 0 if it's the first)
    const getPreviousMaxWidth = useCallback(
        (key: string) => {
            const currentIndex = sortedEntries.findIndex(([k]) => k === key);
            if (currentIndex <= 0) return 0;
            return sortedEntries[currentIndex - 1][1];
        },
        [sortedEntries],
    );

    const initialBreakpoint = useMemo(() => {
        if (typeof window === 'undefined') {
            return defaultBreakpoint ?? sortedEntries[0]?.[0] ?? '';
        }

        // Find the breakpoint where width <= maxWidth and > previous maxWidth
        for (let i = sortedEntries.length - 1; i >= 0; i--) {
            const [key, maxWidth] = sortedEntries[i];
            const prevMaxWidth = i > 0 ? sortedEntries[i - 1][1] : 0;
            if (width > prevMaxWidth && width <= maxWidth) {
                return key;
            }
        }
        // If width is larger than all breakpoints, return the largest
        return sortedEntries[sortedEntries.length - 1]?.[0] ?? defaultBreakpoint;
    }, [defaultBreakpoint, sortedEntries, width]);

    const get = useCallback(
        (key: string) => {
            const v = breakpoints[key];
            if (typeof v !== 'number')
                throw new Error(`Breakpoint "${key}" not found.`);
            return v;
        },
        [breakpoints],
    );

    const greaterThan = useCallback(
        (key: string) => (guard ? false : width > get(key)),
        [guard, width, get],
    );
    const greaterEqualThan = useCallback(
        (key: string) => (guard ? false : width >= get(key)),
        [guard, width, get],
    );
    const smallerThan = useCallback(
        (key: string) => {
            if (guard) return false;
            const prevMaxWidth = getPreviousMaxWidth(key);
            return width <= prevMaxWidth;
        },
        [guard, width, getPreviousMaxWidth],
    );
    const smallerEqualThan = useCallback(
        (key: string) => (guard ? false : width <= get(key)),
        [guard, width, get],
    );

    const equal = useCallback(
        (key: string) => {
            if (guard) return false;
            const max = get(key);
            const min = getPreviousMaxWidth(key);
            return width > min && width <= max;
        },
        [guard, width, get, getPreviousMaxWidth],
    );

    const notEqual = useCallback((key: string) => !equal(key), [equal]);

    const between = useCallback(
        (a: string, b: string) => {
            if (guard) return false;
            const aMax = get(a);
            const bMax = get(b);
            const aMin = getPreviousMaxWidth(a);
            const bMin = getPreviousMaxWidth(b);
            const loMin = Math.min(aMin, bMin);
            const hiMax = Math.max(aMax, bMax);
            return width > loMin && width <= hiMax;
        },
        [guard, width, get, getPreviousMaxWidth],
    );

    return {
        between,
        current: initialBreakpoint,
        equal,
        greaterEqualThan,
        greaterThan,
        notEqual,
        smallerEqualThan,
        smallerThan,
    };
};
