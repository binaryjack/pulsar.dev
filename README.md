<p align="center">
  <img src="https://raw.githubusercontent.com/binaryjack/pulsar-design-system/main/art-kit/SVG/pulsar-logo.svg" alt="Pulsar" width="400"/>
</p>

<p align="center">
  <strong>A reactive UI framework with TypeScript-first JSX transformation and fine-grained reactivity</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.3.0--alpha-blue" alt="Version 0.3.0-alpha"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0+-blue" alt="TypeScript 5.0+"/>
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License"/>
  <img src="https://img.shields.io/badge/completeness-88%25-brightgreen" alt="88% Complete"/>
</p>

<p align="center">
  <a href="#what-is-pulsar">About</a> •
  <a href="#core-features">Features</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#roadmap">Roadmap</a> •
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

### ✅ Fully Implemented (v0.3.0-alpha)

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
    <td><strong>🗃️ State Management</strong> 🆕 v0.3.0</td>
    <td>
      • Redux-style stores with signals<br/>
      • <code>createStore</code>, <code>dispatch</code>, <code>subscribe</code><br/>
      • Undo/redo middleware (time-travel debugging)<br/>
      • Persistence (localStorage/sessionStorage)<br/>
      • Redux DevTools integration<br/>
      • Memoized selectors with <code>select()</code>
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
      • <code>&lt;For&gt;</code> - List rendering with keying<br/>
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
    <td><strong>🔍 DevTools</strong></td>
    <td>
      • Redux DevTools integration available<br/>
      • Console logging available<br/>
      • <strong>Missing:</strong> Component inspector, reactivity debugger, time-travel<br/>
      • <strong>Status:</strong> Partial implementation
    </td>
  </tr>
  <tr>
    <td><strong>⚙️ Server-Side Rendering</strong></td>
    <td>
      • <strong>Status:</strong> Not implemented - client-only for now<br/>
      • <strong>Planned:</strong> v0.5.0
    </td>
  </tr>
  <tr>
    <td><strong>🧪 Testing Utilities</strong></td>
    <td>
      • Unit tests exist for core features<br/>
      • <strong>Missing:</strong> Component testing utilities, test renderer<br/>
      • <strong>Status:</strong> Internal testing works, public API planned for v0.4.0
  </tr>
  <tr>
    <td><strong>⚙️ Server-Side Rendering</strong></td>
    <td>
      • <strong>Status:</strong> Not implemented - client-only for now
    </td>
  </tr>
  <tr>
    <td><strong>🧪 Testing Utilities</strong></td>
    <td>
      • Unit tests exist for core features<br/>
      • <strong>Missing:</strong> Component testing utilities, test renderer<br/>
      • <strong>Status:</strong> Internal testing works, public API planned
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

### ✅ v0.1.0 (Current Beta) - Core Foundation

**Completed:**

- ✅ Signal-based reactivity system
- ✅ TypeScript transformer with JSX compilation
- ✅ React-compatible hooks API
- ✅ Control flow components (`Show`, `For`)
- ✅ Resource management with async support
- ✅ Context API
- ✅ Portal system
- ✅ Error boundaries
- ✅ Dependency injection (IoC)
- ✅ Bootstrap and lifecycle management
- ✅ Event delegation system
- ✅ Vite plugin integration

**Completion:** ~85% (Core runtime complete, ecosystem developing)

### 🚧 v0.2.0 - Developer Experience & TypeScript Superpowers (Q2 2026)

**Core Features:**

- 🔄 Enhanced router with params, nested routes, guards
- 🔄 Testing utilities and test renderer
- 🔄 Component testing examples
- 🔄 Migration guides from React/Vue/Solid

**TypeScript Compiler API Features (NEW):**

- 🔮 Type-safe routing with automatic param extraction
- 🔮 Compile-time dependency validation for DI
- 🔮 Enhanced error messages with inline suggestions
- 🔮 Type-safe context with zero Provider boilerplate
- 🔮 Automatic prop validation from TypeScript types

**Developer Experience Revolution:**

