import { createContext, type PropsWithChildren } from 'react';

import { config } from './config';
import type { BreakpointOptions } from './types';

// eslint-disable-next-line react-refresh/only-export-components
export const BreakpointContext = createContext<BreakpointOptions>(config);

export const BreakpointProvider = ({
    breakpoints,
    children,
    defaultBreakpoint,
    guardSSR,
}: PropsWithChildren<BreakpointOptions>) => {
    return (
        <BreakpointContext.Provider
            value={{
                breakpoints: breakpoints || config.breakpoints,
                defaultBreakpoint: defaultBreakpoint || config.defaultBreakpoint,
                guardSSR: guardSSR ?? config.guardSSR,
            }}
        >
            {children}
        </BreakpointContext.Provider>
    );
};
