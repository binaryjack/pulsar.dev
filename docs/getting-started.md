# Getting Started with Pulsar

This guide explains the **minimal setup** required to launch a Pulsar application properly.

## Required Dependencies

```json
{
  "dependencies": {
    "@pulsar-framework/pulsar.dev": "^0.9.0"
  },
  "devDependencies": {
    "@pulsar-framework/vite-plugin": "^0.8.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.8"
  }
}
```

### Why These Dependencies?

- **pulsar.dev** - Core framework with reactivity, hooks, context, and components
- **vite-plugin** - Transforms JSX and enables deferred children for Context.Provider
- **vite** - Build tool and dev server
- **typescript** - Type safety and JSX transformation

## Minimal File Structure

```
my-app/
├── index.html           # HTML entry point
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite + Pulsar plugin
└── src/
    ├── main.tsx         # Application bootstrap
    └── App.tsx          # Root component
```

## 1. HTML Entry Point (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Pulsar App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Critical:** The mount point (`#app`) must exist in the DOM before the script runs.

## 2. Vite Configuration (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import { pulsarPlugin } from '@pulsar-framework/vite-plugin';

export default defineConfig({
  plugins: [pulsarPlugin()],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: `import { h, Fragment } from '@pulsar-framework/pulsar.dev'`,
  },
  optimizeDeps: {
    include: ['@pulsar-framework/pulsar.dev'],
  },
});
```

### Required Configuration:

1. **`pulsarPlugin()`** - Transforms Context.Provider to defer children evaluation
2. **`jsxFactory: 'h'`** - Uses Pulsar's JSX pragma
3. **`jsxInject`** - Auto-imports JSX functions in every file
4. **`optimizeDeps`** - Pre-bundles Pulsar for faster dev server

**Without `pulsarPlugin()`**, Context.Provider will fail with "must be used within Provider" errors.

## 3. TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Critical:** `"jsx": "preserve"` - Vite handles JSX transformation.

## 4. Application Bootstrap (`src/main.tsx`)

```typescript
import { AppContextProvider, bootstrapApp } from '@pulsar-framework/pulsar.dev';
import { App } from './App';

// 1. Create application root with lifecycle hooks
const appRoot = bootstrapApp()
  .root('#app')
  .onMount((element) => {
    console.log('App mounted successfully', element);
  })
  .onError((error) => {
    console.error('App error:', error);
  })
  .build();

// 2. Wrap application with context provider
const app = (
  <AppContextProvider
    root={appRoot}
    context={{
      appName: 'My Pulsar App',
      version: '1.0.0',
    }}
  >
    <App />
  </AppContextProvider>
);

// 3. Append to DOM (AppContextProvider handles root.mount() internally)
document.getElementById('app')?.appendChild(app);
```

### Bootstrap Pattern Explained

**Why both `bootstrapApp()` AND `AppContextProvider`?**

They serve different purposes:

| Component            | Purpose                  | Responsibility                                    |
| -------------------- | ------------------------ | ------------------------------------------------- |
| `bootstrapApp()`     | Creates application root | Lifecycle hooks (onMount, onError), configuration |
| `AppContextProvider` | Wraps app with context   | Provides AppContext, calls `root.mount()`         |

**Execution Flow:**

```
bootstrapApp()          ← Configure lifecycle hooks
    ↓
appRoot.build()         ← Build root configuration
    ↓
AppContextProvider      ← Wrap app + provide context
    ↓
root.mount()            ← Mount to DOM (called internally)
    ↓
Component Tree          ← Access context via useAppContext()
```

### What is AppContext?

```typescript
interface IAppContext {
  appName: string;
  version: string;
  [key: string]: any; // Your custom context properties
}
```

Access anywhere in your component tree:

```typescript
import { useAppContext } from '@pulsar-framework/pulsar.dev';

export const MyComponent = () => {
  const context = useAppContext();
  return <div>App: {context.appName}</div>;
};
```

## 5. Root Component (`src/App.tsx`)

```typescript
import { createSignal, useAppContext } from '@pulsar-framework/pulsar.dev';

export const App = function App() {
  const context = useAppContext();
  const [count, setCount] = createSignal(0);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to {context.appName}</h1>
      <button onClick={() => setCount(count() + 1)}>
        Count: {count()}
      </button>
    </div>
  );
};
```

**Key Points:**

- Use `createSignal()` for reactive state
- Access signal value with `count()` (getter)
- Update with `setCount(newValue)` (setter)
- Use `useAppContext()` to access application context

## Running the Application

```bash
# Install dependencies
npm install
# or
pnpm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## What Makes This Setup Complete?

