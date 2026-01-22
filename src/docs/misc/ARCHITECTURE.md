# Visual Schema Builder - Architecture Documentation

## Overview

A TypeScript framework that provides TSX-like syntax with direct DOM manipulation, signal-based reactivity, and prototype-based class architecture.

## Core Principles

### 1. Prototype-Based Classes
All classes follow the prototype pattern instead of ES6 `class` syntax:

```typescript
// Constructor function
export const Signal = function<T>(this: ISignal<T>, initialValue: T) {
    Object.defineProperty(this, '_value', {
        value: initialValue,
        writable: true,
        configurable: false,
        enumerable: false
    })
} as any as { new <T>(initialValue: T): ISignal<T> }

// Attach methods to prototype
Object.assign(Signal.prototype, {
    read,
    write,
    subscribe,
    unsubscribe,
    dispose
})
```

### 2. Feature Slice Design
Each feature is organized in its own directory with:
- `feature.types.ts` - Interface definitions
- `feature.ts` - Constructor function
- `prototype/` - Individual method files
- `index.ts` - Barrel exports

### 3. Signal-Based Reactivity
Unidirectional data flow using signals, effects, and memos:

```
User Action → Signal Update → Effects Triggered → DOM Updated
```

## Core Systems

### Reactivity System

#### Signal
Fine-grained reactive primitive:
```typescript
const [count, setCount] = createSignal(0)
console.log(count()) // Read: 0
setCount(5)          // Write: 5
```

**Implementation:**
- `read()` - Tracks dependencies in active effect
- `write()` - Updates value and notifies subscribers
- Automatic dependency tracking

#### Effect
Automatically tracks signal dependencies and re-runs:
```typescript
const dispose = createEffect(() => {
    console.log(count()) // Tracks count signal
    // Runs whenever count changes
    
    return () => {
        // Cleanup function
    }
})
```

#### Memo
Memoized computed values:
```typescript
const doubled = createMemo(() => count() * 2)
console.log(doubled()) // Computed lazily
```

### Hooks System

React-compatible API built on signals:

```typescript
// State management
const [count, setCount] = useState(0)

// Side effects
useEffect(() => {
    console.log('Mounted')
    return () => console.log('Unmounted')
}, [])

// Computed values
const doubled = useMemo(() => count() * 2, [count])

// Mutable refs
const ref = useRef<HTMLElement>(null)
```

## Component Model

### TSX-Like Syntax
```typescript
interface IMyCardProps {
    id: string
    title: string
    onAction: () => void
}

const MyCard = ({ id, title, onAction }: IMyCardProps) => {
    const [count, setCount] = useState(0)
    
    return (
        <div className={`my-card-${id}`} onClick={onAction}>
            <h2>{title}</h2>
            <button onClick={() => setCount(count() + 1)}>
                Count: {count()}
            </button>
        </div>
    )
}
```

### Transformation Target

The TypeScript transformer will convert the above to:

```typescript
const MyCard = ({ id, title, onAction }: IMyCardProps) => {
    const [count, setCount] = createSignal(0)
    
    // Direct DOM creation
    const div = document.createElement('div')
    div.addEventListener('click', onAction)
    
    // Reactive class name
    createEffect(() => {
        div.className = `my-card-${id()}`
    })
    
    const h2 = document.createElement('h2')
    h2.textContent = title
    
    const button = document.createElement('button')
    button.addEventListener('click', () => setCount(count() + 1))
    
    // Reactive text content
    createEffect(() => {
        button.textContent = `Count: ${count()}`
    })
    
    div.appendChild(h2)
    div.appendChild(button)
    
    // Lifecycle
    onMount(() => {
        console.log('Card mounted')
    })
    
    return div
}
```

## Performance Characteristics

### Direct DOM Manipulation
- ✅ No virtual DOM overhead
- ✅ No reconciliation/diffing needed
- ✅ Minimal memory footprint

### Fine-Grained Reactivity
- ✅ Only affected DOM nodes update
- ✅ Automatic dependency tracking
- ✅ Lazy computation for memos

### Unidirectional Flow
- ✅ Predictable state changes
- ✅ Easy to debug
- ✅ No circular dependencies

## Project Structure

```
packages/
├── core/                          # Runtime library
│   ├── reactivity/               # Signal, Effect, Memo
│   │   ├── signal/
│   │   │   ├── prototype/
│   │   │   │   ├── read.ts
│   │   │   │   ├── write.ts
│   │   │   │   ├── subscribe.ts
│   │   │   │   ├── unsubscribe.ts
│   │   │   │   └── dispose.ts
│   │   │   ├── signal.ts
│   │   │   ├── signal.types.ts
│   │   │   ├── create-signal.ts
│   │   │   └── index.ts
│   │   ├── effect/
│   │   └── memo/
│   │
│   ├── hooks/                    # React-like hooks
│   │   ├── use-state/
│   │   ├── use-effect/
│   │   ├── use-memo/
│   │   └── use-ref/
│   │
│   ├── dom/                      # (TODO) DOM manipulation
│   ├── events/                   # (TODO) Event system
│   ├── lifecycle/                # (TODO) Component lifecycle
│   └── css-in-js/                # (TODO) Styling
│
└── transformer/                   # (TODO) TypeScript transformer
    ├── parser/                   # JSX analysis
    ├── ir/                       # Intermediate representation
    └── generator/                # Code generation
```

## Next Steps

### Immediate
1. ✅ Core reactivity (Signal, Effect, Memo)
2. ✅ Hooks system (useState, useEffect, useMemo, useRef)
3. ⏳ DOM manipulation utilities
4. ⏳ Event system with synthetic events
5. ⏳ Lifecycle management
6. ⏳ TypeScript transformer

### Future
- CSS-in-JS system
- Server-side rendering
- Developer tools
- Performance profiling
- Advanced hooks (useContext, useReducer)

## Usage Example

```typescript
import { useState, useEffect } from '@core/hooks'

interface ITodoAppProps {
    initialTodos?: Todo[]
}

const TodoApp = ({ initialTodos = [] }: ITodoAppProps) => {
    const [todos, setTodos] = useState(initialTodos)
    const [input, setInput] = useState('')
    
    const addTodo = () => {
        if (input().trim()) {
            setTodos([...todos(), { 
                id: Date.now(), 
                text: input(), 
                completed: false 
            }])
            setInput('')
        }
    }
    
    useEffect(() => {
        console.log(`Todo count: ${todos().length}`)
    }, [todos])
    
    return (
        <div className="todo-app">
            <h1>My Todos</h1>
            
            <input 
                value={input()}
                onInput={(e) => setInput(e.currentTarget.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <button onClick={addTodo}>Add</button>
            
            <ul>
                {todos().map(todo => (
                    <li key={todo.id}>
                        <input 
                            type="checkbox" 
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                        />
                        {todo.text}
                    </li>
                ))}
            </ul>
        </div>
    )
}
```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Building

Build the project:
```bash
npm run build
```

Build in watch mode:
```bash
npm run build:watch
```
