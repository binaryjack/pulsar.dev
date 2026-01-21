# pulsar Architecture

## System Overview

pulsar consists of two main parts:

1. **Runtime** (`packages/core`) - Signal-based reactivity system
2. **Compiler** (`packages/transformer`) - JSX → DOM transformation

```
┌─────────────────────────────────────────────┐
│  JSX Source Code (.tsx)                     │
│  <Counter initialCount={0} />               │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  TypeScript Transformer                     │
│  - Parse JSX into IR                        │
│  - Generate DOM manipulation code           │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Generated JavaScript                       │
│  document.createElement('button')           │
│  createEffect(() => el.textContent = ...)   │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Runtime (Signals + Effects)                │
│  - Track dependencies                       │
│  - Update DOM surgically                    │
└─────────────────────────────────────────────┘
```

## Core Concepts

### 1. Signals - Reactive Primitives

Signals are the foundation of pulsar's reactivity:

```typescript
// Constructor (prototype-based)
export const Signal = function<T>(
  this: ISignalInternal<T>,
  initialValue: T
) {
  Object.defineProperty(this, '_value', {
    value: initialValue,
    writable: true,
    enumerable: false
  })
  
  Object.defineProperty(this, 'subscribers', {
    value: new Set<() => void>(),
    enumerable: false
  })
}

// Prototype methods
Signal.prototype.read = function() {
  // Auto-track if in effect context
  const activeEffect = getActiveEffect()
  if (activeEffect) {
    this.subscribers.add(activeEffect.execute)
  }
  return this._value
}

Signal.prototype.write = function(newValue) {
  if (this._value !== newValue) {
    this._value = newValue
    // Notify all subscribers
    this.subscribers.forEach(fn => fn())
  }
}
```

**Key properties:**
- Lazy evaluation (computed on read)
- Automatic dependency tracking
- Efficient updates (only when value changes)

### 2. Effects - Reactive Computations

Effects automatically re-run when their signal dependencies change:

```typescript
export const Effect = function(
  this: IEffectInternal,
  fn: () => void | (() => void)
) {
  Object.defineProperty(this, 'fn', { value: fn, enumerable: false })
  Object.defineProperty(this, 'dependencies', { 
    value: new Set(), 
    enumerable: false 
  })
}

Effect.prototype.execute = function() {
  // Set as active effect (for dependency tracking)
  setActiveEffect(this)
  
  // Clear old dependencies
  this.cleanup()
  
  // Run function (reads signals, auto-subscribes)
  const cleanup = this.fn()
  
  // Store cleanup function
  if (typeof cleanup === 'function') {
    this._cleanup = cleanup
  }
  
  // Clear active effect
  setActiveEffect(null)
}
```

**How it works:**
1. Effect runs, setting itself as "active"
2. Any signal reads during execution subscribe to this effect
3. When signals change, they notify the effect to re-run

### 3. Dependency Injection - Service Management

