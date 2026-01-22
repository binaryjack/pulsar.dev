# Lazy Loading System

**Note:** This documentation uses `Waiting` (from `pulsar/resource`) instead of React's `Suspense`. Pulsar already has a robust `Waiting` component for handling loading states since v0.1.0.

## Quick Start

```typescript
import { lazy, Waiting } from 'pulsar/lazy-loading';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Waiting default={<div>Loading...</div>}>
      <HeavyComponent />
    </Waiting>
  );
}
```

## Exports

- `lazy()` - Create lazy-loaded components
- `LazyComponent` - Component wrapper with built-in fallback
- `Waiting` - Re-export from `pulsar/resource` (use this for loading boundaries)
- `resolveWaiting()`, `suspendWaiting()` - Control waiting states
- Preload strategies: `preloadOnHover`, `preloadOnVisible`, `preloadEager`, `preloadOnIdle`

For full documentation, see the complete README.md in the lazy-loading directory.

## Why Waiting Instead of Suspense?

Pulsar uses `Waiting` as the standard pattern for all loading states:

- Consistent with resource loading (since v0.1.0)
- Proven and battle-tested
- Same functionality as React's Suspense
- Integrates with existing Pulsar patterns

The API is simple:

```typescript
Waiting({
  default: <LoadingSpinner />,  // fallback while loading
  children: <YourContent />     // content to show when ready
})
```
