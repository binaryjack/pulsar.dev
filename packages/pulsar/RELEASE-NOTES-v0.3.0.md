# Pulsar v0.3.0-alpha Release Notes

**Release Date:** 2025-06-15  
**Status:** Alpha - Internal Testing

## 🎯 Overview

Pulsar v0.3.0-alpha introduces a complete **state management system** built on top of Pulsar's fine-grained reactivity. This release brings Redux-style patterns with automatic persistence, time-travel debugging, and full TypeScript inference.

**Headline Features:**

- ✅ Redux-style stores with signal-based reactivity
- ✅ Undo/redo middleware for time-travel debugging
- ✅ Automatic state persistence (localStorage/sessionStorage)
- ✅ Redux DevTools integration
- ✅ Advanced compiler API integration modules

---

## 📦 What's New

### 1. State Management System 🗃️

Complete Redux-style state management with Pulsar reactivity:

```typescript
import { createStore } from 'pulsar';

interface AppState {
  count: number;
  user: string;
}

type Action = { type: 'INCREMENT' } | { type: 'SET_USER'; payload: string };

const store = createStore({ count: 0, user: 'Guest' }, (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
});

// Access state (reactive)
console.log(store.getState().count); // 0

// Dispatch actions
store.dispatch({ type: 'INCREMENT' });

// Subscribe to changes
const unsubscribe = store.subscribe((state) => {
  console.log('State:', state);
});
```

**Features:**

- Signal-based reactivity (no `connect()` HOC needed)
- Middleware support for extensibility
- Memoized selectors with `select()`
- DevTools integration for debugging
- Full TypeScript inference

**New APIs:**

- `createStore<T>(initialState, reducer, middleware?, devTools?)` - Create a Redux-style store
- `dispatch(action)` - Dispatch actions
- `subscribe(listener)` - Subscribe to state changes
- `select(selector)` - Create memoized selectors
- `getState()` - Get current state

**Documentation:** [STATE-MANAGEMENT.md](./src/docs/STATE-MANAGEMENT.md)

---

### 2. Time-Travel Debugging ⏱️

Undo/redo middleware for debugging complex state transitions:

```typescript
import { createStore, createUndoMiddleware, UndoRedoActions } from 'pulsar';

const store = createStore(initialState, reducer, createUndoMiddleware({ maxHistory: 50 }));

// Undo last action
store.dispatch(UndoRedoActions.undo());

// Redo
store.dispatch(UndoRedoActions.redo());

// Jump to specific history point
store.dispatch(UndoRedoActions.jump(5));

// Check history
const state = store.getState();
console.log('Can undo:', state.past.length > 0);
console.log('Can redo:', state.future.length > 0);
```

**Features:**

- Automatic history tracking
- Action filtering (exclude actions from history)
- Action grouping with debounce
- History metadata extraction
- `IHistoryState<T>` type with past/present/future

**New APIs:**

- `createUndoMiddleware(options?)` - Create undo/redo middleware
- `undoable(reducer, options?)` - Wrap reducers for undo/redo
- `UndoRedoActions.undo()` - Undo last action
- `UndoRedoActions.redo()` - Redo next action
- `UndoRedoActions.jump(index)` - Jump to history point
- `canUndo(state)` - Check if undo available
- `canRedo(state)` - Check if redo available
- `getHistoryMetadata(state)` - Get history stats

---

### 3. State Persistence 💾

Automatic localStorage/sessionStorage persistence:

```typescript
import { createPersistentStore } from 'pulsar';

const store = createPersistentStore(
  {
    initialState: { count: 0, user: 'Guest' },
    name: 'my-app',
    persist: {
      key: 'app-state',
      storage: localStorage,
      whitelist: ['user'], // Only persist user
      version: 1,
    },
  },
  reducer
);

// State automatically restored on page load
// Automatically saved after each action
```

**Features:**

