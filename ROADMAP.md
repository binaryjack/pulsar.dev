# Pulsar Framework Roadmap

**Current Version**: v0.7.0-alpha  
**Next Release**: v0.8.0-alpha (March-April 2026)  
**Last Updated**: January 22, 2026

---

## 🎯 Current Focus: v0.7.0-alpha → v0.8.0-alpha

**Mission**: Ship HTTP client, CLI tool, and SSR foundation for production readiness.
**v0.7.0 Status**: ✅ **COMPLETE** - All core primitives implemented!

### v0.7.0 Feature Status (COMPLETE)

| Feature               | Priority    | Status          | Notes                          |
| --------------------- | ----------- | --------------- | ------------------------------ |
| `<Index>` component   | 🔴 Critical | ✅ **Complete** | Shipped in v0.6.0              |
| `<Dynamic>` component | 🔴 Critical | ✅ **Complete** | Shipped in v0.6.0              |
| `reconcile()` utility | 🔴 Critical | ✅ **Complete** | Shipped in v0.6.0              |
| `produce()` utility   | 🟡 Optional | ⚪ Deferred     | Moved to v0.8.0 (low priority) |

**Recommendation**: Ship v0.7.0 now, focus on v0.8.0 critical features

---

## 📦 Completed Features (v0.1.0-v0.6.0)

### ✅ Core Runtime (100%)

- Signal-based reactivity (`createSignal`, `createEffect`, `createMemo`)
- React-like hooks (`useState`, `useEffect`, `useMemo`, `useRef`)
- Control flow (`<Show>`, `<For>`)
- Context API (`createContext`, `useContext`)
- Error boundaries (`<Tryer>`, `<Catcher>`)
- Portals (`<Portal>`)
- Component lifecycle

### ✅ State Management (100%)

- Redux-style stores (`createStore`, `dispatch`, `subscribe`)
- Undo/redo middleware (time-travel debugging)
- State persistence (localStorage/sessionStorage)
- Redux DevTools integration
- Memoized selectors

### ✅ Router System (100%)

- Path parameters (`/users/:id`)
- Query string parsing
- Navigation hooks (`useRouter`, `useNavigate`, `useParams`, `useSearchParams`)
- Route guards (`beforeEach`, `afterEach`)
- Nested routes with `<Outlet>`
- Lazy loading support

### ✅ Resource Management (100%)

- `createResource` - Async data fetching
- `createTrackedResource` - Multi-resource tracking
- `<Waiting>` component for loading states
- Caching and deduplication

### ✅ Dependency Injection (100%)

- IoC container (`ServiceManager`)
- Service resolution (`ServiceLocator`)
- Multiple lifetime scopes (singleton, transient, scoped)
- Type-safe registration

### ✅ TypeScript Compiler API (100%)

- TypeScript transformer (JSX → DOM)
- Type analyzer (390 lines)
- DI circular dependency detection
- Route type integration
- JSX prop validation
- 5 complete modules in pulsar-transformer

### ✅ Build Tools (90%)

- Bundle size analyzer (11 files)
- Vite plugin integration (60% - needs cleanup)
- Dead code elimination
- Constant folding optimizers
- Size tracking and gzip estimation

### ✅ Testing Utilities (100%)

- Component test renderer
- Event simulation (fireEvent, click, type)
- Async utilities (waitFor, waitForElementToBeRemoved)
- DOM queries (screen.getByText, getByRole)
- Mock utilities (mockRouter, mockService)
- 8-file testing framework

### ✅ Lazy Loading (100%)

- Lazy component creation
- Preload strategies (hover, visible, eager, batch)
- Route lazy loading integration
- 7-file lazy loading system

### ✅ Design System (100% Phase 1)

- Framework-agnostic design tokens (`@pulsar/design-tokens`)
- 7 token files (colors, spacing, typography, shadows, radius, transitions)
- Dark mode support
- Brand assets and icons (art-kit)

---

## 🚀 Release Timeline

### v0.7.0-alpha (February 2026) - Core Completeness ✅

**Focus**: Feature parity with SolidJS primitives  
**Progress**: 100% → ✅ **READY TO SHIP**

**Completed** ✅:

- ✅ `<Index>` component (non-keyed iteration) - Shipped in v0.6.0
- ✅ `<Dynamic>` component (dynamic component resolution) - Shipped in v0.6.0
- ✅ `reconcile()` utility (immutable state updates) - Shipped in v0.6.0
- ✅ Testing utilities (8 files) - Complete but undocumented
- ✅ Lazy loading system (7 files) - Complete but undocumented
- ✅ TypeScript Compiler API (5 modules) - 100% complete
- ✅ Build tools (bundle analyzer) - 90% complete

**Deferred** ⚪:

- ⚪ `produce()` utility (Immer-style API) - Moved to v0.8.0 (optional)

**Success Criteria**: 96-98% feature parity with SolidJS core ✅ **EXCEEDED**

---

### v0.8.0-alpha (March-April 2026) - Production Infrastructure

**Focus**: HTTP client, CLI, SSR foundation

**Critical Features**:

- 🚀 **HTTP Client** (HIGHEST PRIORITY)
  - `useHttp()` hook with interceptors
  - Request/response caching
  - TypeScript-safe endpoints
  - Retry logic and error handling
