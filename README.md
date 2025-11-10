# use-breakpoint

Responsive breakpoint hook for React and Next.js applications.

## Features

- 📐 Define custom breakpoint maps for any design system
- ⚡️ SSR-safe defaults for Next.js
- 🪶 Treeshakeable, zero dependencies, TypeScript-ready
- 🚀 Optimized with `requestAnimationFrame` for smooth resize handling

## Installation

```bash
npm install use-breakpoint
# or
yarn add use-breakpoint
# or
pnpm add use-breakpoint
```

## Quick Start

### 1. Wrap your app with `BreakpointProvider`

```tsx
import { BreakpointProvider } from "use-breakpoint";

const breakpoints = {
  xs: 560,
  sm: 768,
  md: 960,
  lg: 1024,
  xl: 1280,
  xxl: 1600,
};

function App() {
  return (
    <BreakpointProvider breakpoints={breakpoints} defaultBreakpoint="md" guardSSR={true}>
      <YourApp />
    </BreakpointProvider>
  );
}
```

### 2. Use the hook in your components

```tsx
import { useBreakpoint } from "use-breakpoint";

function Example() {
  const { current, greaterThan, smallerThan, equal, between } = useBreakpoint();

  if (smallerThan("sm")) {
    return <MobileUI />;
  }

  if (greaterThan("lg")) {
    return <DesktopUI />;
  }

  if (equal("md")) {
    return <TabletUI breakpoint={current} />;
  }

  if (between("sm", "lg")) {
    return <MediumScreenUI />;
  }

  return <DefaultUI breakpoint={current} />;
}
```

## API

### `BreakpointProvider`

Provider component that configures breakpoints for your application.

**Props:**

- `breakpoints` (optional): `Record<string, number>` — map of breakpoint name to max width. Defaults to:

  ```ts
  {
    xs: 560,
    sm: 768,
    md: 960,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  }
  ```

- `defaultBreakpoint` (optional): `string` — fallback breakpoint name, useful during SSR. Defaults to `"md"`.
- `guardSSR` (optional): `boolean` — when `true`, helper methods return `false` during SSR until the client is ready. Defaults to `true`.

### `useBreakpoint()`

Hook that returns the current breakpoint and helper methods. Must be used within a `BreakpointProvider`.

**Returns:**

- `current`: `string` — the active breakpoint name.
- `greaterThan(key: string)`: `boolean` — returns `true` if width > breakpoint max width.
- `greaterEqualThan(key: string)`: `boolean` — returns `true` if width >= breakpoint max width.
- `smallerThan(key: string)`: `boolean` — returns `true` if width <= previous breakpoint max width.
- `smallerEqualThan(key: string)`: `boolean` — returns `true` if width <= breakpoint max width.
- `equal(key: string)`: `boolean` — returns `true` if width is within the breakpoint range (prevMaxWidth < width <= maxWidth).
- `notEqual(key: string)`: `boolean` — returns `true` if width is not within the breakpoint range.
- `between(min: string, max: string)`: `boolean` — returns `true` if width is within the range between two breakpoints.

**Note:** When `guardSSR` is `true`, all helper methods return `false` during SSR until the client is ready to prevent hydration mismatches.

### `useWindowWidthSSR()`

Hook that returns the window width with SSR support.

**Returns:**

- `ready`: `boolean` — `true` when the client is ready (after first render).
- `width`: `number` — the current window width.

### `useBreakpointContext()`

Hook to access the breakpoint context directly. Useful for advanced use cases.

### `defaultConfig`

Default configuration object that can be imported and extended.

## How Breakpoints Work

Breakpoints in this library use **max width** values. This means:

- A breakpoint represents the maximum width for that breakpoint range
- The range for a breakpoint is: `(previousBreakpointMaxWidth, currentBreakpointMaxWidth]`
- For example, with breakpoints `{ xs: 560, sm: 768, md: 960 }`:
  - `xs`: width <= 560
  - `sm`: 560 < width <= 768
  - `md`: 768 < width <= 960

The `current` breakpoint is determined by finding the largest breakpoint where the window width falls within its range.

## Examples

### Using with Next.js

```tsx
// app/layout.tsx or pages/_app.tsx
import { BreakpointProvider } from "use-breakpoint";

export default function RootLayout({ children }) {
  return (
    <BreakpointProvider breakpoints={{ sm: 640, md: 768, lg: 1024 }}>
      {children}
    </BreakpointProvider>
  );
}
```

### Conditional Rendering

```tsx
function ResponsiveComponent() {
  const { current, greaterThan, equal } = useBreakpoint();

  return (
    <div>
      {greaterThan("lg") && <DesktopNavigation />}
      {equal("md") && <TabletNavigation />}
      {current === "sm" && <MobileNavigation />}
    </div>
  );
}
```

### Using with CSS-in-JS

```tsx
function StyledComponent() {
  const { greaterThan } = useBreakpoint();

  return (
    <div
      style={{
        padding: greaterThan("md") ? "2rem" : "1rem",
        fontSize: greaterThan("lg") ? "18px" : "16px",
      }}
    >
      Responsive content
    </div>
  );
}
```

## License

MIT © Hamid