### ✅ Framework Components Available

Once configured, you have access to all framework components:

```typescript
import {
  // Reactivity
  createSignal,
  createEffect,
  createMemo,
  batch,

  // Hooks
  useState,
  useEffect,
  useMemo,
  useRef,

  // Context
  createContext,
  useContext,
  useAppContext,
  AppContextProvider,

  // Lifecycle
  bootstrapApp,
  onMount,
  onCleanup,

  // Portal
  Portal,
  PortalSlot,

  // Error Boundaries
  Tryer,
  Catcher,

  // State Management
  createStore,
  dispatch,
  select,

  // Resources (async)
  createResource,
} from '@pulsar-framework/pulsar.dev';
```

### ✅ Context System Works

With `pulsarPlugin()`, Context.Provider children are wrapped in arrow functions at compile time:

```typescript
// Your code:
<Context.Provider value={data}>
  <Child />
</Context.Provider>

// Transformed by plugin:
Context.Provider({
  value: data,
  children: () => jsx(Child, {})  // ← Deferred evaluation
})
```

This ensures Provider registers context **before** Child tries to access it via `useContext()`.

### ✅ Proper Lifecycle Management

```typescript
const appRoot = bootstrapApp()
  .root('#app')
  .onMount((element) => {
    // Called when app successfully mounts
    // Perfect for: analytics, feature flags, initial data fetch
  })
  .onError((error) => {
    // Called when app encounters errors
    // Perfect for: error reporting, fallback UI
  })
  .build();
```

## Common Mistakes to Avoid

### ❌ Forgetting pulsarPlugin()

```typescript
// ❌ WRONG - Context won't work
export default defineConfig({
  // Missing plugins: [pulsarPlugin()]
});
```

**Result:** `useContext()` throws "must be used within Provider"

### ❌ Using mount() Instead of AppContextProvider

```typescript
// ❌ OLD WAY - No context, no lifecycle
import { mount } from '@pulsar-framework/pulsar.dev';
mount(App, '#app');
```

**Result:** No AppContext, no lifecycle hooks, no proper initialization

### ❌ Skipping bootstrapApp()

```typescript
// ❌ WRONG - AppContextProvider needs a root
const app = (
  <AppContextProvider
    root={undefined}  // ← Missing root!
    context={{}}
  >
    <App />
  </AppContextProvider>
);
```

**Result:** AppContextProvider has no mount target

### ❌ Wrong JSX Configuration

```typescript
// ❌ WRONG - React JSX, not Pulsar
{
  "compilerOptions": {
    "jsx": "react",           // ❌ Should be "preserve"
    "jsxFactory": "React.createElement"  // ❌ Should be "h"
  }
}
```

**Result:** JSX transformed incorrectly, runtime errors

## Quick Start with CLI

Instead of manual setup, use the Pulsar CLI:

```bash
npm install -g @pulsar-framework/cli

pulsar create my-app --template basic
cd my-app
npm install
npm run dev
```

The CLI generates all configuration files with proper setup.

## Summary: Minimal Checklist

- [ ] Install `@pulsar-framework/pulsar.dev` and `@pulsar-framework/vite-plugin`
- [ ] Configure Vite with `pulsarPlugin()`
- [ ] Set TypeScript `jsx: "preserve"` and `jsxFactory: "h"`
- [ ] Create HTML with `<div id="app">`
- [ ] Bootstrap app with `bootstrapApp().root('#app').build()`
- [ ] Wrap app with `<AppContextProvider root={appRoot} context={{...}}>`
- [ ] Append to DOM: `document.getElementById('app')?.appendChild(app)`

**That's it!** You now have a fully functional Pulsar application with:

- Fine-grained reactivity
- Context system
- Lifecycle management
- Type safety
- Hot module replacement

## Next Steps

- [API Reference](./api-reference.md) - Complete API documentation
- [State Management](./state-management.md) - Redux-style stores
- [Dependency Injection](./dependency-injection.md) - IoC container
- [Error Boundaries](./error-boundaries/README.md) - Error handling patterns
- [Async Resources](./async-resources/README.md) - Data fetching

## Need Help?

- [GitHub Issues](https://github.com/binaryjack/pulsar.dev/issues)
- [Examples](../../packages/pulsar-demo/) - Working demo applications
- [CLI Templates](../../packages/pulsar-cli/templates/) - Scaffolding templates
