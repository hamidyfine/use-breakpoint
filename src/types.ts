export type BreakpointKey = string;

export interface BreakpointOptions {
    breakpoints?: Breakpoints;
    defaultBreakpoint?: BreakpointKey;
    guardSSR?: boolean;
}

export type Breakpoints = Record<BreakpointKey, number>;

export interface UseBreakpointHelpers {
    between: (min: BreakpointKey, max: BreakpointKey) => boolean; // in (min(min,max), max(min,max)]
    equal: (bp: BreakpointKey) => boolean; // in (prev, current]
    greaterEqualThan: (bp: BreakpointKey) => boolean;
    greaterThan: (bp: BreakpointKey) => boolean;
    notEqual: (bp: BreakpointKey) => boolean;
    ready: boolean;
    smallerEqualThan: (bp: BreakpointKey) => boolean;
    smallerThan: (bp: BreakpointKey) => boolean;
}
