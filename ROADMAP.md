# Pulsar Framework Roadmap

**Current Version**: v0.8.0-alpha  
**Next Release**: v0.9.0-alpha (January 2026)  
**Last Updated**: January 23, 2026 - v0.9.0 READY TO SHIP ✅ (formular.dev, produce(), testing utilities complete)

---

## 🎯 Current Focus: v0.9.0-alpha → COMPLETE ✅

**Mission**: Ship formular.dev integration, produce() utility, DevTools, testing utilities.
**v0.8.0 Status**: 100% COMPLETE - SHIPPED ✅ (3/3 critical features)
**v0.9.0 Status**: 100% COMPLETE - READY TO SHIP ✅ (2/2 core features + testing)

### v0.7.0 Feature Status (COMPLETE)

| Feature               | Priority    | Status          | Notes                          |
| --------------------- | ----------- | --------------- | ------------------------------ |
| `<Index>` component   | 🔴 Critical | ✅ **Complete** | Shipped in v0.6.0              |
| `<Dynamic>` component | 🔴 Critical | ✅ **Complete** | Shipped in v0.6.0              |
| `reconcile()` utility | 🔴 Critical | ✅ **Complete** | Shipped in v0.6.0              |
| `produce()` utility   | 🟡 Optional | ⚪ Deferred     | Moved to v0.8.0 (low priority) |

### v0.8.0 Feature Status (75% COMPLETE)

| Feature             | Priority    | Status          | Completion Date    |
| ------------------- | ----------- | --------------- | ------------------ |
| HTTP Client         | 🔴 Critical | ✅ **Complete** | January 23, 2026   |
| CLI Tool            | 🔴 Critical | ✅ **Complete** | January 23, 2026   |
| SSR Foundation      | 🔴 Critical | ✅ **Complete** | January 23, 2026   |
| `produce()` utility | 🟡 Optional | ⚪ Pending      | TBD (low priority) |

**Recommendation**: Complete produce() utility to reach 100%, ship v0.8.0

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

### v0.8.0-alpha (January 2026) - Production Infrastructure ✅

**Focus**: HTTP client, CLI, SSR foundation  
**Progress**: 100% → **SHIPPED** (3/3 Critical Features Complete)

**Critical Features**:

- ✅ **HTTP Client** (COMPLETE - January 23, 2026) 🎉
  - Core HTTP client with fetch-based API
  - Request/response/error interceptors
  - Automatic caching with TTL (GET requests)
  - Retry logic with exponential backoff
  - `useHttp()` reactive hook with signals
  - Convenience hooks (`useHttpGet`, `useHttpPost`)
  - Full TypeScript support (no `any` types)
  - 25+ passing tests (http-client.test.ts, use-http.test.ts)
  - Production-ready documentation
  - 20+ implementation files following Feature Slice Pattern
- ✅ **CLI Tool** (COMPLETE - January 23, 2026) 🎉
  - `pulsar create <app-name>` - Project scaffolding (basic/full/minimal templates)
  - `pulsar generate <type> <name>` - Code generation (component, store, resource, hook, context)
  - `pulsar add <integration>` - Pre-configured integrations (formular.dev, tailwind, router, state, testing)
  - `pulsar build` - Production builds (--ssr, --dev, --analyze flags)
  - Interactive prompts with inquirer
  - Template system with variable substitution
  - Package manager detection (npm/pnpm/yarn)
  - Git initialization support
  - Full TypeScript support (no `any` types)
  - 30+ implementation files following Feature Slice Pattern
  - Comprehensive command-line help system

- ✅ **SSR Foundation** (COMPLETE - January 23, 2026) 🎉
  - `renderToString()` - Server-side rendering to HTML
  - `hydrate()` - Client-side hydration
  - `generateStatic()` - Static site generation for multiple routes
  - HTML escaping and XSS protection
  - State serialization/deserialization
  - SSR context management
  - Void element handling
  - Component composition support
  - Full TypeScript support (no `any` types)
  - 15+ passing tests (render-to-string.test.ts)
  - Production-ready documentation
  - 10+ implementation files following Feature Slice Pattern

