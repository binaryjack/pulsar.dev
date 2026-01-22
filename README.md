<p align="center">
  <img src="https://raw.githubusercontent.com/binaryjack/pulsar-design-system/main/art-kit/SVG/pulsar-logo.svg" alt="Pulsar" width="400"/>
</p>

<p align="center">
  <strong>A reactive UI framework with TypeScript-first JSX transformation and fine-grained reactivity</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.9.0--alpha-blue" alt="Version 0.9.0-alpha"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0+-blue" alt="TypeScript 5.0+"/>
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License"/>
  <img src="https://img.shields.io/badge/status-production--ready-brightgreen" alt="Production Ready"/>
</p>

<p align="center">
  <a href="#what-is-pulsar">About</a> •
  <a href="#core-features">Features</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="./ROADMAP.md">Roadmap</a> •
  <a href="#ecosystem">Ecosystem</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <strong><a href="https://www.linkedin.com/in/tadeopiana/">follow me</a></strong>
</p>

---

## What is Pulsar?

**Pulsar is a reactive UI framework** that combines compile-time JSX transformation with runtime reactivity primitives. It transforms JSX syntax into direct DOM operations at build time and uses signal-based reactivity for surgical, fine-grained updates.

### Framework or Library?

Pulsar is **a framework** because it provides:

- A complete runtime system with lifecycle management
- Opinionated architecture for component composition
- Integrated tooling (TypeScript transformer + Vite plugin)
- Built-in patterns for routing, dependency injection, and error handling
- A complete application bootstrap system

While it's modular and allows selective feature usage, it prescribes a specific approach to building reactive UIs with transformed JSX.

### Core Philosophy

```typescript
// Components run ONCE, not on every state change
export const Counter = ({ initialCount = 0 }) => {
  const [count, setCount] = useState(initialCount)

  // count() is a getter - accessing it subscribes this DOM node
  return <div>{count()}</div>
  // Future updates: ONLY this text node changes, not entire component
}
```

Pulsar combines:

- **React's** familiar hooks API (`useState`, `useEffect`, `useMemo`)
- **SolidJS's** signal-based reactivity for surgical updates
- **Svelte's** compile-time philosophy (JSX → optimized DOM code)
- **TypeScript's** full type safety with first-class transformer support

---

## Core Features

### ✅ Production Ready Features (v0.9.0-alpha)

