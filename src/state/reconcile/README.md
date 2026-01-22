# reconcile() - Efficient Immutable State Updates

The `reconcile()` utility provides efficient immutable state updates by minimizing object creation through deep comparison and reference reuse.

## Overview

When updating complex state, creating entirely new objects for unchanged values wastes memory and causes unnecessary re-renders. `reconcile()` solves this by:

1. **Deep comparing** old and new values
2. **Reusing unchanged** object/array references
3. **Creating new objects** only where values actually changed

This preserves referential equality for unchanged parts of the state tree, minimizing re-renders.

## Basic Usage

### With useState/createSignal

```typescript
import { useState } from 'pulsar';
import { reconcile } from 'pulsar/state';

const [state, setState] = useState({
  count: 0,
  user: { name: 'Alice', age: 30 },
  items: [1, 2, 3],
});

// Update with reconcile
setState(
  reconcile({
    count: 1, // Changed
    user: { name: 'Alice', age: 30 }, // Unchanged - will reuse reference
    items: [1, 2, 3], // Unchanged - will reuse reference
  })
);

// Result: Only count changes, user and items reuse previous references
```

### With Store

```typescript
import { createStore } from 'pulsar/state';
import { reconcile } from 'pulsar/state';

const store = createStore(
  {
    users: [],
    settings: { theme: 'dark', lang: 'en' },
  },
  (state, action) => {
    switch (action.type) {
      case 'SET_USERS':
        return {
          ...state,
          users: reconcile(action.payload)(state.users),
        };
      default:
        return state;
    }
  }
);
```

## API Reference

### reconcile(newValue, options?)

Creates a reconciliation function that compares new value with previous value.

**Parameters:**

- `newValue: T` - The new value to reconcile
- `options?: IReconcileOptions` - Optional configuration

**Returns:** `(prevValue: T) => T` - Function that takes previous value and returns reconciled value

**Options:**

```typescript
interface IReconcileOptions {
  /**
   * Key function for array reconciliation
   * Determines how to match items between old and new arrays
   * @default (item, index) => index
   */
  key?: string | ((item: any, index: number) => any);

  /**
   * Whether to merge objects (true) or replace them (false)
   * @default true
   */
  merge?: boolean;
}
```

### reconcileWith(newValue, key)

Convenience function for reconciling arrays with custom keys.

**Parameters:**

- `newValue: T[]` - The new array value
- `key: string | ((item: any, index: number) => any)` - Key property name or function

**Returns:** `(prevValue: T[]) => T[]`

## Examples

### Object Reconciliation

```typescript
const prev = {
  id: 1,
  name: 'Alice',
  profile: {
    email: 'alice@example.com',
    age: 30,
  },
};

const next = {
  id: 1,
  name: 'Alice Updated',
  profile: {
    email: 'alice@example.com',
    age: 30,
  },
};

const reconciled = reconcile(next)(prev);

// Result:
// - id: same reference
// - name: new value
// - profile: SAME REFERENCE (no changes detected)
//   - email: same reference
//   - age: same reference
```

### Array Reconciliation with Index

```typescript
const prev = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

const next = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob Updated' },
];

const reconciled = reconcile(next)(prev);

// Uses index-based matching by default
// prev[0] matches next[0] - Alice unchanged, reuses reference
// prev[1] matches next[1] - Bob changed, creates new object
```

### Array Reconciliation with Key

```typescript
const prev = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

const next = [
  { id: 2, name: 'Bob' }, // Moved to front
  { id: 1, name: 'Alice' },
  { id: 3, name: 'Charlie' }, // New item
];

// Using string key
const reconciled = reconcile(next, { key: 'id' })(prev);

// Using reconcileWith shorthand
const reconciled2 = reconcileWith(next, 'id')(prev);

// Result: Items matched by ID, not index
// - Bob (id: 2) reuses reference from prev
// - Alice (id: 1) reuses reference from prev
// - Charlie (id: 3) is new
```

### Custom Key Function

```typescript
const prev = [
  { uid: 'a', value: 1 },
  { uid: 'b', value: 2 },
];

const next = [
  { uid: 'b', value: 3 },
  { uid: 'a', value: 1 },
];

const reconciled = reconcile(next, {
  key: (item) => item.uid,
})(prev);

// Or using reconcileWith
const reconciled2 = reconcileWith(next, (item) => item.uid)(prev);

// Result: Items matched by uid
```

