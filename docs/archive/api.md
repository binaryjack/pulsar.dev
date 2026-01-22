# Visual Schema Builder - API Reference

## Reactivity API

### `createSignal<T>(initialValue: T, options?: ISignalOptions<T>)`

Creates a reactive signal that tracks dependencies and notifies subscribers.

**Parameters:**
- `initialValue: T` - Initial value of the signal
- `options?: ISignalOptions<T>` - Optional configuration
  - `equals?: (prev: T, next: T) => boolean` - Custom equality comparator

**Returns:** `[get: () => T, set: (value: T | ((prev: T) => T)) => void]`

**Example:**
```typescript
const [count, setCount] = createSignal(0)

console.log(count())     // 0
setCount(5)              // Set value
setCount(c => c + 1)     // Functional update
```

---

### `createEffect(fn: () => void | (() => void))`

Creates an effect that automatically tracks signal dependencies and re-runs when they change.

**Parameters:**
- `fn: () => void | (() => void)` - Effect function, optionally returns cleanup

**Returns:** `() => void` - Dispose function

**Example:**
```typescript
const [count, setCount] = createSignal(0)

const dispose = createEffect(() => {
    console.log(`Count: ${count()}`)
    
    return () => {
        console.log('Cleanup')
    }
})

setCount(1)  // Logs: "Count: 1"
dispose()    // Runs cleanup
```

---

### `createMemo<T>(computeFn: () => T)`

Creates a memoized computed value that only recomputes when dependencies change.

**Parameters:**
- `computeFn: () => T` - Computation function

**Returns:** `() => T` - Getter for memoized value

**Example:**
```typescript
const [count, setCount] = createSignal(5)
const doubled = createMemo(() => count() * 2)

console.log(doubled())  // 10 (computed)
console.log(doubled())  // 10 (cached)

setCount(10)
console.log(doubled())  // 20 (recomputed)
```

---

## Hooks API

### `useState<T>(initialValue: T)`

React-like state hook built on signals.

**Parameters:**
- `initialValue: T` - Initial state value

**Returns:** `[get: () => T, set: (value: T | ((prev: T) => T)) => void]`

**Example:**
```typescript
const [count, setCount] = useState(0)
const [name, setName] = useState('John')

setCount(count() + 1)
setName(n => n.toUpperCase())
```

---

### `useEffect(fn: () => void | (() => void), deps?: any[])`

React-like effect hook for side effects.

**Parameters:**
- `fn: () => void | (() => void)` - Effect function
- `deps?: any[]` - Dependency array (currently not fully implemented)

**Returns:** `() => void` - Dispose function

**Example:**
```typescript
useEffect(() => {
    console.log('Component mounted')
    
    return () => {
        console.log('Component unmounted')
    }
}, [])
```

---

### `useMemo<T>(computeFn: () => T, deps?: any[])`

React-like memoization hook.

**Parameters:**
- `computeFn: () => T` - Computation function
- `deps?: any[]` - Dependency array (currently not fully implemented)

**Returns:** `() => T` - Getter for memoized value

**Example:**
```typescript
const [a, setA] = useState(5)
const [b, setB] = useState(10)

const sum = useMemo(() => a() + b(), [a, b])
console.log(sum())  // 15
```

---

### `useRef<T>(initialValue: T)`

React-like ref hook for mutable values.

**Parameters:**
- `initialValue: T` - Initial ref value

**Returns:** `{ current: T }` - Mutable ref object

**Example:**
```typescript
const inputRef = useRef<HTMLInputElement | null>(null)

// In JSX:
<input ref={inputRef} />

// Usage:
if (inputRef.current) {
    inputRef.current.focus()
}
```

---

## Event System API

### `ISyntheticEvent<T>`

Normalized cross-browser event interface.