<table>
  <tr>
    <td width="200"><strong>🎯 Signal-Based Reactivity</strong></td>
    <td>
      • <code>createSignal</code>, <code>createEffect</code>, <code>createMemo</code><br/>
      • Fine-grained dependency tracking<br/>
      • Automatic subscription management<br/>
      • Batched updates with <code>batch()</code>
    </td>
  </tr>
  <tr>
    <td><strong>🪝 React-Like Hooks</strong></td>
    <td>
      • <code>useState</code> - State management with signals<br/>
      • <code>useEffect</code> - Side effects with dependencies<br/>
      • <code>useMemo</code> - Computed values<br/>
      • <code>useRef</code> - Mutable references
    </td>
  </tr>
  <tr>
    <td><strong>🗃️ State Management</strong></td>
    <td>
      • Redux-style stores with signals<br/>
      • <code>createStore</code>, <code>dispatch</code>, <code>subscribe</code><br/>
      • Undo/redo middleware (time-travel debugging)<br/>
      • Persistence (localStorage/sessionStorage)<br/>
      • Redux DevTools integration<br/>
      • Memoized selectors with <code>select()</code><br/>
      • <code>reconcile()</code> - Immutable reconciliation
    </td>
  </tr>
  <tr>
    <td><strong>🧭 Enhanced Router</strong></td>
    <td>
      • Path parameters: <code>/users/:id</code><br/>
      • Query string parsing with <code>useSearchParams()</code><br/>
      • Navigation hooks: <code>useRouter(), useNavigate(), useParams()</code><br/>
      • Route guards: <code>beforeEach, afterEach</code><br/>
      • Nested routes with <code>&lt;Outlet /&gt;</code>
    </td>
  </tr>
  <tr>
    <td><strong>🎨 Design System</strong></td>
    <td>
      • Framework-agnostic design tokens<br/>
      • CSS variable generation (build-time)<br/>
      • Dark mode support (automatic)<br/>
      • 200+ design variables exported
    </td>
  </tr>
  <tr>
    <td><strong>🔍 TypeScript Compiler API</strong></td>
    <td>
      • Type-safe routing (param extraction)<br/>
      • DI circular dependency detection<br/>
      • Enhanced error messages with suggestions<br/>
      • Auto prop validation from types<br/>
      • Route type integration<br/>
      • JSX prop validation
    </td>
  </tr>
  <tr>
    <td><strong>🔄 TypeScript Transformer</strong></td>
    <td>
      • JSX → Direct DOM compilation<br/>
      • Zero runtime JSX overhead<br/>
      • Automatic reactivity injection<br/>
      • Full type safety preserved
    </td>
  </tr>
  <tr>
    <td><strong>⚡ Control Flow</strong></td>
    <td>
      • <code>&lt;Show&gt;</code> - Conditional rendering<br/>
      • <code>&lt;For&gt;</code> - Keyed list rendering<br/>
      • <code>&lt;Index&gt;</code> - Non-keyed list rendering<br/>
      • <code>&lt;Dynamic&gt;</code> - Dynamic component resolution<br/>
      • Reactive updates only where needed
    </td>
  </tr>
  <tr>
    <td><strong>📦 Resource Management</strong></td>
    <td>
      • <code>createResource</code> - Async data fetching<br/>
      • <code>createTrackedResource</code> - Multi-resource tracking<br/>
      • <code>&lt;Waiting&gt;</code> component for loading states<br/>
      • Built-in caching and deduplication
    </td>
  </tr>
  <tr>
    <td><strong>📝 Form Management</strong> 🆕 v0.9.0</td>
    <td>
      • <code>useFormular()</code> - formular.dev integration<br/>
      • Signal-based reactive forms<br/>
      • Built-in validation (sync/async/custom)<br/>
      • Nested objects and arrays support<br/>
      • Form state tracking (dirty/touched/valid)<br/>
      • 41 passing tests (100%)
    </td>
  </tr>
  <tr>
    <td><strong>🔄 Immutable Updates</strong> 🆕 v0.9.0</td>
    <td>
      • <code>produce()</code> - Immer-style API<br/>
      • Nested draft tracking<br/>
      • Structural sharing optimization<br/>
      • Array and object proxy support<br/>
      • Type-safe with generics<br/>
      • 29 passing tests (100%)
    </td>
  </tr>
  <tr>
    <td><strong>🧬 Context System</strong></td>
    <td>
      • <code>createContext</code> / <code>useContext</code><br/>
      • React-like Context API<br/>
      • Provider-based value propagation
    </td>
  </tr>
  <tr>
    <td><strong>🎭 Portals</strong></td>
    <td>
      • <code>&lt;Portal&gt;</code> component<br/>
      • Render content outside component tree<br/>
      • Modal and overlay support
    </td>
  </tr>
  <tr>
    <td><strong>🛡️ Error Boundaries</strong></td>
    <td>
      • <code>&lt;Tryer&gt;</code> / <code>&lt;Catcher&gt;</code> components<br/>
      • Declarative error handling<br/>
      • Component error isolation
    </td>
  </tr>
  <tr>
    <td><strong>💉 Dependency Injection</strong></td>
    <td>
      • <code>ServiceManager</code> - IoC container<br/>
      • <code>ServiceLocator</code> - Service resolution<br/>
      • Singleton, transient, and scoped lifetimes<br/>
      • Type-safe service registration
    </td>
  </tr>
  <tr>
    <td><strong>🚀 Bootstrap System</strong></td>
    <td>
      • <code>bootstrapApp</code> - Application builder<br/>
      • <code>createApp</code> / <code>createOutlet</code><br/>
      • Lifecycle management<br/>
      • Multiple mount points support
    </td>
  </tr>
  <tr>
    <td><strong>🎪 Event System</strong></td>
    <td>
      • Event delegation for performance<br/>
      • Synthetic event wrappers<br/>
      • Automatic cleanup on unmount
    </td>
  </tr>
  <tr>
    <td><strong>🔌 Vite Plugi� Build Optimization</strong></td>
    <td>
      • Tree shaking analyzer implemented<br/>
      • CSS variable generator working<br/>
      • <strong>In Progress:</strong> Automatic dead code elimination (40%)<br/>
      • <strong>Planned:</strong> Component lazy loading, route splitting<br/>
      • <strong>Status:</strong> Foundation complete, automation pending
    </td>
  </tr>
  <tr>
    <td><strong>🎨 Styling System</strong></td>
    <td>
      • Manual style management works<br/>
      • Design tokens available<br/>
      • <strong>Missing:</strong> CSS-in-JS runtime, scoped styles, styled components<br/>
      • <strong>Status:</strong> Planned for future release
    </td>
  </tr>
  <tr>
    <td><strong>🔍 DevTools</strong> 🔗 v0.9.0</td>
    <td>
      • Redux DevTools integration ✅<br/>
      • <strong>Browser Extension:</strong> <a href="https://github.com/binaryjack/pulsar-dev-tools">pulsar-dev-tools</a> (separate repo)<br/>
      • Component tree inspector<br/>
      • Signal/state inspector<br/>
      • formular.dev form debugger<br/>
      • Time-travel debugging support
    </td>
  </tr>
  <tr>
    <td><strong>⚙️ Server-Side Rendering</strong> ✅ v0.8.0</td>
    <td>
      • <code>renderToString()</code> - Server-side rendering<br/>
      • <code>hydrate()</code> - Client-side hydration<br/>
      • <code>generateStatic()</code> - Static site generation<br/>
      • HTML escaping and XSS protection<br/>
      • State serialization/deserialization<br/>
      • 15+ passing tests (100%)
    </td>
  </tr>
  <tr>
    <td><strong>🧪 Testing Utilities</strong> ✅ v0.9.0</td>
    <td>
      • Component test renderer<br/>
      • Event simulation (<code>fireEvent</code>, <code>click</code>, <code>type</code>)<br/>
      • Async utilities (<code>waitFor</code>, <code>waitForElement</code>)<br/>
      • DOM queries (<code>screen.getByText</code>, <code>getByRole</code>)<br/>
      • formular.dev helpers (<code>fillField</code>, <code>submitForm</code>, <code>createMockForm</code>)<br/>
      • Mock utilities (<code>mockRouter</code>, <code>mockService</code>)<br/>
      • 25+ formular tests passing (100%)
  </tr>
  <tr>
    <td><strong>🌐 HTTP Client</strong> ✅ v0.8.0</td>
    <td>
      • <code>useHttp()</code> - Reactive HTTP hook<br/>
      • Request/response/error interceptors<br/>
      • Automatic caching with TTL<br/>
      • Retry logic with exponential backoff<br/>
      • Full TypeScript support<br/>
      • 25+ passing tests (100%)
    </td>
  </tr>
  <tr>
    <td><strong>🛠️ CLI Tool</strong> ✅ v0.8.0</td>
    <td>
      • <code>pulsar create</code> - Project scaffolding<br/>
      • <code>pulsar generate</code> - Code generation<br/>
      • <code>pulsar add</code> - Integration setup<br/>
      • <code>pulsar build</code> - Production builds<br/>
      • Interactive prompts and templates
    </td>
  </tr>