- localStorage and sessionStorage support
- Selective persistence (whitelist/blacklist)
- Version migration for schema changes
- Custom serialization/deserialization
- Debounced saves (avoid excessive writes)
- Merge strategies for conflicts

**New APIs:**

- `createPersistentStore(options, reducer)` - Create store with persistence
- `createSessionStore(options, reducer)` - Session storage variant
- `createPersistMiddleware(options)` - Persistence middleware
- `restoreState(options)` - Manually restore state

**Options:**

- `key` - Storage key
- `storage` - localStorage or sessionStorage
- `whitelist` - Keys to persist
- `blacklist` - Keys to exclude
- `serialize/deserialize` - Custom serialization
- `version` - Schema version
- `migrate` - Version migration function
- `debounce` - Save debounce time (ms)
- `merge` - Merge strategy

---

### 4. Compiler API Integration Modules 🔍

New integration modules for TypeScript Compiler API:

#### Route Integration

```typescript
// Analyze route components
const routeInfo = analyzeRouteComponent(node, typeChecker);
// { path: '/users/:id', paramTypes: { id: 'string' } }

// Validate useParams calls
validateUseParamsCall(node, routeInfo, typeChecker);
// Errors if types don't match route definition
```

#### Prop Validation

```typescript
// Validate JSX props against TypeScript types
const errors = validateJSXProps(jsxNode, typeChecker);
// Reports: missing props, unknown props, type mismatches
```

#### DI Integration

```typescript
// Check for circular dependencies
const cycles = checkCircularDependencies(serviceGraph);
// Detects: A → B → C → A cycles
```

**New Modules:**

- `compiler-api/route-integration.ts` - Route type extraction and validation
- `compiler-api/prop-validation.ts` - JSX prop validation
- `compiler-api/di-integration.ts` - DI circular dependency detection

**Status:** ⚠️ Modules created but not yet wired into transformer pipeline

---

## 📊 Bundle Size Analysis

**Production Build:**

```
dist/index.js                     7.12 kB │ gzip: 1.87 kB
dist/state/store.js               1.55 kB │ gzip: 0.69 kB
dist/state/undo-redo.js           1.65 kB │ gzip: 0.66 kB
dist/state/persistence.js         2.12 kB │ gzip: 0.84 kB
```

**Total Core + State Management:** ~12.5 KB (gzipped: ~4 KB)

---

## 🎨 Improvements

### Documentation

- ✅ Complete state management guide (350+ lines)
- ✅ Todo app example with undo/redo + persistence
- ✅ Migration guide from Redux
- ✅ Performance tips and best practices

### TypeScript

- ✅ Full type inference for stores
- ✅ Generic constraints for persistence
- ✅ Type-safe action creators
- ✅ Strict mode compliance

### Developer Experience

- ✅ Redux DevTools integration
- ✅ Better error messages
- ✅ Memoized selectors by default
- ✅ Middleware composition utilities

---

## 🔧 Technical Details

### New Files Created

```
packages/pulsar/src/state/
├── store.ts          (273 lines) - Core store implementation
├── undo-redo.ts      (172 lines) - Time-travel debugging
├── persistence.ts    (268 lines) - State persistence
└── index.ts          (28 lines)  - Public API exports

packages/transformer/compiler-api/
├── route-integration.ts  (110 lines) - Route validation
├── prop-validation.ts    (120 lines) - Prop checking
└── di-integration.ts     (95 lines)  - DI validation

packages/pulsar/src/docs/
└── STATE-MANAGEMENT.md   (650+ lines) - Complete guide
```

**Total:** ~1,716 lines of production code + documentation

### Build Configuration

- TypeScript 5.9.3 (strict mode)
- Vite 6.4.1
- Build time: ~1.4s
- All type checks passing ✅

---

## 🚀 Migration Guide

### From Plain Signals to Store

**Before (v0.2.0):**

```typescript
const [count, setCount] = createSignal(0);
const [user, setUser] = createSignal('Guest');

// Manual coordination
setCount(count() + 1);
setUser('Alice');
```

