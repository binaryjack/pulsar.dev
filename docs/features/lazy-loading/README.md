# Lazy Loading and Code Splitting

Complete guide to lazy loading components and code splitting in Pulsar.

## Table of Contents

- [Overview](#overview)
- [Basic Usage](#basic-usage)
- [Preload Strategies](#preload-strategies)
- [Suspense Boundaries](#suspense-boundaries)
- [Route-Based Code Splitting](#route-based-code-splitting)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)

## Overview

Pulsar's lazy loading system enables on-demand loading of components, reducing initial bundle size and improving application performance. The API is inspired by React.lazy() with additional preloading strategies.

### Key Features

- 🚀 **Dynamic imports** - Load components on demand
- ⏱️ **Preload strategies** - Eager, hover, visible, idle
- 🎭 **Suspense boundaries** - Show fallbacks while loading
- 🔄 **Loading states** - Built-in loading/error handling
- 📦 **Automatic code splitting** - Webpack/Vite integration
- 🎯 **Type-safe** - Full TypeScript support

## Basic Usage

### Simple Lazy Loading

```typescript
import { lazy, Suspense } from 'pulsar/lazy-loading';

// Create lazy component
const LazyChart = lazy(() => import('./components/Chart'));

function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyChart data={chartData} />
    </Suspense>
  );
}
```

### Manual Preloading

```typescript
const LazyChart = lazy(() => import('./components/Chart'));

// Preload without rendering
LazyChart.preload();

// Or preload on user interaction
button.addEventListener('click', () => {
  LazyChart.preload();
});
```

### Check Loading State

```typescript
const LazyChart = lazy(() => import('./components/Chart'));

console.log(LazyChart.state);
// { status: 'idle', component: null, error: null, promise: null }

await LazyChart.preload();

console.log(LazyChart.state);
// { status: 'success', component: ChartComponent, error: null, promise: null }
```

## Preload Strategies

### Hover Preload

Preload when user hovers over an element:

```typescript
import { lazy, preloadOnHover } from 'pulsar/lazy-loading';

const LazyChart = lazy(() => import('./Chart'));

const button = document.querySelector('#chart-button');
const cleanup = preloadOnHover(button, LazyChart);

// Cleanup when done
cleanup();
```

### Visible Preload (Intersection Observer)

Preload when element becomes visible:

```typescript
import { preloadOnVisible } from 'pulsar/lazy-loading';

const LazyChart = lazy(() => import('./Chart'));
const container = document.querySelector('#chart-container');

const cleanup = preloadOnVisible(container, LazyChart, {
  threshold: 0.1, // Trigger when 10% visible
});
```

### Eager Preload

Preload immediately (but after initial render):

```typescript
import { preloadEager } from 'pulsar/lazy-loading';

const LazyChart = lazy(() => import('./Chart'));

// Preload right away
preloadEager(LazyChart);
```

### Idle Preload

Preload when browser is idle:

```typescript
import { preloadOnIdle } from 'pulsar/lazy-loading';

const LazyChart = lazy(() => import('./Chart'));

const cleanup = preloadOnIdle(LazyChart);
```

### Apply Strategy by Name

```typescript
import { applyPreloadStrategy } from 'pulsar/lazy-loading';

const element = document.querySelector('#trigger');
const cleanup = applyPreloadStrategy(
  element,
  LazyChart,
  'hover' // 'hover' | 'visible' | 'eager' | 'idle' | 'none'
);
```

## Suspense Boundaries

### Basic Suspense

Show fallback while any lazy component loads:

```typescript
import { Suspense } from 'pulsar/lazy-loading';

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyChart />
      <LazyTable />
      <LazyGraph />
    </Suspense>
  );
}
```

### Nested Suspense

Create granular loading boundaries:

```typescript
function App() {
  return (
    <div>
      <Suspense fallback={<HeaderSkeleton />}>
        <LazyHeader />
      </Suspense>

      <Suspense fallback={<ContentSkeleton />}>
        <LazyMainContent />

        <Suspense fallback={<SidebarSkeleton />}>
          <LazySidebar />
        </Suspense>
      </Suspense>
    </div>
  );
}
```

### LazyComponent Wrapper

Alternative to Suspense with per-component fallbacks:

```typescript
import { LazyComponent } from 'pulsar/lazy-loading';

function Dashboard() {
  return (
    <LazyComponent
      loader={() => import('./Chart')}
      props={{ data: chartData }}
      fallback={<ChartSkeleton />}
      errorBoundary={({ error }) => <ChartError error={error} />}
    />
  );
}
```

## Route-Based Code Splitting

### Lazy Route Components

```typescript
import { lazy } from 'pulsar/lazy-loading';
import { createRouter } from 'pulsar/router';

const routes = [
  {
    path: '/',
    component: () => import('./pages/Home'),
  },
  {
    path: '/dashboard',
    component: lazy(() => import('./pages/Dashboard')),
  },
  {
    path: '/settings',
    component: lazy(() => import('./pages/Settings')),
  },
];

const router = createRouter({ routes });
```

### Preload on Navigation

```typescript
import { useNavigate } from 'pulsar/router';

const LazyDashboard = lazy(() => import('./pages/Dashboard'));

function NavigationMenu() {
  const navigate = useNavigate();

  function handleDashboardClick() {
    // Preload before navigating
    LazyDashboard.preload();
    navigate('/dashboard');
  }

  return (
    <button onClick={handleDashboardClick}>
      Dashboard
    </button>
  );
}
```

### Prefetch on Hover

```typescript
function NavigationLink({ to, label, component }) {
  const navigate = useNavigate();

  function handleMouseEnter() {
    component.preload();
  }

  function handleClick() {
    navigate(to);
  }

  return (
    <button
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}
```

## Best Practices

### 1. Strategic Code Splitting

Split on **route boundaries** first:

```typescript
// ✅ Good - Split by route
const HomePage = lazy(() => import('./pages/Home'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));

// ❌ Bad - Too granular
const Button = lazy(() => import('./Button'));
const Icon = lazy(() => import('./Icon'));
```

### 2. Batch Related Components

Keep related components together:

```typescript
// ✅ Good - One chunk for feature
const ChartFeature = lazy(() => import('./features/Charts'));

// ❌ Bad - Multiple chunks for single feature
const BarChart = lazy(() => import('./BarChart'));
const LineChart = lazy(() => import('./LineChart'));
const PieChart = lazy(() => import('./PieChart'));
```

### 3. Preload Critical Paths

Preload components user is likely to need:

```typescript
const LazyCheckout = lazy(() => import('./Checkout'));

// Preload when cart has items
if (cart.items.length > 0) {
  LazyCheckout.preload();
}
```

### 4. Error Boundaries

Always provide error handling:

```typescript
<Suspense fallback={<Loading />}>
  <ErrorBoundary fallback={<Error />}>
    <LazyComponent />
  </ErrorBoundary>
</Suspense>
```

### 5. Loading States

Show meaningful loading UI:

```typescript
// ❌ Bad - Generic spinner
<Suspense fallback={<Spinner />}>
  <LazyChart />
</Suspense>

// ✅ Good - Content skeleton
<Suspense fallback={<ChartSkeleton />}>
  <LazyChart />
</Suspense>
```

### 6. Avoid Lazy Loading Above Fold

Don't lazy load critical content:

```typescript
// ❌ Bad - Header loads after page
const Header = lazy(() => import('./Header'));

// ✅ Good - Header loads immediately
import Header from './Header';
```

### 7. Bundle Analysis

Monitor bundle sizes:

```bash
# Analyze bundle composition
pnpm build --analyze

# Check lazy chunk sizes
ls -lh dist/**/*.js
```

## API Reference

### `lazy(loader)`

Create a lazy-loaded component.

**Parameters:**

- `loader: () => Promise<T>` - Function that returns dynamic import

**Returns:**

- `ILazyComponent<T>` - Lazy component wrapper

**Example:**

```typescript
const LazyChart = lazy(() => import('./Chart'));
```

### `Suspense`

Boundary component that shows fallback while children load.

**Props:**

- `fallback?: HTMLElement` - Content to show while loading
- `children?: any` - Child components (can include lazy)

**Example:**

```typescript
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

### `LazyComponent`

Component wrapper with built-in loading state.

**Props:**

- `loader: () => Promise<T>` - Component loader function
- `props?: Record<string, any>` - Props for loaded component
- `fallback?: HTMLElement` - Loading component
- `errorBoundary?: (props) => HTMLElement` - Error component

**Example:**

```typescript
<LazyComponent
  loader={() => import('./Chart')}
  props={{ data }}
  fallback={<Spinner />}
/>
```

### `preloadOnHover(element, component)`

Preload when user hovers element.

**Returns:** `() => void` - Cleanup function

### `preloadOnVisible(element, component, options?)`

Preload when element is visible (Intersection Observer).

**Parameters:**

- `options?: IntersectionObserverInit` - Observer options

**Returns:** `() => void` - Cleanup function

### `preloadEager(component)`

Preload immediately.

### `preloadOnIdle(component)`

Preload when browser is idle (requestIdleCallback).

**Returns:** `() => void` - Cleanup function

### `batchPreload(components)`

Preload multiple components in parallel.

**Returns:** `Promise<any[]>` - Resolves when all loaded

### `preloadWithTimeout(component, timeoutMs)`

Preload with timeout.

**Returns:** `Promise<any>` - Rejects on timeout

## Performance Tips

### Measure Impact

```typescript
const LazyChart = lazy(() => import('./Chart'));

console.time('chart-load');
await LazyChart.preload();
console.timeEnd('chart-load');
// chart-load: 245ms
```

### Webpack Magic Comments

Control chunk names and loading:

```typescript
const LazyChart = lazy(
  () =>
    import(
      /* webpackChunkName: "chart" */
      /* webpackPreload: true */
      './Chart'
    )
);
```

### Vite Optimization

Configure code splitting in vite.config.ts:

```typescript
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ['./src/components/charts/index.ts'],
        },
      },
    },
  },
};
```

## Troubleshooting

### Component Not Loading

Check:

1. Import path is correct
2. Component has default export
3. No circular dependencies
4. Network/CORS issues

### Flash of Loading State

Use preload strategies:

```typescript
// Preload on hover to reduce flash
preloadOnHover(button, LazyComponent);
```

### Bundle Size Not Reduced

Verify:

1. Dynamic import syntax used
2. Component not imported elsewhere
3. Build tool supports code splitting
4. No barrel imports pulling everything

### TypeScript Errors

Ensure proper types:

```typescript
// ✅ Explicit type
const LazyChart = lazy<typeof ChartComponent>(() => import('./Chart'));

// ✅ Inferred type
const LazyChart = lazy(() => import('./Chart'));
```

## Migration from React

Pulsar's lazy loading is similar to React:

```typescript
// React
import { lazy, Suspense } from 'react';
const Chart = lazy(() => import('./Chart'));

// Pulsar
import { lazy, Suspense } from 'pulsar/lazy-loading';
const Chart = lazy(() => import('./Chart'));
```

Key differences:

- Pulsar adds preload strategies
- Direct state access via `.state`
- No need for React.lazy wrapper
- Works with any bundler

---

For more information, see the [main documentation](../README.md).