</table>

---

## Architecture Overview

### How It Works

#### 1. Build-Time Transformation

```tsx
// Your JSX code
<button onClick={increment}>{count()}</button>;

// Transforms to (simplified):
(() => {
  const el0 = document.createElement('button');
  el0.addEventListener('click', increment);
  createEffect(() => {
    el0.textContent = String(count());
  });
  return el0;
})();
```

**Key Benefits:**

- No virtual DOM diffing
- No reconciliation overhead
- Direct DOM operations
- Minimal runtime footprint (~5-10KB)

#### 2. Signal-Based Reactivity

```typescript
const [count, setCount] = useState(0);
// Returns: [getter, setter]

count(); // Read value (subscribes to changes)
setCount(5); // Write value (notifies subscribers)
```

**How it works:**

- State values wrapped in Signals
- Reading `count()` inside an Effect automatically subscribes
- Writing via `setCount()` triggers ONLY subscribed effects
- Automatic dependency tracking
- Surgical updates to specific DOM nodes

#### 3. Component Lifecycle

```typescript
export const Component = (props) => {
  // 🔵 Component function runs ONCE
  const [state, setState] = useState(0)

  useEffect(() => {
    // 🟢 Effects re-run when dependencies change
    console.log(state())
  }, [state])

  // 🔵 Returns DOM elements (not re-rendered)
  return <div>{state()}</div>
  // 🟢 Only text node updates when state changes
}
```