- 👨‍💻 AI-powered error diagnosis and suggestions
- 👨‍💻 Improved error messages with "Did you mean?" hints
- 👨‍💻 Performance profiling tools with automatic recommendations
- 👨‍💻 Visual component inspector (hover preview in IDE)

**Expected Completion:** ~30% (routing basics done, compiler API work needed)

### 📋 v0.3.0 - Advanced Features & Build-Time Optimization (Q3 2026)

**Core Features:**

- ⏳ CSS-in-JS runtime with scoped styles
- ⏳ Animation primitives
- ⏳ Server-side rendering (SSR) support
- ⏳ Static site generation (SSG)
- ⏳ Streaming server rendering

**Design System First (NEW):**

- 🎨 Compile-time design tokens with type safety
- 🎨 First-class theme support (light/dark mode)
- 🎨 CSS variable generation at build time
- 🎨 Figma → Code integration
- 🎨 Zero-runtime styled components

**Aggressive Build-Time Optimization (NEW):**

- ⚡ Static analysis & advanced tree shaking
- ⚡ Compile-time constant folding
- ⚡ Automatic code splitting with smart preloading
- ⚡ Bundle size warnings at compile time
- ⚡ Dead code elimination beyond standard tools

**State Management Patterns (NEW):**

- 🔄 Built-in Finite State Machines (FSM)
- 🔄 Event sourcing pattern support
- 🔄 Time-travel debugging with state replay
- 🔄 State visualization in DevTools

**Expected Completion:** ~5% (early research phase)

### 🎯 v1.0.0 - Production Ready & Enterprise Features (Q4 2026)

**Stability & Documentation:**

- 📝 Comprehensive documentation site
- 📝 Real-world example applications
- 📝 Performance benchmarks vs React/Vue/Solid/SolidJS
- 📝 Stable API with semver guarantees
- 📝 Long-term support commitment
- 📝 Migration tools and codemods

**Enterprise-Grade Architecture (NEW):**

- 🏢 Advanced DI with decorators (@Injectable, @Inject)
- 🏢 Interceptors & middleware system
- 🏢 Module system (imports/exports like Angular)
- 🏢 Request/response interceptors
- 🏢 Scope hierarchy (request, session, singleton)

**Observable-First Architecture (NEW):**

- 📊 Built-in telemetry and performance tracking
- 📊 Automatic APM integration (Datadog, New Relic, Sentry)
- 📊 Signal state debugging with named signals
- 📊 Production observability dashboard
- 📊 Automatic error reporting with context

**Specialized Performance Modes (NEW):**

- 🚀 Virtual scrolling built into `<For>` component
- 🚀 Adaptive batching (mobile vs desktop)
- 🚀 Priority-based rendering (high/low priority)
- 🚀 Automatic device-specific optimizations
- 🚀 Memory vs speed optimization modes

**Micro-Frontend Support (NEW):**

- 🧩 Built-in module federation
- 🧩 Type-safe remote component composition
- 🧩 Shared state across micro-frontends
- 🧩 Version compatibility validation
- 🧩 Cross-team collaboration tools

**Ecosystem:**

- 📦 Official form management library
- 📦 Official router with full features
- 📦 Official state management patterns
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

## Strategic Differentiation from SolidJS

Pulsar aims to differentiate through three core pillars:

### 1. **TypeScript Powerhouse** 🔮

- Deepest TypeScript Compiler API integration of any framework
- Compile-time validation and optimization beyond standard tooling
- Type-safe everything: routing, DI, themes, state machines
- Zero-cost abstractions that compile away

### 2. **Enterprise-Ready Architecture** 🏢

- Most sophisticated DI system in any reactive framework
- Built-in patterns for large-scale applications
- Micro-frontend support out of the box
- Observable and debuggable at production scale

### 3. **Developer Experience Revolution** 👨‍💻

- AI-powered assistance and error diagnosis
- Visual debugging and component inspection
- Time-travel debugging with state replay
- Automatic performance optimization suggestions

**Target Audience:**