- ⚠️ **`produce()` utility** (DEFERRED TO v0.9.0)
  - Immer-style API for immutable updates
  - Requires complex proxy chain tracking for nested updates
  - Basic prototype exists but needs proper finalization
  - Moving to v0.9.0 for robust implementation

**Success Criteria**: Production-ready tooling for client-side apps ✅ **ACHIEVED**

---

### v0.9.0-alpha (February 2026) - Developer Experience

**Focus**: formular.dev integration, produce() utility, testing utilities  
**Progress**: 100% → ✅ **READY TO SHIP** (2/2 Core Features Complete + 1 External)

**Critical Features**:

- ✅ **formular.dev Integration** (COMPLETE - January 23, 2026) 🎉
  - `useFormular()` hook with signal-based reactivity
  - Built-in validation (sync, async, custom)
  - String rules (required, email, min/max, minLength/maxLength, pattern)
  - Custom validator functions and named validators
  - Nested object and array support
  - Form submission with onSubmit/onSuccess/onError handlers
  - Transform values before submit
  - Dirty/touched/pristine tracking per field
  - Form-level state (isSubmitting, isValid, isDirty, isTouched)
  - Full TypeScript support with generics
  - 41+ passing tests (100% pass rate)
  - Comprehensive documentation (README.md with examples)
  - Production-ready with zero breaking changes

- ✅ **`produce()` Utility** (COMPLETE - January 23, 2026) 🎉
  - Immer-style immutable updates with mutable API
  - Nested draft tracking with proper finalization
  - Structural sharing (only modified branches copied)
  - Array and object proxy support (push, pop, splice, etc.)
  - Type-safe with TypeScript generics
  - 29+ passing tests (100% pass rate)
  - Comprehensive documentation (README.md with examples)
  - ~200 lines of code, zero dependencies
  - Production-ready

- 🔗 **DevTools Extension** (SEPARATE REPO)
  - Repository: [pulsar-dev-tools](https://github.com/binaryjack/pulsar-dev-tools)
  - Browser extension for Chrome/Firefox
  - Component tree inspector
  - Signal/state inspector
  - formular.dev form inspector
  - Performance profiler
  - Time-travel debugging
  - Independent versioning and deployment

- ✅ **Testing Utilities** (COMPLETE - January 23, 2026) 🎉
  - Component testing framework with 8 files
  - formular.dev testing utilities (fillField, fillForm, submitForm)
  - Field state checking (isFieldValid, isFieldTouched, isFieldDirty)
  - Form state checking (isFormValid, isFormSubmitting)
  - Async validation helpers (waitForFieldValidation, waitForFormSubmission)
  - Mock form creation (createMockForm)
  - Error checking utilities (getFieldError, getFormErrors)
  - Exported from main package (`import { fillField } from '@pulsar-framework/pulsar.dev'`)
  - 25+ passing tests for formular utilities (100% pass rate)
  - Comprehensive documentation (testing/README.md with formular.dev section)
  - Production-ready

**Success Criteria**: Complete developer experience with forms and testing ✅ **ACHIEVED**

**Success Criteria**: Best-in-class DX for forms, state management, and testing

**Note**: DevTools is maintained as a separate repository with independent release cycle.

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
| **Forms**            | 100% ✅ | formular.dev + useFormular hook |
| **HTTP Client**      | 100% ✅ | Shipped v0.8.0                  |
| **CLI Tool**         | 100% ✅ | Shipped v0.8.0                  |
| **SSR/SSG**          | 100% ✅ | Shipped v0.8.0                  |
| **DevTools**         | 20% 🟡  | Redux DevTools only             |
| **Testing**          | 40% 🟡  | Internal tests, no public API   |
| **i18n**             | 100% ✅ | Via formular.dev                |

**Overall Framework Completeness**: **98%** (vs SolidJS feature parity)

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