**No Re-renders:**

- Components run once at creation
- State changes don't trigger re-renders
- Effects track dependencies automatically
- Updates are surgical, not cascading

---

## Roadmap

**Current Version**: v0.9.0-alpha ✅  
**Next Release**: v1.0.0-stable (Q2 2026)  
**Last Updated**: January 23, 2026

### 🎯 Current Status

**v0.9.0-alpha - COMPLETE ✅** (100%)

- ✅ formular.dev integration (`useFormular()` hook) - 41 tests passing
- ✅ `produce()` utility (Immer-style API) - 29 tests passing
- ✅ Testing utilities (component testing, form helpers) - 25 tests passing
- 🔗 DevTools browser extension - [Separate repo](https://github.com/binaryjack/pulsar-dev-tools)

**v0.8.0-alpha - SHIPPED ✅** (January 2026)

- ✅ HTTP Client with `useHttp()` hook (25+ tests)
- ✅ CLI tool (`pulsar create`, `pulsar generate`, `pulsar add`)
- ✅ SSR/SSG foundation (`renderToString`, `hydrate`, `generateStatic`)

### 🚀 Coming Next

**v1.0.0 - Production Ready** (Q2 2026)

- Stable API with semver guarantees
- Comprehensive documentation site
- Real-world example applications
- Performance benchmarks vs React/Solid/Vue
- Long-term support (LTS) commitment
- Community contribution guidelines

### 📊 What's Complete (v0.1.0-v0.9.0)

**✅ Core Runtime (100%)**

- Signal-based reactivity, hooks, control flow (`<Show>`, `<For>`, `<Index>`, `<Dynamic>`), context, error boundaries, portals

**✅ State Management (100%)**

- Redux-style stores, undo/redo, persistence, DevTools integration, immutable updates (`produce()`)

**✅ Router (100%)**

- Path params, query strings, guards, nested routes, lazy loading

**✅ Forms (100%)**

- Via **formular.dev** integration - framework-agnostic, reactive, validated forms

**✅ DI System (100%)**

- IoC container with multiple lifetime scopes

**✅ Server-Side Rendering (100%)**

- `renderToString()`, `hydrate()`, `generateStatic()` with full state management

**✅ HTTP Client (100%)**

- `useHttp()` hook, interceptors, caching, retry logic

**✅ Testing Utilities (100%)**

- Component renderer, event simulation, form helpers, async utilities

**➡️ For detailed roadmap**: See [ROADMAP.md](./ROADMAP.md)

---

## Strategic Differentiation from Competitors

Pulsar + formular.dev aims to differentiate through four core pillars:

### 1. **True Framework Agnosticism** 🌐 ⭐ UNIQUE ADVANTAGE

- **formular.dev** works with Pulsar, React, Vue, Angular, or vanilla JS
- Build forms once, reuse across frameworks
- No vendor lock-in for form logic
- Migrate frameworks without rewriting forms
- **Competitors:** Angular Forms (Angular only), React Hook Form (React only)

### 2. **TypeScript Powerhouse** 🔮

- Deepest TypeScript Compiler API integration of any framework
- Compile-time validation and optimization beyond standard tooling
- Type-safe everything: routing, DI, themes, state machines, forms
- Zero-cost abstractions that compile away

### 3. **Enterprise-Ready Out-of-Box** 🏢

- **formular.dev:** 6 languages + 12 countries built-in (vs Angular's manual setup)
- Most sophisticated DI system in any reactive framework
- Built-in patterns for large-scale applications
- Micro-frontend support out of the box
- Observable and debuggable at production scale

### 4. **Performance First** ⚡

- Smaller bundle: ~22KB (Pulsar 10KB + formular.dev 12KB gzipped)
- **vs Angular:** ~70KB (Core + Forms)
- **vs React + RHF:** ~59KB (React 50KB + React Hook Form 9KB)
- Fine-grained reactivity with compile-time optimization

**Target Audience:**

- Teams building global applications (need i18n/multi-country out-of-box)
- TypeScript-heavy teams and organizations
- Enterprise applications requiring advanced patterns
- Teams migrating from Angular seeking modern DX
- Projects prioritizing type safety and build-time optimization
- Multi-framework teams (formular.dev portability advantage)
- 📦 Component library ecosystem
- 📦 CLI tools and generators

---

### 🔮 Future Vision (v2.0+)

**Experimental Features:**

- 🌐 Edge runtime support (Cloudflare Workers, Deno Deploy)
- 🔍 **DevTools browser extension** (component tree, state inspector, time-travel)
- 🤖 AI-powered code generation and refactoring
- 🎮 Web Components compilation target
- 📱 React Native bridge for native apps
- 🔗 GraphQL/tRPC first-class integration
- 🎯 Automatic accessibility (a11y) validation
- 🌍 Built-in i18n with compile-time extraction

---

## Framework Comparison

### How Pulsar Compares

| Feature             | React           | Vue 3               | Svelte             | SolidJS               | **Pulsar**                |
| ------------------- | --------------- | ------------------- | ------------------ | --------------------- | ------------------------- |
| **Reactivity**      | VDOM diffing    | Proxy-based         | Compile-time       | Fine-grained signals  | **Fine-grained signals**  |
| **Updates**         | Re-render tree  | Re-render component | Compile to updates | Update specific nodes | **Update specific nodes** |
| **State Syntax**    | `count`         | `count.value`       | `$count`           | `count()`             | **`count()`**             |
| **Virtual DOM**     | Yes             | Yes                 | No                 | No                    | **No**                    |
| **Bundle Size**     | ~45KB           | ~34KB               | ~2KB               | ~7KB                  | **~10KB**                 |
| **Component Model** | Function reruns | Function reruns     | Compile away       | Run once              | **Run once**              |
| **TypeScript**      | Good            | Good                | Good               | Excellent             | **Excellent**             |
| **JSX/Templates**   | JSX             | Templates/JSX       | Templates          | JSX                   | **JSX (transformed)**     |
| **SSR**             | Yes             | Yes                 | Yes                | Yes                   | **Yes (v0.8.0)**          |
| **DevTools**        | Excellent       | Excellent           | Good               | Good                  | **Good (v0.9.0)**         |
| **Ecosystem**       | Huge            | Large               | Growing            | Growing               | **New (v0.9.0)**          |

### When to Choose Pulsar

**Choose Pulsar if you want:**

- ✅ React-like hooks API without virtual DOM overhead
- ✅ Fine-grained reactivity with automatic dependency tracking
- ✅ **TypeScript-first with deep compiler integration**
- ✅ **Enterprise DI patterns built-in**
- ✅ Compile-time optimizations with no runtime JSX
- ✅ Minimal bundle size (~10KB vs React's 45KB)
- ✅ **Server-side rendering (SSR/SSG) support** ✅
- ✅ **formular.dev integration for reactive forms** ✅
- ✅ **Production-ready HTTP client with caching** ✅
- ✅ **CLI tools for scaffolding and code generation** ✅
- ✅ To learn cutting-edge reactive patterns

**Choose Pulsar OVER SolidJS if you:**

- 🎯 Need advanced dependency injection (decorators, modules, interceptors)
- 🎯 Want TypeScript Compiler API superpowers (type-safe routing, compile-time validation)
- 🎯 Require enterprise patterns (FSM, event sourcing, micro-frontends)
- 🎯 Need production observability built-in (APM, telemetry, monitoring)
- 🎯 Prefer aggressive build-time optimization over runtime
- 🎯 Building design-system-first applications
- 🎯 Migrating from Angular and want modern DX with familiar patterns

**Consider alternatives if you need:**

- ❌ Immediate production stability → **use SolidJS** (v1.8+ stable)
- ❌ SSR/SSG right now → **use SolidJS + SolidStart**
- ❌ Massive ecosystem → **use React**
- ❌ Enterprise-ready with full-stack framework → **use Next.js, Nuxt**
- ❌ Extensive third-party component libraries → **use React, Vue**

---

## Getting Started

### Installation

```bash
# Clone the monorepo
git clone https://github.com/binaryjack/visual-schema-builder.git
cd visual-schema-builder

# Install dependencies
pnpm install

# Build Pulsar
cd packages/pulsar
pnpm build

# Run demo applications
cd ../demo
pnpm dev
```

### Quick Example

```typescript
import { useState, useEffect, useMemo } from 'pulsar/hooks'
import { bootstrapApp } from 'pulsar/bootstrap'

const Counter = ({ initialCount = 0 }) => {
  const [count, setCount] = useState(initialCount)
  const [multiplier, setMultiplier] = useState(2)

  // Computed value (automatically tracks dependencies)
  const result = useMemo(() => count() * multiplier(), [count, multiplier])

  // Side effect (runs when count changes)
  useEffect(() => {
    console.log(`Count: ${count()}`)
  }, [count])

  return (
    <div className="counter">
      <h2>Count: {count()}</h2>
      <p>Result: {result()}</p>
      <button onClick={() => setCount(count() + 1)}>Increment</button>
      <button onClick={() => setCount(count() - 1)}>Decrement</button>
    </div>
  )
}

// Bootstrap your app
bootstrapApp({
  rootElement: () => <Counter initialCount={0} />,
  targetSelector: '#app'
})
```

### Form Management with formular.dev 🆕 v0.9.0

```typescript
import { useFormular } from '@pulsar-framework/pulsar.dev'

const SignupForm = () => {
  const form = useFormular({
    initialValues: {
      name: '',
      email: '',
      age: 18
    },
    validators: {
      name: 'required|minLength:2',
      email: 'required|email',
      age: 'required|number|min:18'
    },
    onSubmit: async (values) => {
      await api.post('/signup', values)
      console.log('User registered:', values)
    }
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        type="text"
        value={form.fields.name.value()}
        onInput={(e) => form.fields.name.setValue(e.target.value)}
        placeholder="Name"
      />
      {form.fields.name.error() && (
        <span class="error">{form.fields.name.error()}</span>
      )}

      <input
        type="email"
        value={form.fields.email.value()}
        onInput={(e) => form.fields.email.setValue(e.target.value)}
        placeholder="Email"
      />
      {form.fields.email.error() && (
        <span class="error">{form.fields.email.error()}</span>
      )}

      <button type="submit" disabled={form.isSubmitting()}>
        {form.isSubmitting() ? 'Submitting...' : 'Sign Up'}
      </button>
    </form>
  )
}
```

### Immutable Updates with produce() 🆕 v0.9.0

```typescript
import { produce } from '@pulsar-framework/pulsar.dev';

const [users, setUsers] = useState([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]);

// Immer-style immutable updates
const updateUserAge = (id: number, newAge: number) => {
  setUsers(
    produce(users(), (draft) => {
      const user = draft.find((u) => u.id === id);
      if (user) {
        user.age = newAge; // Mutate the draft directly!
      }
    })
  );
};

// Works with nested structures
const [state, setState] = useState({
  user: {
    profile: {
      settings: {
        theme: 'light',
      },
    },
  },
});

setState(
  produce(state(), (draft) => {
    draft.user.profile.settings.theme = 'dark'; // Deep mutation made easy
  })
);
```

### Testing Your Components 🆕 v0.9.0

```typescript
import { render, screen, fillField, submitForm, waitFor } from '@pulsar-framework/pulsar.dev';

describe('SignupForm', () => {
  it('should submit form with valid data', async () => {
    const onSubmit = vi.fn();
    render(SignupForm, { props: { onSubmit } });

    // Fill form fields
    fillField(screen.getByPlaceholder('Name'), 'John Doe');
    fillField(screen.getByPlaceholder('Email'), 'john@example.com');

    // Submit form
    const form = screen.getByRole('form');
    await submitForm(form, { waitForValidation: true });

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
    });
  });
});
```

### Project Structure

```
packages/
├── pulsar/         # Core framework
│   ├── src/
│   │   ├── reactivity/      # Signal system
│   │   ├── hooks/           # useState, useEffect, etc.
│   │   ├── control-flow/    # Show, For components
│   │   ├── context/         # Context API
│   │   ├── resource/        # Async resource management
│   │   ├── portal/          # Portal system
│   │   ├── error-boundary/  # Error handling
│   │   ├── di/              # Dependency injection
│   │   ├── router/          # Basic routing (WIP)
│   │   ├── lifecycle/       # Component lifecycle
│   │   ├── events/          # Event system
│   │   └── bootstrap/       # App initialization
│   └── art-kit/            # Brand assets
├── transformer/    # TypeScript JSX transformer
├── vite-plugin/    # Vite integration
└── demo/           # Example applications
```

---

## Performance Characteristics

### Benchmarks (v0.9.0-alpha)

| Metric             | Pulsar         | React  | SolidJS | Notes                           |
| ------------------ | -------------- | ------ | ------- | ------------------------------- |
| **Initial Render** | Fast ⚡        | Medium | Fast    | No VDOM creation overhead       |
| **Updates**        | Fastest ⚡⚡⚡ | Medium | Fastest | Surgical DOM updates only       |
| **Memory**         | Low 💚         | High   | Low     | No fiber tree or VDOM           |
| **Bundle Size**    | ~10KB          | ~45KB  | ~7KB    | Transformer at build time       |
| **Large Lists**    | Fastest ⚡⚡⚡ | Slower | Fastest | Fine-grained updates with `For` |

**Note:** Formal benchmarks pending. These are qualitative assessments based on architecture.

---

## Real-World Examples

Check out the demo applications:

- **Counter App** - State management, hooks, computed values
- **Todo App** - Complex state, context, localStorage integration
- **Showcase** - Component library built with Pulsar primitives

```bash
cd packages/demo
pnpm dev
```

---

## Why Pulsar?

Pulsar isn't about radical innovation—it's about **synthesis without compromise**.

Born from 15+ years of building with jQuery, Knockout, Angular, Vue, and React, Pulsar combines proven patterns:

- ✅ **Angular's** dependency injection → without the bloat
- ✅ **React's** hooks API → without the virtual DOM
- ✅ **SolidJS's** fine-grained reactivity → with familiar patterns
- ✅ **Svelte's** compiler approach → with TypeScript-first design
- ✅ **Vue's** progressive enhancement → with type safety

**The result?** A framework where you don't choose between:

- Performance vs developer experience
- Bundle size vs features
- Innovation vs familiarity
- Type safety vs simplicity

---

## Current Limitations (Beta)ramework-agnostic form management library

- ✅ Works with Pulsar, React, Vue, Angular, vanilla JS
- ✅ 6 languages built-in (EN, FR, ES, DE, PT, IT)
- ✅ 12+ country validation (phone, postal, SSN)
- ✅ 18+ validators with intelligent caching
- ✅ IoC/DI patterns that inspired Pulsar's architecture
- ✅ 45KB core (12KB gzipped), zero dependencies

**Pulsar v0.9.0-alpha Status:**

- ✅ **SSR/SSG Support** - Full server-side rendering implemented (v0.8.0)
- ✅ **Enhanced Router** - Path params, guards, nested routes complete
- ✅ **DevTools Integration** - Redux DevTools + browser extension (separate repo)
- ✅ **Forms Integration** - formular.dev integration with full validation
- ✅ **HTTP Client** - Production-ready with caching and interceptors
- ✅ **CLI Tools** - Scaffolding, generation, and integration commands
- ✅ **Testing Utilities** - Component testing and form helpers
- ⚠️ **Small Ecosystem** - Few third-party libraries (growing)
- ⚠️ **Breaking Changes Possible** - API stabilizing for v1.0
- ⚠️ **Documentation Growing** - Core docs complete, more examples needed

**Production Readiness:**

- ✅ **Suitable for production** with stable APIs (core, router, state, forms, SSR)
- ✅ Core features battle-tested with 300+ passing tests
- ⚠️ Monitor releases for breaking changes until v1.0.0
- ✅ Enterprise patterns (DI, state management) production-ready

**Best for:**

- 🚀 Production applications (with caution for API changes)
- 🏭 Enterprise internal tools and dashboards
- 📚 Learning modern reactive patterns
- 🔬 Building type-safe, reactive UIs
- 🧪 Prototyping and experiments
- 💻 Contributing to open-source frameworks

**Not recommended for:**

- ❌ Mission-critical applications requiring 100% API stability (wait for v1.0.0)
- ❌ Projects heavily dependent on extensive third-party React/Vue ecosystems
- ❌ Teams unable to monitor and adapt to breaking changes

---

## Documentation

### Core Guides

- [Architecture Deep Dive](./src/docs/architecture.md)
- [API Reference](./src/docs/api-reference.md)
- [Dependency Injection](./src/docs/dependency-injection.md)
- [Learning Journey](./src/docs/learning-journey.md)

### Examples

- [Demo Applications](https://github.com/binaryjack/pulsar-demo)
- [Component Showcase](https://github.com/binaryjack/pulsar-ui.dev)

---

## Ecosystem

Pulsar is a modular framework with dedicated packages for each concern:

### Core Packages

| Package                   | Description                                              | Repository                                                   |
| ------------------------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| **pulsar.dev**            | Main framework with reactivity, router, DI, lifecycle    | [GitHub](https://github.com/binaryjack/pulsar.dev)           |
| **@pulsar/transformer**   | TypeScript JSX transformer for compile-time optimization | [GitHub](https://github.com/binaryjack/pulsar-transformer)   |
| **@pulsar/vite-plugin**   | Vite integration plugin                                  | [GitHub](https://github.com/binaryjack/pulsar-vite-plugin)   |
| **@pulsar/design-tokens** | Framework-agnostic design tokens & brand assets          | [GitHub](https://github.com/binaryjack/pulsar-design-system) |
| **@pulsar/ui**            | Component library built with Pulsar                      | [GitHub](https://github.com/binaryjack/pulsar-ui.dev)        |
| **pulsar-demo**           | Example applications and demos                           | [GitHub](https://github.com/binaryjack/pulsar-demo)          |

### Related Projects

- **[formular.dev](https://github.com/binaryjack/formular.dev)** - Form management with IoC/DI patterns that inspired Pulsar's architecture

---

## Contributing

Pulsar is in **active development** (v0.7.0-alpha). Contributions are welcome!

### Ways to Contribute

- 🐛 **Report bugs** - Open issues with detailed reproduction steps
- 💡 **Suggest features** - Share ideas for framework improvements
- 📖 **Improve docs** - Help make our documentation clearer
- 🧪 **Write tests** - Increase coverage and catch regressions
- 💻 **Submit PRs** - Implement features or fix bugs
- 🎨 **Build components** - Contribute to the component library
- 📢 **Spread the word** - Share Pulsar with other developers

### Development Setup

```bash
# Clone the repository
git clone https://github.com/binaryjack/visual-schema-builder.git
cd visual-schema-builder

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run demo application
pnpm dev
```

### Code Guidelines

- ✅ TypeScript strict mode (no `any` types)
- ✅ Feature slice pattern (one item per file)
- ✅ Prototype-based classes for core APIs
- ✅ Comprehensive JSDoc comments
- ✅ Test coverage >80% for new features
- ✅ Follow existing code style and patterns

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## License

MIT License - Copyright (c) 2026 Pulsar Framework

See [LICENSE](./LICENSE) for full details.

---

## Acknowledgments

Built with ⚡ by [Tadeo Piana](https://www.linkedin.com/in/tadeopiana/) and contributors who refuse to compromise.

Special thanks to the authors of React, SolidJS, Svelte, and Vue for pioneering the patterns that made Pulsar possible.

---

<p align="center">
  <strong>Pulsar Framework - v0.7.0-alpha</strong><br/>
  TypeScript-first reactive UI framework with compile-time JSX transformation
</p>

<p align="center">
  <a href="https://github.com/binaryjack/pulsar.dev">GitHub</a> •
  <a href="https://www.linkedin.com/in/tadeopiana/">Connect with the Creator</a>
</p>
  <a href="https://github.com/binaryjack/visual-schema-builder/issues">Issues</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#documentation">Docs</a>
</p>
