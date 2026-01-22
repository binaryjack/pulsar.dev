# Visual Schema Builder - Quick Start Guide

## Installation

```bash
git clone https://github.com/binaryjack/visual-schema-builder.git
cd visual-schema-builder
npm install
```

## Building the Project

```bash
# Build once
npm run build

# Watch mode (recommended during development)
npm run build:watch
```

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm test -- --coverage
```

## Project Overview

Visual Schema Builder is a TypeScript framework that provides TSX-like syntax with:

- **Direct DOM manipulation** (no virtual DOM)
- **Signal-based reactivity** (fine-grained updates)
- **React-like hooks** (familiar API)
- **Prototype-based architecture** (functional composition)

## Basic Usage

### 1. Creating a Simple Component

```typescript
import { useState } from '@core'

const Greeting = ({ name }: { name: string }) => {
    const [count, setCount] = useState(0)
    
    return (
        <div>
            <h1>Hello, {name}!</h1>
            <p>Clicked {count()} times</p>
            <button onClick={() => setCount(count() + 1)}>
                Click me
            </button>
        </div>
    )
}
```

### 2. Using Effects

```typescript
import { useState, useEffect } from '@core'

const Timer = () => {
    const [seconds, setSeconds] = useState(0)
    
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(s => s() + 1)
        }, 1000)
        
        // Cleanup function
        return () => clearInterval(interval)
    }, [])
    
    return <div>Seconds: {seconds()}</div>
}
```

### 3. Computed Values

```typescript
import { useState, useMemo } from '@core'

const Calculator = () => {
    const [a, setA] = useState(5)
    const [b, setB] = useState(10)
    
    const sum = useMemo(() => a() + b(), [a, b])
    const product = useMemo(() => a() * b(), [a, b])
    
    return (
        <div>
            <p>Sum: {sum()}</p>
            <p>Product: {product()}</p>
        </div>
    )
}
```

### 4. Event Handling

```typescript
import { useState } from '@core'

const Form = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    
    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault()
        console.log({ name: name(), email: email() })
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                value={name()}
                onInput={(e) => setName(e.currentTarget.value)}
                placeholder="Name"
            />
            <input
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                placeholder="Email"
            />
            <button type="submit">Submit</button>
        </form>
    )
}
```

### 5. Lifecycle Hooks

```typescript
import { useState, onMount, onCleanup } from '@core'

const DataFetcher = ({ url }: { url: string }) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    
    onMount(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setData(data)
                setLoading(false)
            })
        
        return () => {
            console.log('Cleanup: cancel pending requests')
        }
    })
    
    if (loading()) return <div>Loading...</div>
    
    return <div>{JSON.stringify(data())}</div>
}
```

## Core Concepts

### Signals
Reactive primitives that notify subscribers when changed:

```typescript
import { createSignal } from '@core/reactivity'

const [count, setCount] = createSignal(0)

console.log(count())  // Read: 0
setCount(5)           // Write: 5
setCount(c => c + 1)  // Functional update: 6
```

### Effects
Auto-tracking side effects:

```typescript
import { createEffect } from '@core/reactivity'

const [count, setCount] = createSignal(0)

const dispose = createEffect(() => {
    console.log(`Count is: ${count()}`)  // Runs on every count change
})

setCount(1)  // Logs: "Count is: 1"
setCount(2)  // Logs: "Count is: 2"

dispose()    // Cleanup
```

### Memos
Lazy computed values:

```typescript
import { createMemo } from '@core/reactivity'

const [count, setCount] = createSignal(5)
const doubled = createMemo(() => count() * 2)

console.log(doubled())  // Computes: 10
console.log(doubled())  // Cached: 10

setCount(10)
console.log(doubled())  // Recomputes: 20
```

## Architecture Patterns

### Prototype-Based Classes

All classes use function constructors with `Object.assign`:

```typescript
// Define interface
export interface IMyClass {
    new (value: number): IMyClass
    value: number
    increment: () => void
    decrement: () => void
}

