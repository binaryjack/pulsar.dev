# pulsar API Reference

## Reactivity

### `batch(fn: () => void): void`

Execute a function with batched updates. All signal writes during execution are queued and effects run once after completion.

```typescript
import { batch } from 'pulsar-ui'

batch(() => {
  setCount(1)
  setName('Bob')
  setAge(30)
})
// Effects run once, not three times
```

**Nested Batches:**
```typescript
batch(() => {
  setCount(1)
  batch(() => {
    setName('Bob')
  })
  setAge(30)
})
// Still only runs effects once at the end
```

---

### `isBatching(): boolean`

Check if currently in a batch context.

```typescript
if (isBatching()) {
  console.log('Updates are being batched')
}
```

---

## Control Flow

### `Show<T>(props: IShowProps): HTMLElement`

Conditional rendering component.

**Props:**
- `when: boolean | (() => boolean)` - Condition to check
- `fallback?: HTMLElement | (() => HTMLElement)` - Content when false
- `children: HTMLElement | (() => HTMLElement)` - Content when true

**Examples:**

Basic usage:
```tsx
<Show when={isLoggedIn()}>
  <Dashboard />
</Show>
```

With fallback:
```tsx
<Show 
  when={isLoggedIn()} 
  fallback={<Login />}
>
  <Dashboard />
</Show>
```

Function children:
```tsx
<Show when={() => count() > 5}>
  {() => <HighCount count={count()} />}
</Show>
```

---

### `For<T>(props: IForProps<T>): HTMLElement`

List rendering component with optional key-based reconciliation.

**Props:**
- `each: T[] | (() => T[])` - Array to iterate
- `key?: (item: T, index: number) => string | number` - Key function
- `children: (item: T, index: () => number) => HTMLElement` - Render function
- `fallback?: HTMLElement | (() => HTMLElement)` - Empty state

**Examples:**

Simple list:
```tsx
<For each={items()}>
  {(item, index) => <div>{index()}: {item}</div>}
</For>
```

With keys (efficient updates):
```tsx
<For 
  each={todos()} 
  key={(todo) => todo.id}
>
  {(todo) => <TodoItem todo={todo} />}
</For>
```

With fallback:
```tsx
<For 
  each={items()} 
  fallback={<EmptyState />}
>
  {(item) => <ItemCard item={item} />}
</For>
```

**Performance:**
- Without `key`: Recreates all items on change (simple, works for small lists)
- With `key`: Reuses DOM nodes (efficient for large lists and reordering)

---

## Portal

### `Portal(props: IPortalProps): HTMLElement`

Render content outside parent DOM hierarchy.

**Props:**
- `mount?: string | HTMLElement` - Target container (default: document.body)
- `children: HTMLElement | (() => HTMLElement)` - Content to portal

**Examples:**

Mount to body:
```tsx
<Portal>
  <Modal />
</Portal>
```

Mount to specific container:
```tsx
<Portal mount="#modal-root">
  <Modal />
</Portal>
```

Imperative:
```typescript
const modal = Portal({
  mount: document.getElementById('modal-root'),
  children: () => {
    const div = document.createElement('div')
    div.className = 'modal'
    return div
  }
})
```

---

### `cleanupPortals(): void`

Cleanup all active portals. Call when app unmounts.

```typescript
import { cleanupPortals } from 'pulsar-ui'

// On app unmount
cleanupPortals()
```

---

## Dev Utilities

### `warn(warning: IDevWarning | string): void`

Display development warning (stripped in production).

**Examples:**

Simple:
```typescript
warn('This is deprecated')
```

With context:
```typescript
warn({
  message: 'Missing key prop',
  component: 'For',
  hint: 'Add a key function for better performance'
})
```

Output:
```
[pulsar] [For] Missing key prop
  Hint: Add a key function for better performance
```

---

### `invariant(condition, message, component?, hint?): asserts condition`

Runtime assertion (only in development).

```typescript
invariant(
  value !== undefined,
  'Value is required',
  'MyComponent',
  'Check your props'
)
```

Throws:
```
[pulsar] [MyComponent] Value is required
  Hint: Check your props
```

---

### `DEV: boolean`

Tree-shakeable development flag.

```typescript
if (DEV) {
  console.log('Development mode')
  traceComponentMount('MyComponent')
}
// Entire block removed in production
```

---

## Component Lifecycle Tracing

### `traceComponentMount(name: string): void`

Start tracking a component (dev only).

```typescript
traceComponentMount('TodoApp')
// [pulsar Trace] Mounted: TodoApp
```