Inspired by [formular.dev's ServiceManager](https://github.com/binaryjack/formular.dev), pulsar provides an IoC container for managing application dependencies:

```typescript
// Service registration
const serviceManager = new ServiceManager()

serviceManager.register<IConfigService>(
  SConfigService,
  (sm) => new ConfigService(),
  { lifetime: 'singleton' }
)

serviceManager.register<IApiService>(
  SApiService,
  (sm) => new ApiService(sm.resolve(SConfigService)),
  { lifetime: 'singleton', dependencies: [SConfigService] }
)

// Integration with bootstrap
const appRoot = bootstrapApp()
  .ioc(serviceManager)
  .register<INotificationService>(SNotificationService, new NotificationService())
  .root('#app')
  .build()
```

**Key features:**
- Service lifetimes: singleton, transient, scoped
- Lazy resolution for performance
- Circular dependency detection
- Hierarchical containers (parent-child)
- TypeScript-first with full type safety

### 4. Component Model

Components are **factory functions** that return DOM elements:

```typescript
export const Counter = ({ initialCount = 0 }) => {
  // Setup (runs once)
  const [count, setCount] = useState(initialCount)
  
  // Create DOM
  const button = document.createElement('button')
  button.addEventListener('click', () => setCount(c => c + 1))
  
  // Reactive binding
  createEffect(() => {
    button.textContent = `Count: ${count()}`
  })
  
  return button
}
```

**But users write JSX:**

```tsx
export const Counter = ({ initialCount = 0 }) => {
  const [count, setCount] = useState(initialCount)
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count()}
    </button>
  )
}
```

**Which transforms to:**

```javascript
export const Counter = ({ initialCount = 0 }) => {
  const [count, setCount] = useState(initialCount)
  
  return (() => {
    const el0 = document.createElement('button')
    el0.addEventListener('click', () => setCount(c => c + 1))
    createEffect(() => {
      el0.textContent = `Count: ${String(count())}`
    })
    return el0
  })()
}
```

## Transformation Pipeline

### Phase 1: Analysis (JSX → IR)

```typescript
// Input JSX
<button onClick={handleClick} className="btn">
  Click {count()}
</button>

// Intermediate Representation
{
  type: 'element',
  tag: 'button',
  props: [
    { name: 'className', value: 'btn', isStatic: true }
  ],
  events: [
    { type: 'click', handler: handleClick }
  ],
  children: [
    { type: 'text', content: 'Click ' },
    { type: 'expression', expression: count(), isStatic: false }
  ]
}
```

### Phase 2: Generation (IR → AST)

```typescript
// Generated AST (TypeScript nodes)
factory.createCallExpression(
  factory.createArrowFunction(
    // IIFE wrapper
    factory.createBlock([
      // const el0 = document.createElement('button')
      factory.createVariableDeclaration(...),
      
      // el0.className = 'btn'
      factory.createExpressionStatement(...),
      
      // el0.addEventListener('click', handleClick)
      factory.createExpressionStatement(...),
      
      // createEffect(() => el0.textContent = ...)
      factory.createExpressionStatement(
        factory.createCallExpression(
          factory.createIdentifier('createEffect'),
          [factory.createArrowFunction(...)]
        )
      ),
      
      // return el0
      factory.createReturnStatement(...)
    ])
  )
)
```

### Phase 3: Printing (AST → JS)

```javascript
(() => {
  const el0 = document.createElement('button')
  el0.className = 'btn'
  el0.addEventListener('click', handleClick)
  
  const text0 = document.createTextNode('Click ')
  el0.appendChild(text0)
  
  createEffect(() => {
    const text1 = document.createTextNode(String(count()))
    el0.appendChild(text1)
  })
  
  return el0
})()
```

## Feature Slice Organization

Following Domain-Driven Design, features are self-contained:

```
packages/core/
├── reactivity/
│   ├── signal/
│   │   ├── signal.ts              # Constructor
│   │   ├── signal.types.ts        # Interfaces
│   │   ├── create-signal.ts       # Factory
│   │   ├── prototype/
│   │   │   ├── read.ts
│   │   │   ├── write.ts
│   │   │   ├── subscribe.ts
│   │   │   └── dispose.ts
│   │   └── index.ts               # Public API
│   ├── effect/
│   │   └── ...
│   └── memo/
│       └── ...
├── hooks/
│   ├── use-state/
│   ├── use-effect/
│   └── use-memo/
└── events/
    ├── event-delegator/
    └── synthetic-event/
```

**Benefits:**
- Clear boundaries
- Easy to understand
- Simple to test
- Can be extracted as separate packages

## Prototype-Based Classes

pulsar uses function constructors with prototype methods (NO ES6 classes):

```typescript
// ✅ CORRECT - Prototype pattern
export const Signal = function<T>(
  this: ISignalInternal<T>,
  initialValue: T
) {
  Object.defineProperty(this, '_value', {
    value: initialValue,
    writable: true,
    enumerable: false
  })
} as unknown as { new <T>(initialValue: T): ISignalInternal<T> }

// Prototype methods in separate files
export const read = function<T>(this: ISignalInternal<T>): T {
  return this._value
}

Signal.prototype.read = read

// ❌ WRONG - ES6 class
class Signal<T> {
  private _value: T
  
  constructor(initialValue: T) {
    this._value = initialValue
  }
  
  read(): T {
    return this._value
  }
}
```

**Why prototype-based?**
1. More functional/composable
2. Methods can be individually tested
3. Follows codebase style
4. Explicit property definitions
5. Better for tree-shaking

## Reactivity Flow

```
User Action (click)
    │
    ▼
Event Handler
    │
    ▼
setCount(newValue)  ← Signal write
    │
    ▼
Signal.write()
    │
    ├─► Check if value changed
    │
    ├─► Update internal value
    │
    └─► Notify all subscribers
            │
            ├─► Effect 1 (DOM update)
            ├─► Effect 2 (console.log)
            └─► Effect 3 (API call)
```

**No batching yet** (coming soon):
- Each signal write triggers subscribers immediately
- Multiple writes = multiple effect runs
- Needs batching for efficiency

## Context System

Similar to React Context but implemented with DOM tree:

```typescript
export function createContext<T>(defaultValue: T) {
  const contextId = Symbol('Context')
  
  const Provider = ({ value, children }) => {
    const container = document.createElement('div')
    container.setAttribute('data-context-id', contextId.toString())
    
    // Store value on container
    Object.defineProperty(container, '__contextValue', {
      value,
      enumerable: false
    })
    
    // Register in global registry
    contextRegistry.set(contextId, value)
    
    container.appendChild(children)
    return container
  }
  
  return { Provider, defaultValue, _id: contextId }
}

export function useContext<T>(context: IContext<T>): T {
  // Look up in registry
  return contextRegistry.get(context._id) ?? context.defaultValue
}
```

**Key difference from React:**
- Uses DOM tree + registry instead of fiber tree
- No consumer re-renders (signals handle updates)
- Simpler implementation

## Memory Management

pulsar uses WeakMaps and cleanup functions to prevent leaks:

```typescript
// Effect cleanup
Effect.prototype.dispose = function() {
  // Unsubscribe from all dependencies
  this.dependencies.forEach(dep => {
    dep.subscribers.delete(this.execute)
  })
  
  // Run cleanup function
  if (this._cleanup) {
    this._cleanup()
  }
}

// Component cleanup
component.addEventListener('unmount', () => {
  effects.forEach(effect => effect.dispose())
  signals.forEach(signal => signal.dispose())
})
```

## Performance Characteristics

| Operation | Complexity | Notes |
|-----------|-----------|-------|
| Signal read | O(1) | Direct property access |
| Signal write | O(n) | n = number of subscribers |
| Effect execute | O(m) | m = number of signal reads |
| Component mount | O(k) | k = number of DOM nodes |
| Component update | O(1) | Only changed nodes |

**Compared to React:**
- **No reconciliation** - O(tree) in React, O(1) in pulsar
- **No diffing** - React diffs VDOM, pulsar updates directly
- **No fiber** - Smaller memory footprint

## Future Enhancements

### 1. Batching
```typescript
batch(() => {
  setCount(1)
  setName('Bob')
  setAge(30)
})
// Single update instead of 3
```

### 2. Keyed Reconciliation
```typescript
<For each={items} key="id">
  {item => <TodoItem todo={item} />}
</For>
```

### 3. Suspense/Resources
```typescript
const [data] = createResource(() => fetchUser())
<Suspense fallback={<Loading />}>
  <UserProfile user={data()} />
</Suspense>
```

### 4. Store
```typescript
const store = createStore({
  user: null,
  isLoggedIn: false
})
// Reactive object proxy
```

## Conclusion

pulsar's architecture is built on three pillars:

1. **Signals** - Fine-grained reactive primitives
2. **Direct DOM** - No virtual layer
3. **Compile-time** - Transform JSX at build time

This results in a framework that's fast, small, and type-safe while maintaining familiar React-like ergonomics.
