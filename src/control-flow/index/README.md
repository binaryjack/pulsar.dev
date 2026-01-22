# Index Component

Non-keyed list iteration with item-as-signal pattern for Pulsar framework.

## Overview

The `<Index>` component renders lists where items are tracked by their **position** rather than a unique key. Each item is wrapped in a signal, making item updates reactive without recreating DOM nodes.

## When to Use Index vs For

### Use `<Index>` when:

- ✅ Items are identified by **position**, not content
- ✅ You need **reactive item updates** without DOM recreation
- ✅ Working with **primitives** or objects that change in place
- ✅ Array order rarely changes, but item values do

### Use `<For>` when:

- ✅ Items have **unique keys/IDs**
- ✅ Array **reordering** is common
- ✅ Item **identity** matters more than position

## Basic Usage

```tsx
import { Index } from '@pulsar-framework/core'
import { createSignal } from '@pulsar-framework/core'

const [items, setItems] = createSignal([1, 2, 3])

<Index each={items()}>
  {(item, index) => (
    <div>
      {index}: {item()}
    </div>
  )}
</Index>
```

## Key Differences from For

| Feature            | `<Index>`         | `<For>`        |
| ------------------ | ----------------- | -------------- |
| **Item Tracking**  | By position       | By key         |
| **Item Access**    | `item()` (signal) | `item` (value) |
| **Index Type**     | `number`          | `() => number` |
| **DOM Recreation** | Never on updates  | On reorder     |
| **Best For**       | Value changes     | Order changes  |

## API

### Props

```typescript
interface IIndexProps<T> {
  // Array to iterate (static or signal)
  each: T[] | (() => T[]);

  // Render function
  // - item: Signal accessor (() => T)
  // - index: Stable number (not signal)
  children: (item: () => T, index: number) => HTMLElement;

  // Optional fallback when empty
  fallback?: HTMLElement | (() => HTMLElement);
}
```

### Children Function

```tsx
children: (item, index) => {
  // ✅ item is a SIGNAL: item()
  // ✅ index is a NUMBER: index

  return (
    <div>
      {index}: {item()}
    </div>
  );
};
```

## Examples

### 1. Primitive Values

```tsx
const [numbers, setNumbers] = createSignal([1, 2, 3])

<Index each={numbers()}>
  {(num, i) => <div>Position {i}: {num()}</div>}
</Index>

// Update value at position 0
setNumbers([10, 2, 3]) // DOM node reused, text updated
```

### 2. Objects with Reactive Properties

```tsx
interface Todo {
  text: string
  completed: boolean
}

const [todos, setTodos] = createSignal<Todo[]>([
  { text: 'Learn Pulsar', completed: false },
  { text: 'Build app', completed: false }
])

<Index each={todos()}>
  {(todo, index) => (
    <li>
      <input
        type="checkbox"
        checked={todo().completed}
        onchange={(e) => {
          const updated = [...todos()]
          updated[index].completed = e.target.checked
          setTodos(updated)
        }}
      />
      <span>{todo().text}</span>
    </li>
  )}
</Index>
```

### 3. With Fallback

```tsx
<Index each={items()} fallback={<div>No items to display</div>}>
  {(item, index) => <div>{item()}</div>}
</Index>
```

### 4. Programmatic Usage

```typescript
import { Index } from '@pulsar-framework/core';
import { createEffect } from '@pulsar-framework/core';

const indexComponent = Index({
  each: () => mySignal(),
  children: (item, index) => {
    const el = document.createElement('div');

    // Create effect for reactive updates
    createEffect(() => {
      el.textContent = `${index}: ${item().name}`;
    });

    return el;
  },
});

document.body.appendChild(indexComponent);
```

## Behavior Details

### Item-as-Signal Pattern

Each item is wrapped in a signal accessor:

```tsx
<Index each={[1, 2, 3]}>
  {(item, index) => {
    // item is () => number
    console.log(item()); // Access value
    console.log(index); // Stable number: 0, 1, 2

    return <div>{item()}</div>;
  }}
</Index>
```

