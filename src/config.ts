import type { BreakpointOptions } from './types';

export const config: Required<BreakpointOptions> = {
    breakpoints: {
        lg: 1024,
        md: 960,
        sm: 768,
        xl: 1280,
        xs: 560,
        xxl: 1600,
    },
    defaultBreakpoint: 'md',
    guardSSR: true,
};