**Properties:**
- `nativeEvent: Event` - Original native event
- `type: string` - Event type
- `target: EventTarget | null` - Event target
- `currentTarget: T` - Current target (typed)
- `timeStamp: number` - Event timestamp
- `bubbles: boolean` - Whether event bubbles
- `cancelable: boolean` - Whether event is cancelable
- `defaultPrevented: boolean` - Whether default was prevented

**Methods:**
- `preventDefault(): void` - Prevent default action
- `stopPropagation(): void` - Stop event bubbling
- `stopImmediatePropagation(): void` - Stop all propagation
- `isPropagationStopped(): boolean` - Check if stopped
- `isDefaultPrevented(): boolean` - Check if prevented

**Example:**
```typescript
<button onClick={(e: ISyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    console.log(e.currentTarget.textContent)
}}>
    Click me
</button>
```

---

### `EventDelegator`

Event management with automatic cleanup.

**Methods:**
- `addEventListener(element, eventType, handler, options?)` - Add listener
- `removeEventListener(element, eventType)` - Remove listener
- `removeAllListeners(element)` - Remove all listeners
- `hasListener(element, eventType)` - Check if listener exists

**Example:**
```typescript
import { EventDelegator } from '@core/events'

const delegator = new EventDelegator()
const button = document.querySelector('button')

const cleanup = delegator.addEventListener(
    button,
    'click',
    (e) => console.log('Clicked!'),
    { capture: false }
)

// Later...
cleanup()  // Remove listener
```

---

## Lifecycle API

### `onMount(callback: () => void | (() => void))`

Register callback to run when component mounts.

**Parameters:**
- `callback: () => void | (() => void)` - Mount callback, optionally returns cleanup

**Example:**
```typescript
onMount(() => {
    console.log('Mounted')
    
    const interval = setInterval(() => {
        console.log('Tick')
    }, 1000)
    
    return () => clearInterval(interval)
})
```

---

### `onCleanup(callback: () => void)`

Register cleanup callback.

**Parameters:**
- `callback: () => void` - Cleanup callback

**Example:**
```typescript
onCleanup(() => {
    console.log('Cleaning up')
})
```

---

### `onUpdate(callback: () => void | (() => void))`

Register callback to run when component updates.

**Parameters:**
- `callback: () => void | (() => void)` - Update callback

**Example:**
```typescript
onUpdate(() => {
    console.log('Component updated')
})
```

---

## TypeScript Types

### `ISignal<T>`

```typescript
interface ISignal<T> {
    read: () => T
    write: (nextValue: T | ((prev: T) => T)) => void
    subscribe: (subscriber: () => void) => () => void
    unsubscribe: (subscriber: () => void) => void
    dispose: () => void
}
```

---

### `IEffect`

```typescript
interface IEffect {
    execute: () => void
    addDependency: (signal: ISignal<any>) => void
    cleanup: () => void
    dispose: () => void
}
```

---

### `IMemo<T>`

```typescript
interface IMemo<T> {
    read: () => T
    invalidate: () => void
    dispose: () => void
}
```

---

### `EventHandler<E>`

```typescript
type EventHandler<E extends ISyntheticEvent = ISyntheticEvent> = 
    (event: E) => void
```

---

## JSX Types (for TSX)

### Props Interface

```typescript
interface MyComponentProps {
    id?: string
    className?: string
    children?: any
    onClick?: EventHandler<ISyntheticEvent<HTMLElement>>
    onInput?: EventHandler<ISyntheticEvent<HTMLInputElement>>
    // ... other props
}
```

### Component Signature

```typescript
type Component<P = {}> = (props: P) => HTMLElement
```

---

## Advanced Patterns

### Custom Hook

```typescript
function useCounter(initialValue = 0) {
    const [count, setCount] = useState(initialValue)
    
    const increment = () => setCount(c => c + 1)
    const decrement = () => setCount(c => c - 1)
    const reset = () => setCount(initialValue)
    
    return { count, increment, decrement, reset }
}

// Usage
const { count, increment, decrement, reset } = useCounter(10)
```