// Constructor function
export const MyClass = function(this: IMyClass, value: number) {
    Object.defineProperty(this, 'value', {
        value: value,
        writable: true,
        configurable: false
    })
} as any as { new (value: number): IMyClass }

// Prototype methods (in separate files)
const increment = function(this: IMyClass) {
    (this as any).value++
}

const decrement = function(this: IMyClass) {
    (this as any).value--
}

// Attach to prototype
Object.assign(MyClass.prototype, {
    increment,
    decrement
})
```

### Feature Slice Organization

```
my-feature/
├── my-feature.types.ts      # Interfaces
├── my-feature.ts            # Constructor
├── prototype/               # Methods
│   ├── method1.ts
│   ├── method2.ts
│   └── method3.ts
└── index.ts                 # Exports
```

## Examples

Check the `examples/` directory:

- **counter.tsx** - Simple counter with increment/decrement
- **todo-app.tsx** - Full-featured todo list with filters

## Testing

Example test structure:

```typescript
import { createSignal, createEffect } from '@core/reactivity'

describe('My Feature', () => {
    it('should update reactively', () => {
        const [count, setCount] = createSignal(0)
        let effectCount = 0
        
        const dispose = createEffect(() => {
            count()
            effectCount++
        })
        
        expect(effectCount).toBe(1)
        
        setCount(1)
        expect(effectCount).toBe(2)
        
        dispose()
    })
})
```

## Performance Tips

1. **Use memos for expensive computations**
   ```typescript
   const expensive = useMemo(() => heavyComputation(), [deps])
   ```

2. **Batch signal updates**
   ```typescript
   // Bad: triggers 3 effects
   setCount(1)
   setName('John')
   setEmail('john@example.com')
   
   // Good: consider batching in future version
   ```

3. **Cleanup effects properly**
   ```typescript
   useEffect(() => {
       const timer = setTimeout(...)
       return () => clearTimeout(timer)  // Always cleanup!
   }, [])
   ```

4. **Use keys for lists**
   ```typescript
   {items().map(item => (
       <div key={item.id}>{item.name}</div>
   ))}
   ```

## Troubleshooting

### Issue: Effect not triggering

**Problem:** Effect doesn't run when signal changes
**Solution:** Make sure you're calling the signal as a function inside the effect

```typescript
// ❌ Wrong
createEffect(() => {
    console.log(count)  // Not calling as function!
})

// ✅ Correct
createEffect(() => {
    console.log(count())  // Called as function
})
```

### Issue: Memory leaks

**Problem:** Components not cleaning up
**Solution:** Always return cleanup functions from effects

```typescript
useEffect(() => {
    const listener = () => { ... }
    window.addEventListener('resize', listener)
    
    return () => {
        window.removeEventListener('resize', listener)
    }
}, [])
```

### Issue: Stale closures

**Problem:** Effect using old value
**Solution:** Include all dependencies or use functional updates

```typescript
// ❌ Wrong
const [count, setCount] = useState(0)
useEffect(() => {
    setInterval(() => {
        setCount(count() + 1)  // Uses captured value
    }, 1000)
}, [])

// ✅ Correct
useEffect(() => {
    setInterval(() => {
        setCount(c => c + 1)  // Functional update
    }, 1000)
}, [])
```

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture
- Read [IMPLEMENTATION.md](./IMPLEMENTATION.md) for implementation status
- Check examples in `examples/` directory
- Run tests to see the system in action

## Contributing

This project follows strict coding patterns:

1. **No ES6 classes** - Use prototype-based constructors
2. **Feature Slice Design** - One feature per directory
3. **Individual method files** - Methods in `prototype/` folder
4. **Strong typing** - All interfaces prefixed with `I`
5. **Symbol tokens** - For dependency injection

See the existing code for patterns to follow.

## License

MIT