**After (v0.3.0):**

```typescript
const store = createStore({ count: 0, user: 'Guest' }, (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
});

// Coordinated state updates
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'SET_USER', payload: 'Alice' });

// Still reactive!
const count = store.select((s) => s.count);
console.log(count()); // Updates automatically
```

### From Redux to Pulsar

**Key Differences:**

1. ✅ No `connect()` HOC - state is automatically reactive
2. ✅ Selectors are memoized by default with `select()`
3. ✅ Built-in undo/redo and persistence
4. ✅ TypeScript-first with full inference
5. ✅ Middleware system compatible with Redux middleware

**API Comparison:**

```typescript
// Redux
const store = createStore(reducer, initialState, applyMiddleware(...))
const state = store.getState()
store.dispatch(action)
const unsub = store.subscribe(listener)

// Pulsar (almost identical!)
const store = createStore(initialState, reducer, middleware)
const state = store.getState()
store.dispatch(action)
const unsub = store.subscribe(listener)
```

**Note:** Parameter order is swapped (`initialState` before `reducer`)

---

## ⚠️ Breaking Changes

None - this is a purely additive release.

---

## 🐛 Bug Fixes

- Fixed TypeScript generic constraint issues in persistence.ts
- Fixed build errors with unconstrained generics
- Improved type inference for nested state shapes

---

## 🎯 Known Issues

1. **Compiler API Integrations Not Wired**
   - Route validation, prop validation, and DI checks created but not enabled
   - Workaround: Modules exist, need transformer integration
   - Fix planned: v0.3.1

2. **DevTools Integration Needs Testing**
   - Redux DevTools integration implemented but not thoroughly tested
   - Workaround: Use console logging for debugging
   - Fix planned: v0.3.1

3. **No SSR Support Yet**
   - Store rehydration not implemented for SSR
   - Workaround: Client-side only
   - Fix planned: v0.5.0

---

## 📈 What's Next (v0.4.0)

**Planned Features:**

1. Testing utilities (`renderComponent`, `createMockStore`, `waitFor`)
2. Performance monitoring and profiling tools
3. Enhanced error messages with stack traces
4. Hot module replacement for state
5. Async actions middleware
6. Selector composition utilities

**Timeline:** 2-3 weeks

---

## 🤝 Acknowledgments

Special thanks to:

- **SolidJS** for signal-based reactivity inspiration
- **Redux** for state management patterns
- **TypeScript** team for incredible compiler APIs

---

## 📝 Full Changelog

### Added

- ✅ `createStore()` - Redux-style store with signals
- ✅ `createUndoMiddleware()` - Time-travel debugging
- ✅ `createPersistentStore()` - Automatic persistence
- ✅ `createSessionStore()` - Session storage variant
- ✅ `UndoRedoActions` - Undo/redo action creators
- ✅ `select()` - Memoized selector creation
- ✅ Redux DevTools integration
- ✅ Route type integration module
- ✅ JSX prop validation module
- ✅ DI circular dependency detection module
- ✅ Complete state management documentation

### Changed

- ⬆️ Updated README with v0.3.0 features
- ⬆️ Incremented version badge to 88% complete
- ⬆️ Updated STATUS.md with progress tracking

### Fixed

- 🐛 TypeScript generic constraint errors in persistence
- 🐛 Build errors with unconstrained type parameters

### Documentation

- 📖 Added STATE-MANAGEMENT.md (650+ lines)
- 📖 Added STATUS.md tracking document
- 📖 Updated README with state management features

---

## 📞 Feedback

This is an alpha release. Please report issues or suggestions:

- GitHub Issues: github.com/pulsar-framework/pulsar/issues
- Discord: discord.gg/pulsar-dev
- Email: dev@pulsarframework.dev

---

**Version:** v0.3.0-alpha  
**Released:** 2025-06-15  
**Next Release:** v0.4.0-alpha (Testing Utilities) - ETA 3 weeks