---

### Derived State

```typescript
const [firstName, setFirstName] = useState('John')
const [lastName, setLastName] = useState('Doe')

const fullName = useMemo(() => {
    return `${firstName()} ${lastName()}`
}, [firstName, lastName])
```

---

### Async Effects

```typescript
useEffect(() => {
    let cancelled = false
    
    fetch('/api/data')
        .then(res => res.json())
        .then(data => {
            if (!cancelled) {
                setData(data)
            }
        })
    
    return () => {
        cancelled = true
    }
}, [])
```

---

### Conditional Effects

```typescript
const [isActive, setIsActive] = useState(false)

useEffect(() => {
    if (!isActive()) return
    
    const timer = setInterval(() => {
        console.log('Active')
    }, 1000)
    
    return () => clearInterval(timer)
}, [isActive])
```

---

## Error Handling

### Try-Catch in Effects

```typescript
useEffect(() => {
    try {
        // Risky operation
        riskyFunction()
    } catch (error) {
        console.error('Error in effect:', error)
        setError(error)
    }
}, [])
```

---

### Signal Error Boundaries

```typescript
const [error, setError] = useState<Error | null>(null)

const safeOperation = () => {
    try {
        dangerousOperation()
    } catch (e) {
        setError(e as Error)
    }
}

if (error()) {
    return <ErrorDisplay error={error()} />
}
```

---

## Performance Optimization

### Memoize Expensive Computations

```typescript
const expensive = useMemo(() => {
    return heavyComputation(data())
}, [data])
```

### Batch Updates (Future)

```typescript
// Will be optimized in future versions
batch(() => {
    setName('John')
    setAge(30)
    setEmail('john@example.com')
})
```

### Selective Updates

```typescript
// Only update when specific property changes
const [user, setUser] = useState({ name: '', age: 0 })

const name = useMemo(() => user().name, [user])
const age = useMemo(() => user().age, [user])
```

---

## Testing Utilities

### Testing Signals

```typescript
test('signal updates', () => {
    const [count, setCount] = createSignal(0)
    expect(count()).toBe(0)
    
    setCount(5)
    expect(count()).toBe(5)
})
```

### Testing Effects

```typescript
test('effect runs on change', () => {
    const [count, setCount] = createSignal(0)
    let runs = 0
    
    createEffect(() => {
        count()
        runs++
    })
    
    expect(runs).toBe(1)
    setCount(1)
    expect(runs).toBe(2)
})
```

### Testing Components

```typescript
test('component renders', () => {
    const element = MyComponent({ name: 'Test' })
    expect(element).toBeInstanceOf(HTMLElement)
    expect(element.textContent).toContain('Test')
})
```

---

## Symbol Tokens

For dependency injection:

```typescript
export const SSignal = Symbol.for('ISignal')
export const SEffect = Symbol.for('IEffect')
export const SMemo = Symbol.for('IMemo')
export const SEventDelegator = Symbol.for('IEventDelegator')
export const SLifecycleManager = Symbol.for('ILifecycleManager')
```

---

## Best Practices

1. **Always cleanup effects**
   ```typescript
   useEffect(() => {
       const listener = () => {}
       window.addEventListener('resize', listener)
       return () => window.removeEventListener('resize', listener)
   }, [])
   ```

2. **Use functional updates for dependent state**
   ```typescript
   setCount(c => c + 1)  // ✅ Good
   setCount(count() + 1) // ❌ Can be stale
   ```

3. **Memoize expensive computations**
   ```typescript
   const result = useMemo(() => expensive(data()), [data])
   ```

4. **Use keys for list items**
   ```typescript
   {items().map(item => (
       <div key={item.id}>{item.name}</div>
   ))}
   ```

5. **Type your components**
   ```typescript
   interface IMyProps {
       name: string
       age: number
   }
   
   const MyComponent = ({ name, age }: IMyProps) => { ... }
   ```