- 🚀 **CLI Tool** (HIGHEST PRIORITY)
  - `pulsar create app` - Project scaffolding
  - `pulsar generate component` - Code generation
  - `pulsar add formular.dev` - Pre-configured integrations
  - `pulsar build --ssr` - Build commands

- ⏳ **SSR Foundation**
  - Server-side rendering setup
  - Basic hydration
  - Static site generation (SSG)

**Success Criteria**: Production-ready tooling for client-side apps

---

### v0.9.0-alpha (May-June 2026) - Developer Experience

**Focus**: formular.dev integration, DevTools, testing

**Deliverables**:

- **formular.dev Integration**
  - `useFormular()` hook for Pulsar
  - Signal-based form reactivity
  - Example apps and patterns
- **DevTools Extension** (Browser)
  - Component tree inspector
  - Signal/state inspector
  - formular.dev form inspector
  - Performance profiler
  - Time-travel debugging
- **Testing Utilities**
  - Component test renderer
  - `@pulsar-framework/testing` package
  - formular.dev testing utilities

**Success Criteria**: Best-in-class DX for debugging and testing

---

### v1.0.0 (Q4 2026) - Production Ready

**Focus**: Stability, documentation, ecosystem maturity

**Requirements for v1.0**:

- ✅ Zero critical bugs
- ✅ Comprehensive documentation
- ✅ Migration guides (React, Vue, Angular → Pulsar)
- ✅ Real-world example applications
- ✅ Performance benchmarks vs competitors
- ✅ Stable API with semver guarantees
- ✅ LTS commitment (Long-term support)

**Ecosystem Maturity**:

- ✅ formular.dev (SHIPPED) - Framework-agnostic forms
  - 6 languages, 12+ countries
  - 18+ validators
  - 45KB (12KB gzipped)
- Component library
- Meta-framework (like Next.js/Analog)
- Official starter templates

**Success Criteria**: Production-ready for enterprise applications

---

## 🔮 Future Vision (v2.0+)

### Meta-Framework (Strategic Priority)

- File-based routing
- API routes and server functions
- Full-stack TypeScript
- Database integrations
- Deploy adapters (Vercel, Netlify, Cloudflare)

### Advanced Features

- Edge runtime support
- Mobile integration (Capacitor)
- GraphQL/tRPC first-class integration
- Animation library
- Offline-first patterns

---

## 📊 Feature Completeness

| Category             | Status  | Notes                           |
| -------------------- | ------- | ------------------------------- |
| **Core Reactivity**  | 100% ✅ | Signal system complete          |
| **Hooks API**        | 100% ✅ | React-compatible                |
| **Control Flow**     | 100% ✅ | All primitives complete         |
| **State Management** | 100% ✅ | Redux-style + reconcile         |
| **Router**           | 100% ✅ | Full-featured with lazy loading |
| **Testing**          | 100% ✅ | Complete framework              |
| **Lazy Loading**     | 100% ✅ | Multiple preload strategies     |
| **Build Tools**      | 90% ✅  | Bundle analyzer complete        |
| **TypeScript API**   | 100% ✅ | 5 compiler modules              |
| **Design System**    | 100% ✅ | Phase 1 complete                |
| **Forms**            | 100% ✅ | formular.dev (separate package) |
| **HTTP Client**      | 0% ❌   | Planned v0.8.0                  |
| **CLI Tool**         | 0% ❌   | Planned v0.8.0                  |
| **SSR/SSG**          | 0% ❌   | Planned v0.8.0                  |

**Overall Framework Completeness**: **96-98%** (vs SolidJS feature parity)
| **SSR/SSG** | 0% ❌ | Planned v0.8.0 |
| **CLI Tool** | 0% ❌ | Planned v0.8.0 |
| **DevTools** | 20% 🟡 | Redux DevTools only |
| **Testing** | 40% 🟡 | Internal tests, no public API |
| **i18n** | 100% ✅ | Via formular.dev |

**Overall Completeness**: ~95%

---

## 🎯 Strategic Differentiation

### Why Pulsar + formular.dev?

1. **Framework-Agnostic Forms** 🌐
   - formular.dev works with Pulsar, React, Vue, Angular
   - No vendor lock-in
   - Build once, reuse anywhere

2. **Enterprise i18n Out-of-Box** 🌍
   - 6 languages built-in (vs Angular's manual setup)
   - 12+ country validation patterns
   - Zero configuration

3. **Smallest Bundle** ⚡
   - Pulsar (10KB) + formular.dev (12KB) = ~22KB
   - vs Angular (~70KB) or React + RHF (~59KB)

4. **TypeScript-First** 🔮
   - Compile-time JSX transformation
   - Type-safe everything (routing, DI, forms)
   - Zero-cost abstractions

---

## 📝 Documentation

- [Main README](./README.md) - Overview and quick start
- [Architecture](./docs/architecture.md) - Design principles
- [API Reference](./docs/api-reference.md) - Complete API docs
- [Implementation Status](./docs/implementation-plans/status.md) - Detailed progress

---

**Questions or feedback?**  
📧 [Tadeo Piana](https://www.linkedin.com/in/tadeopiana/)  
🐛 [Report Issues](https://github.com/binaryjack/pulsar.dev/issues)