### Replace Mode (No Merge)

```typescript
const prev = { a: 1, b: 2, c: 3 };
const next = { a: 1, d: 4 };

// With merge (default)
const merged = reconcile(next)(prev);
// Result: { a: 1, d: 4 } - b and c removed, 'a' reused

// Without merge (replace mode)
const replaced = reconcile(next, { merge: false })(prev);
// Result: Returns 'next' directly (no reconciliation)
```

### Nested Structures

```typescript
const prev = {
  users: [
    { id: 1, name: 'Alice', meta: { active: true } },
    { id: 2, name: 'Bob', meta: { active: false } },
  ],
  settings: {
    theme: 'dark',
    notifications: { email: true, push: false },
  },
};

const next = {
  users: [
    { id: 1, name: 'Alice', meta: { active: true } },
    { id: 2, name: 'Bob', meta: { active: true } }, // Only meta.active changed
  ],
  settings: {
    theme: 'dark',
    notifications: { email: true, push: false },
  },
};

const reconciled = reconcile(next, { key: 'id' })(prev);

// Result:
// - users[0]: completely reused (no changes)
// - users[1]: new object, but name reused, meta is new object
// - settings: completely reused (no changes)
```

## Performance Tips

### 1. Use Keys for Arrays

Always use keys when reconciling arrays of objects:

```typescript
// ❌ Slow - index-based matching
setState('users', reconcile(newUsers));

// ✅ Fast - key-based matching
setState('users', reconcile(newUsers, { key: 'id' }));
```

### 2. Avoid Unnecessary Calls

Only use `reconcile()` for complex nested structures:

```typescript
// ❌ Overkill for primitives
setState('count', reconcile(42));

// ✅ Just set the value
setState('count', 42);

// ✅ Good for nested structures
setState('data', reconcile(newData, { key: 'id' }));
```

### 3. Reuse New Objects

If you're creating the new value from scratch, consider reusing parts:

```typescript
// ❌ Creates new objects unnecessarily
const newState = {
  users: fetchedUsers.map((u) => ({ ...u })),
  settings: { ...state.settings },
};
setState(reconcile(newState));

// ✅ Let reconcile handle it
setState(reconcile({ users: fetchedUsers, settings: state.settings }));
```

## Complexity

- **Objects:** O(n) where n = number of keys
- **Arrays (index-based):** O(n) where n = array length
- **Arrays (key-based):** O(n) where n = array length
- **Nested structures:** O(n \* depth)

## Comparison with Other Approaches

### Manual Updates

```typescript
// Manual approach
const newUsers = state.users.map((user) =>
  user.id === userId ? { ...user, name: newName } : user
);
setState({ ...state, users: newUsers });

// With reconcile (equivalent but cleaner)
setState(
  reconcile({
    ...state,
    users: state.users.map((user) => (user.id === userId ? { ...user, name: newName } : user)),
  })
);
```

### Immer/produce()

```typescript
// Immer-style (requires produce utility)
setState(
  produce((draft) => {
    draft.users.find((u) => u.id === userId).name = newName;
  })
);

// With reconcile (immutable approach)
const updatedUsers = state.users.map((user) =>
  user.id === userId ? { ...user, name: newName } : user
);
setState(reconcile({ ...state, users: updatedUsers }, { key: 'id' }));
```

## TypeScript

Full type safety with generic inference:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const [users, setUsers] = useState<User[]>([]);

// Type-safe reconciliation
setUsers(
  reconcile(
    [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
    ],
    { key: 'id' }
  )
);

// Type error: missing required property
setUsers(
  reconcile([{ id: 1, name: 'Alice' }], { key: 'id' })
  // ❌ Error: Property 'email' is missing
);
```

## Best Practices

1. **Always use keys for arrays of objects** - Dramatically improves performance
2. **Let reconcile handle deep comparisons** - Don't manually check for changes
3. **Use with Store for complex state** - Perfect for Redux-style reducers
4. **Combine with selectors** - Maximize referential equality benefits
5. **Don't overuse** - Simple primitives don't need reconciliation

## See Also

- [produce()](../produce/README.md) - Mutable-style updates
- [createStore()](../store/README.md) - Redux-style state management
- [createSignal()](../../reactivity/signal/README.md) - Reactive primitives