- TypeScript-heavy teams and organizations
- Enterprise applications requiring advanced patterns
- Teams migrating from Angular seeking modern DX
- Projects prioritizing type safety and build-time optimization

---

## Framework Comparison

### How Pulsar Compares

| Feature             | React           | Vue 3               | Svelte             | SolidJS               | **Pulsar**                |
| ------------------- | --------------- | ------------------- | ------------------ | --------------------- | ------------------------- |
| **Reactivity**      | VDOM diffing    | Proxy-based         | Compile-time       | Fine-grained signals  | **Fine-grained signals**  |
| **Updates**         | Re-render tree  | Re-render component | Compile to updates | Update specific nodes | **Update specific nodes** |
| **State Syntax**    | `count`         | `count.value`       | `$count`           | `count()`             | **`count()`**             |
| **Virtual DOM**     | Yes             | Yes                 | No                 | No                    | **No**                    |
| **Bundle Size**     | ~45KB           | ~34KB               | ~2KB               | ~7KB                  | **~5-10KB**               |
| **Component Model** | Function reruns | Function reruns     | Compile away       | Run once              | **Run once**              |
| **TypeScript**      | Good            | Good                | Good               | Excellent             | **Excellent**             |
| **JSX/Templates**   | JSX             | Templates/JSX       | Templates          | JSX                   | **JSX (transformed)**     |
| **SSR**             | Yes             | Yes                 | Yes                | Yes                   | **Planned (v0.3)**        |
| **DevTools**        | Excellent       | Excellent           | Good               | Good                  | **Planned (v0.2)**        |
| **Ecosystem**       | Huge            | Large               | Growing            | Growing               | **New (v0.1)**            |

### When to Choose Pulsar

**Choose Pulsar if you want:**

- ✅ React-like hooks API without virtual DOM overhead
- ✅ Fine-grained reactivity with automatic dependency tracking
- ✅ **TypeScript-first with deepest compiler integration** (coming v0.2)
- ✅ **Enterprise DI patterns built-in** (enhanced in v1.0)
- ✅ Compile-time optimizations with no runtime JSX
- ✅ Minimal bundle size (~5-10KB vs React's 45KB)
- ✅ **Design system support with type-safe tokens** (coming v0.3)
- ✅ **Production observability and telemetry** (coming v1.0)
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

### Benchmarks (Beta v0.1.0)

| Metric             | Pulsar         | React  | SolidJS | Notes                           |
| ------------------ | -------------- | ------ | ------- | ------------------------------- |
| **Initial Render** | Fast ⚡        | Medium | Fast    | No VDOM creation overhead       |
| **Updates**        | Fastest ⚡⚡⚡ | Medium | Fastest | Surgical DOM updates only       |
| **Memory**         | Low 💚         | High   | Low     | No fiber tree or VDOM           |
| **Bundle Size**    | ~5-10KB        | ~45KB  | ~7KB    | Transformer at build time       |
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

## Current Limitations (Beta)

**Be aware that Pulsar is in active beta (v0.1.0):**

- ⚠️ **No SSR/SSG** - Client-side only (for now)
- ⚠️ **Limited Router** - Basic hash routing, missing params/guards
- ⚠️ **No DevTools** - Console logging only (extension planned)
- ⚠️ **Small Ecosystem** - Few third-party libraries
- ⚠️ **Breaking Changes** - API not stable until v1.0
- ⚠️ **Limited Documentation** - Core docs exist, examples growing
- ⚠️ **Not Production Ready** - Use for experiments and learning

**Best for:**

- 🎓 Learning reactive programming patterns
- 🧪 Prototyping and experiments
- 🔬 Exploring signal-based reactivity
- 🚀 Building internal tools
- 📚 Contributing to open-source frameworks

**Not recommended for:**

- ❌ Production enterprise applications
- ❌ Projects needing extensive third-party libraries
- ❌ Teams requiring stable APIs
- ❌ SEO-critical websites (no SSR yet)

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

Pulsar is in **active development** (v0.3.0-alpha). Contributions are welcome!

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
  <strong>Pulsar Framework - v0.3.0-alpha</strong><br/>
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
