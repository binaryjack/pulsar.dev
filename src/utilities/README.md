# produce() - Immer-style Immutable Updates

Create immutable copies of objects with a mutable API. Uses Proxy to track changes and only copies what you modify.

## Features

✅ **Mutable API** - Write normal mutations, get immutable results  
✅ **Structural Sharing** - Only modified branches are copied  
✅ **Nested Updates** - Works with deeply nested objects and arrays  
✅ **Type-Safe** - Full TypeScript support  
✅ **Zero Dependencies** - Pure JavaScript implementation  
✅ **Small** - ~200 lines of code  
✅ **29+ Tests** - Comprehensive test coverage

## Installation

```bash
npm install @pulsar-framework/pulsar.dev
```

## Basic Usage

```typescript
import { produce } from '@pulsar-framework/pulsar.dev';

const state = { count: 0, user: { name: 'John' } };

const next = produce(state, (draft) => {
  draft.count = 1;
  draft.user.name = 'Jane';
});

console.log(state.count); // 0 (unchanged)
console.log(next.count); // 1 (new state)
```

## API Reference

### produce(base, recipe)

Create a new immutable state by applying mutations to a draft.

```typescript
function produce<T>(base: T, recipe: (draft: T) => void | T): T;
```

**Parameters:**

- `base` - The base state to modify
- `recipe` - Function that receives a draft and mutates it

**Returns:**

- New immutable state with modifications applied

**Example:**

```typescript
const state = { count: 0 };
const next = produce(state, (draft) => {
  draft.count++;
});
```

## Usage Examples

### Object Updates

```typescript
const user = { name: 'John', age: 30, email: 'john@example.com' };

const updated = produce(user, (draft) => {
  draft.age = 31;
  draft.email = 'newemail@example.com';
});

// user.age === 30 (unchanged)
// updated.age === 31 (new object)
```

### Nested Objects

```typescript
const state = {
  user: {
    profile: {
      name: 'John',
      settings: {
        theme: 'light',
      },
    },
  },
};

const next = produce(state, (draft) => {
  draft.user.profile.name = 'Jane';
  draft.user.profile.settings.theme = 'dark';
});

// Only modified path is new, rest is shared
next.user !== state.user; // true (modified)
next.user.profile !== state.user.profile; // true (modified)
```

### Array Operations

```typescript
const todos = [
  { id: 1, text: 'Learn', done: false },
  { id: 2, text: 'Build', done: false },
];

const next = produce(todos, (draft) => {
  draft[0].done = true; // Mark first todo done
  draft.push({ id: 3, text: 'Ship', done: false }); // Add new todo
});

// todos.length === 2 (unchanged)
// next.length === 3 (new array)
// next[0].done === true
```

### Redux Reducers

```typescript
const reducer = (state, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'INCREMENT':
        draft.count++;
        break;
      case 'ADD_TODO':
        draft.todos.push(action.payload);
        break;
      case 'TOGGLE_TODO':
        const todo = draft.todos.find((t) => t.id === action.id);
        if (todo) {
          todo.done = !todo.done;
        }
        break;
    }
  });
};
```

### Returning New State

You can return a value from the recipe to completely replace the state:

```typescript
const state = { count: 0 };

const next = produce(state, (draft) => {
  return { count: 100 }; // Replaces entire state
});

// draft mutations are ignored when returning
```

### Conditional Updates

```typescript
const state = { users: [], isLoading: false, error: null };

const next = produce(state, (draft) => {
  if (action.type === 'FETCH_START') {
    draft.isLoading = true;
    draft.error = null;
  } else if (action.type === 'FETCH_SUCCESS') {
    draft.isLoading = false;
    draft.users = action.payload;
  } else if (action.type === 'FETCH_ERROR') {
    draft.isLoading = false;
    draft.error = action.error;
  }
});
```

## Advanced Examples

### Deeply Nested Arrays

```typescript
const state = {
  matrix: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ],
};

const next = produce(state, (draft) => {
  draft.matrix[1][1] = 50; // Change center element
  draft.matrix.push([10, 11, 12]); // Add new row
});

// state.matrix[1][1] === 5 (unchanged)
// next.matrix[1][1] === 50 (new matrix)
```

### Complex State Updates

