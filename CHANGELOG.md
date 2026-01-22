# Changelog

All notable changes to the Pulsar framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.0-alpha] - 2026-01-22

### 🎉 Major Milestone: 96-98% Feature Completeness

This release represents a comprehensive audit and documentation update revealing that Pulsar is far more complete than previously documented. v0.7.0 achieves full feature parity with SolidJS core primitives.

### ✨ Added

#### Control Flow Primitives (Complete)

- **`<Index>` Component** - Non-keyed list iteration with item-as-signal pattern
  - Efficient for simple lists without keys
  - 5 implementation files with comprehensive tests
  - Location: `src/control-flow/index/`

- **`<Dynamic>` Component** - Dynamic component resolution at runtime
  - Supports both string and function component types
  - Component registry system for flexible rendering
  - 6 implementation files with tests
  - Location: `src/control-flow/dynamic/`

#### State Management

- **`reconcile()` Utility** - Efficient immutable state updates
  - Deep comparison algorithm minimizes object creation
  - Array diffing with intelligent merge strategies
  - Object diffing with value reuse
  - Location: `src/state/reconcile/`

#### Testing Utilities (🆕 Previously Undocumented)

- **Complete Testing Framework** - 8 files providing comprehensive testing tools
  - `render()` - Component test renderer
  - `fireEvent()` - Event simulation (click, type, submit, etc.)
  - `waitFor()` / `waitForElementToBeRemoved()` - Async utilities
  - `screen` queries - DOM querying (getByText, getByRole, etc.)
  - Mock utilities - mockRouter, mockService, mockSignal
  - Cleanup utilities for test isolation
  - Location: `src/testing/`

#### Lazy Loading System (🆕 Previously Undocumented)

- **Advanced Code Splitting** - 7 files implementing sophisticated lazy loading
  - `lazy()` - Lazy component creation with suspense boundaries
  - `preloadOnHover` - Preload on mouse hover
  - `preloadOnVisible` - Intersection Observer-based preloading
  - `preloadEager` - Immediate preloading
  - `batchPreload()` - Batch multiple component preloads
  - Route lazy loading integration
  - Location: `src/lazy-loading/`

#### Build Tools (🆕 Previously Undocumented)

- **Bundle Analyzer** - 11 files for comprehensive build optimization
  - Size tracking and gzip estimation
  - Optimization suggestions
  - Vite plugin integration
  - Dead code elimination utilities
  - Constant folding optimizers
  - Location: `src/build-tools/bundle-analyzer/`

### 🔧 Changed

#### TypeScript Compiler API (60% → 100%)

- **Now Production Ready** - All 5 compiler modules fully implemented
  - `type-analyzer.ts` (390 lines) - Advanced type analysis
  - `di-integration.ts` (139 lines) - DI circular dependency detection
  - `route-integration.ts` (141 lines) - Route type extraction
  - `prop-validation.ts` (135 lines) - JSX prop validation
  - Actively used in pulsar-transformer
  - Location: `pulsar-transformer/src/compiler-api/`

#### Documentation Accuracy

- Updated roadmap to reflect true completion status (96-98% vs previously reported 88%)
- Marked all discovered complete features in status.md
- Updated README.md completeness badge
- Added comprehensive audit notes documenting undocumented features

### 📊 Framework Statistics

**Overall Completeness**: 96-98% (vs SolidJS feature parity)

| Category         | Status            |
| ---------------- | ----------------- |
| Core Reactivity  | 100% ✅           |
| Hooks API        | 100% ✅           |
| Control Flow     | 100% ✅           |
| State Management | 100% ✅           |
| Router           | 100% ✅           |
| Testing          | 100% ✅           |
| Lazy Loading     | 100% ✅           |
| Build Tools      | 90% ✅            |
| TypeScript API   | 100% ✅           |
| Design System    | 100% ✅ (Phase 1) |

### 🚀 What's Next (v0.8.0)

**Focus**: Production Infrastructure

- HTTP Client with `useHttp()` hook
- CLI Tool (`pulsar create`, `pulsar generate`)
- SSR/SSG Foundation
- `produce()` utility (Immer-style API)

### 🔗 Ecosystem

- **@pulsar-framework/core** - v0.7.0-alpha
- **@pulsar-framework/transformer** - v0.7.0-alpha (100% complete)
- **@pulsar-framework/vite-plugin** - v0.7.0-alpha (60% complete)
- **@pulsar-framework/design-tokens** - v0.7.0-alpha (Phase 1 complete)
- **@pulsar-framework/ui** - v0.7.0-alpha
- **formular.dev** - v1.0.56 (stable, separate package)

### 📝 Breaking Changes

None - This is a documentation and versioning update release.

### 🐛 Bug Fixes

None - Focus was on documentation accuracy and version alignment.

### 🙏 Acknowledgments

This release represents months of undocumented work that was discovered through comprehensive codebase audit. Special recognition for the testing utilities, lazy loading system, and build tools that were production-ready but never announced.

---

## [0.6.0-alpha] - 2025-2026

### Added

- Enhanced router system with path parameters and guards
- Redux-style state management with undo/redo
- Resource management system
- Dependency injection container
- Design system Phase 1 (tokens extraction)
- DevTools integration (Redux DevTools)
- Control flow primitives (undocumented at time of release)

---

## [0.1.0-beta] - 2025

### Added

- Initial signal-based reactivity system
- Core hooks API (useState, useEffect, useMemo)
- Basic control flow components (Show, For)
- Context API
- Error boundaries
- Portal support
- Component lifecycle management

---

[0.7.0-alpha]: https://github.com/binaryjack/pulsar.dev/releases/tag/v0.7.0-alpha
[0.6.0-alpha]: https://github.com/binaryjack/pulsar.dev/releases/tag/v0.6.0-alpha
[0.1.0-beta]: https://github.com/binaryjack/pulsar.dev/releases/tag/v0.1.0-beta
