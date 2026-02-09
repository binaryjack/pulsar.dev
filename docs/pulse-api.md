# Pulse API - Bootstrap Guide

**Minimal, elegant Pulsar application bootstrapping**

---

## Quick Start

### Basic Usage (Recommended)

```typescript
// main.ts
import { pulse } from '@pulsar-framework/pulsar.dev';
import { App } from './App.psr';

pulse(App);
```

**That's it!** HMR is automatically handled by the Vite plugin.

---

## Usage Levels

### 1. Absolute Minimum (3 lines)

```typescript
import { pulse } from '@pulsar-framework/pulsar.dev';
import { App } from './App.psr';

pulse(App); // Uses #app by default
```

---

### 2. Custom Root (5 lines)

```typescript
import { pulse } from '@pulsar-framework/pulsar.dev';
import { App } from './App.psr';

// Pass string for custom selector
pulse(App, '#root');

// Or pass config object
pulse(App, { root: '#root' });
```

---

### 3. With Lifecycle Hooks (10 lines)

```typescript
import { pulse } from '@pulsar-framework/pulsar.dev';
import { App } from './App.psr';

const app = pulse(App, {
  root: '#app',
  onMount: (element) => {
    console.log('App mounted!', element);
  },
  onError: (error) => {
    console.error('App error:', error);
  },
});
```

---

### 4. With Dependency Injection (15 lines)

```typescript
import { pulse } from '@pulsar-framework/pulsar.dev';
import { ServiceManager } from '@pulsar-framework/pulsar.dev';
import { App } from './App.psr';

const services = new ServiceManager();
services.registerInstance('logger', myLogger);
services.registerInstance('api', myApi);

const app = pulse(App, {
  root: '#app',
  services,
  onMount: (el) => console.log('Ready!'),
});
```

---

### 5. Full Configuration (Advanced)

```typescript
import { pulse } from '@pulsar-framework/pulsar.dev';
import { ServiceManager } from '@pulsar-framework/pulsar.dev';
import { App } from './App.psr';

const services = new ServiceManager();
// ... register services

const app = pulse(App, {
  root: '#app',
  services,
  settings: {
    theme: 'dark',
    apiUrl: import.meta.env.VITE_API_URL,
  },
  onMount: (element) => {
    console.log('[App] Mounted successfully!', element);
    // Initialize analytics, etc.
  },
  onUnmount: () => {
    console.log('[App] Cleanup...');
    // Cleanup subscriptions, etc.
  },
  onError: (error) => {
    console.error('[App] Error:', error);
    // Send to error tracking service
  },
});

// Advanced: Manual control
app.unmount(); // Cleanup
app.mount(App()); // Re-mount
```

---

## Advanced: Manual HMR Control

If you need custom HMR behavior, export `app` and disable `autoInjectHMR` in vite config:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    pulsar({
      autoInjectHMR: false, // Disable auto-injection
    }),
  ],
});
```

```typescript
// main.ts
import { pulse } from '@pulsar-framework/pulsar.dev';
import { App } from './App.psr';

export const app = pulse(App);

// Custom HMR logic
if (import.meta.hot) {
  import.meta.hot.accept('./App.psr', async (newModule) => {
    // Custom reload logic
    await app.unmount();
    await app.mount(newModule.App());
  });
}
```

---

## Comparison with Builder API

### Old Builder Pattern (Verbose)

```typescript
const app = bootstrapApp()
  .root('#app')
  .onMount((el) => console.log('Mounted'))
  .onError((err) => console.error(err))
  .build();

app.mount(App());

// + 20+ lines of HMR boilerplate
```

**Total: ~30 lines**

---

### New Pulse API (Concise)

```typescript
pulse(App, {
  root: '#app',
  onMount: (el) => console.log('Mounted'),
  onError: (err) => console.error(err),
});

// HMR auto-injected
```

**Total: 5 lines** (6x reduction!)

---

## When to Use Each Approach

| Use Case             | API                                       | Lines | Best For          |
| -------------------- | ----------------------------------------- | ----- | ----------------- |
| **Simple apps**      | `pulse(App)`                              | 1     | Demos, prototypes |
| **Standard apps**    | `pulse(App, { root, onMount })`           | 5     | Most projects     |
| **Complex apps**     | `pulse(App, { services, settings, ... })` | 15    | Enterprise apps   |
| **Legacy/Migration** | `bootstrapApp().build()`                  | 30+   | Gradual migration |

---

## Project Structure

```
my-pulsar-app/
├── index.html           # <div id="app"></div>
├── src/
│   ├── main.ts         # pulse(App)  ← Entry point
│   └── App.psr         # Your component
└── vite.config.ts      # pulsar() plugin
```

---

## Configuration

### Vite Plugin Options

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import pulsar from '@pulsar-framework/vite-plugin';

export default defineConfig({
  plugins: [
    pulsar({
      debug: false, // Enable debug logging
      autoInjectHMR: true, // Auto-inject HMR (default: true)
    }),
  ],
});
```

---

## Type Definitions

```typescript
interface IPulseConfig {
  /** Root selector or element (default: '#app') */
  root?: string | HTMLElement;

  /** Mount callback */
  onMount?: (element: HTMLElement) => void;

  /** Unmount callback */
  onUnmount?: () => void;

  /** Error handler */
  onError?: (error: Error) => void;

  /** DI service manager */
  services?: IServiceManager;

  /** App settings (future) */
  settings?: unknown;
}

function pulse(
  component: () => HTMLElement | HTMLElement,
  config?: string | IPulseConfig
): IApplicationRoot;
```

---

## Migration from bootstrapApp

### Before

```typescript
import { bootstrapApp } from '@pulsar-framework/pulsar.dev';
import { App } from './App.psr';

const app = bootstrapApp().root('#app').onMount(callback).build();

app.mount(App());
```

### After

```typescript
import { pulse } from '@pulsar-framework/pulsar.dev';
import { App } from './App.psr';

const app = pulse(App, {
  root: '#app',
  onMount: callback,
});
```

**Benefits:**

- ✅ 70% less boilerplate
- ✅ Auto HMR injection
- ✅ Same functionality
- ✅ Better DX

---

## FAQ

**Q: Do I need to export `app`?**  
A: Only if you need programmatic control (manual unmount/remount). For standard apps, no.

**Q: Does HMR work automatically?**  
A: Yes! The Vite plugin auto-detects `pulse()` calls and injects HMR handling.

**Q: Can I use the old `bootstrapApp()` API?**  
A: Yes, it's still supported for backward compatibility and advanced use cases.

**Q: How do I disable auto HMR injection?**  
A: Set `autoInjectHMR: false` in the Vite plugin options.

**Q: What if #app doesn't exist?**  
A: Error thrown: "Root element not found: #app". The mount is safe by default.

---

**Updated:** 2026-02-09  
**Version:** 1.0.0