---

### `traceComponentUpdate(name: string): void`

Track component update.

```typescript
traceComponentUpdate('TodoApp')
// [pulsar Trace] Updated: TodoApp (3 updates)
```

---

### `traceComponentUnmount(name: string): void`

Stop tracking and report stats.

```typescript
traceComponentUnmount('TodoApp')
// [pulsar Trace] Unmounted: TodoApp
//   Lifetime: 5432.50ms
//   Updates: 15
```

---

### `checkExcessiveUpdates(name: string, threshold?: number): void`

Warn about too many updates (default threshold: 100).

```typescript
checkExcessiveUpdates('MyComponent', 50)
// Warns if component updated more than 50 times
```

---

## Hooks

### `useState<T>(initialValue: T): [() => T, (value: T | (prev: T) => T) => void]`

State hook with signal-based reactivity.

```typescript
const [count, setCount] = useState(0)

// Reading (subscribes to changes)
const value = count()

// Writing
setCount(5)
setCount(c => c + 1)
```

**Important:** Must call `count()` to read value (not just `count`).

---

### `useEffect(fn: () => void | (() => void), deps?: unknown[]): void`

Effect hook that runs when dependencies change.

```typescript
useEffect(() => {
  console.log(`Count: ${count()}`)
  
  // Cleanup function (optional)
  return () => {
    console.log('Cleanup')
  }
}, [count])
```

**Without deps:** Runs on every change to any signal read inside.

---

### `useMemo<T>(fn: () => T, deps?: unknown[]): () => T`

Memoized computation.

```typescript
const expensiveValue = useMemo(() => {
  return complexCalculation(count())
}, [count])

// Use it
const result = expensiveValue()
```

---

### `useRef<T>(initialValue?: T): { current: T }`

Mutable ref object.

```typescript
const inputRef = useRef<HTMLInputElement>()

useEffect(() => {
  inputRef.current?.focus()
}, [])

return <input ref={inputRef} />
```

---

## Context

### `createContext<T>(defaultValue: T): IContext<T>`

Create a context.

```typescript
const ThemeContext = createContext<'light' | 'dark'>('light')
```

---

### `ThemeContext.Provider`

Provide context value.

```tsx
<ThemeContext.Provider value={theme()}>
  <App />
</ThemeContext.Provider>
```

---

### `useContext<T>(context: IContext<T>): T`

Consume context value.

```typescript
const theme = useContext(ThemeContext)
```

---

## Bootstrap

### `bootstrapApp(config: IBootstrapConfig): IApplicationRoot`

Bootstrap an pulsar app.

```typescript
import { bootstrapApp } from 'pulsar-ui'

const app = bootstrapApp({
  root: '#app',
  component: App,
  props: { message: 'Hello' }
})

app.mount()

// Later
app.unmount()
```

---

## Type Definitions

### `IShowProps`

```typescript
interface IShowProps {
  when: boolean | (() => boolean)
  fallback?: HTMLElement | (() => HTMLElement)
  children: HTMLElement | (() => HTMLElement)
}
```

---

### `IForProps<T>`

```typescript
interface IForProps<T> {
  each: T[] | (() => T[])
  key?: (item: T, index: number) => string | number
  children: (item: T, index: () => number) => HTMLElement
  fallback?: HTMLElement | (() => HTMLElement)
}
```

---

### `IPortalProps`

```typescript
interface IPortalProps {
  children: HTMLElement | (() => HTMLElement)
  mount?: string | HTMLElement
}
```

---

### `IDevWarning`

```typescript
interface IDevWarning {
  message: string
  component?: string
  hint?: string
}
```

---

### `BatchFn`

```typescript
type BatchFn = () => void
```

---

## Performance Tips

### Use batch() for Multiple Updates

```typescript
// ❌ Bad: 3 effect runs
setCount(1)
setName('Bob')
setAge(30)

// ✅ Good: 1 effect run
batch(() => {
  setCount(1)
  setName('Bob')
  setAge(30)
})
```

---

### Use Keys in For Component

```typescript
// ❌ Without key: recreates all on change
<For each={items()}>
  {item => <Item data={item} />}
</For>

// ✅ With key: reuses DOM nodes
<For each={items()} key={item => item.id}>
  {item => <Item data={item} />}
</For>
```

---

### Split Coarse State into Fine Signals

```typescript
// ❌ Coarse: updates even when only name changes
const [user, setUser] = useState({ name: 'Bob', age: 30 })
<div>{user().age}</div> // Re-renders when name changes too

// ✅ Fine: only updates when age changes
const [name, setName] = useState('Bob')
const [age, setAge] = useState(30)
<div>{age()}</div> // Only updates when age changes
```