```typescript
const state = {
  user: { name: 'John', age: 30 },
  posts: [{ id: 1, title: 'Hello' }],
  meta: { version: 1, lastUpdate: Date.now() },
};

const next = produce(state, (draft) => {
  // Update user
  draft.user.age = 31;

  // Add post
  draft.posts.push({ id: 2, title: 'World' });

  // Update post title
  draft.posts[0].title = 'Hi';

  // Update metadata
  draft.meta.version = 2;
  draft.meta.lastUpdate = Date.now();
});
```

### Delete Properties

```typescript
const user = { name: 'John', age: 30, temp: 'delete me' };

const next = produce(user, (draft) => {
  delete draft.temp;
});

// user.temp === 'delete me' (unchanged)
// next.temp === undefined (deleted)
```

## Performance

### Structural Sharing

Only modified branches are copied. Unmodified parts of the tree share references with the original:

```typescript
const state = {
  a: { value: 1 },
  b: { value: 2 },
  c: { value: 3 },
};

const next = produce(state, (draft) => {
  draft.a.value = 10; // Only 'a' is modified
});

next.a !== state.a; // true (new object)
next.b === state.b; // true (same reference - structural sharing)
next.c === state.c; // true (same reference - structural sharing)
```

### No Changes = Same Reference

If you don't make any changes, the original object is returned:

```typescript
const state = { count: 0 };

const next = produce(state, (draft) => {
  // No changes
});

next === state; // true (same reference)
```

### Setting Same Value

Setting a property to its current value doesn't mark it as modified:

```typescript
const state = { count: 5 };

const next = produce(state, (draft) => {
  draft.count = 5; // Same value
});

next === state; // true (not modified)
```

## TypeScript Support

Full type safety with generic types:

```typescript
interface User {
  name: string;
  age: number;
  profile: {
    bio: string;
    avatar: string;
  };
}

const user: User = {
  name: 'John',
  age: 30,
  profile: {
    bio: 'Developer',
    avatar: 'avatar.jpg',
  },
};

const updated = produce(user, (draft) => {
  draft.age = 31; // TypeScript knows this is a number
  draft.profile.bio = 'Senior Developer';
  // draft.invalid = true  // TypeScript error!
});
```

## Comparison to Immer

| Feature            | produce()                   | Immer                                |
| ------------------ | --------------------------- | ------------------------------------ |
| Bundle Size        | ~200 lines                  | ~16KB                                |
| Dependencies       | Zero                        | Multiple                             |
| Performance        | Optimized for small updates | Optimized for large trees            |
| API                | Simple `produce()`          | Multiple APIs (produce, Draft, etc.) |
| TypeScript         | Full support                | Full support                         |
| Structural Sharing | ✅                          | ✅                                   |
| Nested Updates     | ✅                          | ✅                                   |
| Array Methods      | ✅                          | ✅                                   |
| Patches            | ❌                          | ✅                                   |
| Auto-freeze        | ❌                          | ✅ (optional)                        |

**When to use `produce()`:**

- Small to medium state trees
- You want zero dependencies
- You need minimal bundle size
- You don't need patches or auto-freeze

**When to use Immer:**

- Very large state trees
- You need patches for undo/redo
- You want auto-freeze in development
- You need ecosystem tools (Redux Toolkit, etc.)

## Edge Cases

### Primitives

```typescript
const num = 42;
const next = produce(num, (draft) => {
  return 100;
});

next === 42; // Primitives are returned as-is
```

### null / undefined

```typescript
const state = null;
const next = produce(state, (draft) => {
  return { value: 1 };
});

next === null; // null returned as-is
```

### Array Methods

All mutating array methods work:

```typescript
const arr = [1, 2, 3];

const next = produce(arr, (draft) => {
  draft.push(4); // [1, 2, 3, 4]
  draft.pop(); // [1, 2, 3]
  draft.shift(); // [2, 3]
  draft.unshift(0); // [0, 2, 3]
  draft.splice(1, 1); // [0, 3]
  draft.sort(); // [0, 3]
  draft.reverse(); // [3, 0]
});
```

## Testing

29 comprehensive tests covering:

- ✅ Basic object updates
- ✅ Nested objects (deep nesting)
- ✅ Array operations (push, pop, splice, etc.)
- ✅ Array of objects
- ✅ Structural sharing
- ✅ Edge cases (null, undefined, primitives)
- ✅ Return values from recipe
- ✅ Complex scenarios (Redux-style, mixed updates)
- ✅ Performance optimizations

## License

MIT
