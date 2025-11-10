import { useContext } from 'react';

import { BreakpointContext } from './provider';

export const useBreakpointContext = () => {
    const context = useContext(BreakpointContext);
    if (!context) {
        throw new Error('useBreakpoint must be used within a BreakpointProvider');
    }
    return context;
};