### Array Length Changes

**Growing:**

```tsx
[1, 2] → [1, 2, 3, 4]
// Keeps items 0-1, creates items 2-3
```

**Shrinking:**

```tsx
[1, 2, 3, 4] → [1, 2]
// Keeps items 0-1, removes items 2-3
```

**Value Updates:**

```tsx
[1, 2, 3] → [10, 20, 30]
// Reuses all DOM nodes, updates signals
```

### Performance Characteristics

- **O(1)** item value updates (signal-based)
- **O(n)** array length changes (create/remove nodes)
- **No reconciliation** overhead (position-based)
- **Minimal memory** (no key tracking)

## Migration from For

```tsx
// Before: For with keys
<For each={items()} key={(item) => item.id}>
  {(item, index) => (
    <div>{item.name} at {index()}</div>
  )}
</For>

// After: Index without keys
<Index each={items()}>
  {(item, index) => (
    <div>{item().name} at {index}</div>
  )}
</Index>
```

**Key changes:**

1. `item` → `item()` (signal accessor)
2. `index()` → `index` (number)
3. Remove `key` prop

## Common Patterns

### 1. Counters List

```tsx
const [counters, setCounters] = createSignal([0, 0, 0])

<Index each={counters()}>
  {(count, index) => (
    <div>
      Counter {index}: {count()}
      <button onclick={() => {
        const updated = [...counters()]
        updated[index]++
        setCounters(updated)
      }}>
        Increment
      </button>
    </div>
  )}
</Index>
```

### 2. Form Fields

```tsx
const [fields, setFields] = createSignal(['', '', ''])

<Index each={fields()}>
  {(value, index) => (
    <input
      value={value()}
      oninput={(e) => {
        const updated = [...fields()]
        updated[index] = e.target.value
        setFields(updated)
      }}
    />
  )}
</Index>
```

### 3. Real-time Data Updates

```tsx
// WebSocket updates by position
const [sensors, setSensors] = createSignal([
  { temp: 20, humidity: 45 },
  { temp: 22, humidity: 50 }
])

// Update sensor 0 without recreating DOM
socket.on('sensor-0-update', (data) => {
  const updated = [...sensors()]
  updated[0] = data
  setSensors(updated)
})

<Index each={sensors()}>
  {(sensor, index) => (
    <div>
      Sensor {index}:
      Temp: {sensor().temp}°C,
      Humidity: {sensor().humidity}%
    </div>
  )}
</Index>
```

## Testing

```typescript
import { Index } from '@pulsar-framework/core';
import { createSignal } from '@pulsar-framework/core';

describe('Index Component', () => {
  it('wraps items in signals', () => {
    const [items, setItems] = createSignal([1, 2]);

    const component = Index({
      each: items,
      children: (item, index) => {
        const el = document.createElement('div');
        el.textContent = item().toString();
        return el;
      },
    });

    document.body.appendChild(component);
    expect(document.body.children[0].textContent).toBe('1');

    // Update value
    setItems([10, 2]);

    // Same DOM node, updated content
    setTimeout(() => {
      expect(document.body.children[0].textContent).toBe('10');
    }, 0);
  });
});
```

## Implementation Notes

### Architecture

- One file per concept (index-component.ts, index.types.ts)
- Prototype-based functions (no class keyword)
- Feature slice structure: `control-flow/index/`
- All types in separate `.types.ts` file

### Reactivity

- Uses `createEffect` for array tracking
- Uses `createSignal` for item wrapping
- Automatic cleanup on item removal

### DOM Management

- Container uses `display: contents` (no wrapper)
- Efficient node reuse for updates
- Proper cleanup of removed items

## See Also

- [For Component](../for.ts) - Keyed list iteration
- [Show Component](../show.ts) - Conditional rendering
- [Reactivity](../../reactivity/README.md) - Signal system
- [v0.7.0 Implementation Plan](../../docs/implementation-plans/v0.7.0-core-completeness.md)