---

### Use Memo for Expensive Computations

```typescript
// ❌ Runs on every render
const filtered = items().filter(item => item.active)

// ✅ Only recomputes when items change
const filtered = useMemo(() => {
  return items().filter(item => item.active)
}, [items])
```

---

## Common Patterns

### Modal with Portal

```tsx
const Modal = ({ isOpen, onClose, children }) => {
  return (
    <Show when={isOpen()}>
      <Portal mount="#modal-root">
        <div class="modal-overlay" onClick={onClose}>
          <div class="modal-content" onClick={e => e.stopPropagation()}>
            {children}
          </div>
        </div>
      </Portal>
    </Show>
  )
}
```

---

### Conditional List

```tsx
const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  
  return (
    <Show 
      when={() => todos().length > 0}
      fallback={<EmptyState />}
    >
      <For each={todos} key={todo => todo.id}>
        {(todo) => <TodoItem todo={todo} />}
      </For>
    </Show>
  )
}
```

---

### Optimistic Updates with Batch

```tsx
const saveUser = async (user: User) => {
  // Optimistic update
  batch(() => {
    setUser(user)
    setStatus('saving')
  })
  
  try {
    await api.saveUser(user)
    setStatus('saved')
  } catch (error) {
    batch(() => {
      setUser(previousUser)
      setStatus('error')
      setError(error.message)
    })
  }
}
```

---

## Migration from React

### State

```typescript
// React
const [count, setCount] = useState(0)
const value = count // value directly

// pulsar
const [count, setCount] = useState(0)
const value = count() // call to get value
```

---

### Effects

```typescript
// React
useEffect(() => {
  console.log(count)
}, [count])

// pulsar  
useEffect(() => {
  console.log(count()) // must call count()
}, [count])
```

---

### Conditional Rendering

```tsx
// React
{isVisible && <Component />}

// pulsar
<Show when={isVisible()}>
  <Component />
</Show>
```

---

### Lists

```tsx
// React
{items.map(item => <Item key={item.id} data={item} />)}

// pulsar
<For each={items()} key={item => item.id}>
  {item => <Item data={item} />}
</For>
```

---

### Portals

```tsx
// React
createPortal(<Modal />, document.body)

// pulsar
<Portal mount={document.body}>
  <Modal />
</Portal>
```

---

## Best Practices

1. **Always call signals as functions:** `count()` not `count`
2. **Use batch() for multiple updates:** Prevents excessive re-renders
3. **Provide keys in For components:** For better performance
4. **Split coarse state:** One signal per reactive value
5. **Use Show/For over imperative:** More declarative and reactive
6. **Cleanup portals on unmount:** Call `cleanupPortals()`
7. **Use dev utilities:** Leverage warnings and invariants during development
8. **Check DEV flag:** Wrap dev-only code in `if (DEV)`

---

## Complete Example

```tsx
import { 
  useState, 
  useEffect, 
  batch, 
  Show, 
  For, 
  Portal 
} from 'pulsar-ui'

interface Todo {
  id: number
  text: string
  completed: boolean
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [showModal, setShowModal] = useState(false)
  
  const filteredTodos = useMemo(() => {
    const list = todos()
    if (filter() === 'all') return list
    if (filter() === 'active') return list.filter(t => !t.completed)
    return list.filter(t => t.completed)
  }, [todos, filter])
  
  const toggleTodo = (id: number) => {
    setTodos(todos().map(todo =>
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ))
  }
  
  const addTodo = (text: string) => {
    batch(() => {
      setTodos([...todos(), {
        id: Date.now(),
        text,
        completed: false
      }])
      setShowModal(false)
    })
  }
  
  return (
    <div class="todo-app">
      <header>
        <h1>Todos</h1>
        <button onClick={() => setShowModal(true)}>
          Add Todo
        </button>
      </header>
      
      <div class="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      
      <Show 
        when={() => filteredTodos().length > 0}
        fallback={<p>No todos yet!</p>}
      >
        <For each={filteredTodos} key={todo => todo.id}>
          {(todo) => (
            <div 
              class={todo.completed ? 'completed' : ''}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </div>
          )}
        </For>
      </Show>
      
      <Show when={showModal}>
        <Portal mount="#modal-root">
          <AddTodoModal 
            onAdd={addTodo}
            onClose={() => setShowModal(false)}
          />
        </Portal>
      </Show>
    </div>
  )
}
```
