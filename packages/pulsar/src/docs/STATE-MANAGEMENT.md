# State Management in Pulsar

Pulsar provides a powerful state management solution built on top of its fine-grained reactivity system. The state management APIs offer Redux-style patterns with automatic reactivity, middleware support, and advanced features like time-travel debugging and persistence.

## Table of Contents

- [Store Pattern](#store-pattern)
- [Undo/Redo](#undoredo)
- [State Persistence](#state-persistence)
- [Middleware](#middleware)
- [DevTools Integration](#devtools-integration)
- [Best Practices](#best-practices)

---

## Store Pattern

### Basic Store

The `createStore` function creates a Redux-style store with automatic reactivity:

```typescript
import { createStore } from 'pulsar';

// Define state shape
interface CounterState {
  count: number;
  user: string;
}

// Define action types
type CounterAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_USER'; payload: string };

// Create reducer
const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

// Create store
const store = createStore({ count: 0, user: 'Anonymous' }, counterReducer);

// Access state (reactive)
console.log(store.getState().count); // 0

// Dispatch actions
store.dispatch({ type: 'INCREMENT' });
console.log(store.getState().count); // 1

// Subscribe to changes
const unsubscribe = store.subscribe((state) => {
  console.log('State changed:', state);
});

// Cleanup
unsubscribe();
```

### Memoized Selectors

Use `select()` for efficient derived state:

```typescript
// Create memoized selector
const doubleCount = store.select(
    state => state.count * 2
)

// Use in components
function Counter() {
    const double = doubleCount() // Automatically updates
    return <div>Double: {double}</div>
}

// Selector with multiple dependencies
const userGreeting = store.select(
    state => `Hello, ${state.user}! Count: ${state.count}`
)
```

---

## Undo/Redo

### Basic Time-Travel

Add undo/redo capabilities to any store:

```typescript
import { createStore, createUndoMiddleware, UndoRedoActions } from 'pulsar';

const store = createStore(initialState, reducer, createUndoMiddleware({ maxHistory: 50 }));

// Undo last action
store.dispatch(UndoRedoActions.undo());

// Redo
store.dispatch(UndoRedoActions.redo());

// Jump to specific history point
store.dispatch(UndoRedoActions.jump(5));

// Check if undo/redo available
const state = store.getState();
console.log('Can undo:', state.past.length > 0);
console.log('Can redo:', state.future.length > 0);
```

### Undoable Reducers

Wrap specific reducers for fine-grained control:

```typescript
import { undoable } from 'pulsar';

// Only these actions can be undone
const undoableReducer = undoable(myReducer, {
  limit: 100,
  filter: (action) => {
    // Exclude certain actions from history
    return action.type !== 'TYPING';
  },
  groupBy: (action) => {
    // Group rapid actions together
    return action.type === 'MOUSE_MOVE' ? 'movement' : null;
  },
  debounce: 300, // Group actions within 300ms
});
```

### History Queries

```typescript
import { canUndo, canRedo, getHistoryMetadata } from 'pulsar';

// Check history state
if (canUndo(store.getState())) {
  store.dispatch(UndoRedoActions.undo());
}

// Get history metadata
const metadata = getHistoryMetadata(store.getState());
console.log('History size:', metadata.pastSize + metadata.futureSize);
console.log('Current position:', metadata.pastSize);
```

---

## State Persistence

### localStorage Persistence

Automatically save and restore state:

```typescript
import { createPersistentStore } from 'pulsar';

const store = createPersistentStore(
  {
    initialState: { count: 0 },
    name: 'my-app',
    persist: {
      key: 'app-state',
      storage: localStorage,
      whitelist: ['count'], // Only persist these keys
      version: 1,
    },
  },
  reducer
);

// State automatically restored on page load
// Automatically saved after each action
```

### sessionStorage

Use session storage for temporary persistence:

```typescript
import { createSessionStore } from 'pulsar';

const store = createSessionStore(
  {
    initialState: { form: {} },
    name: 'form-data',
    persist: {
      key: 'form-state',
    },
  },
  reducer
);
```

### Advanced Persistence Options

```typescript
const store = createPersistentStore(
  {
    initialState,
    name: 'advanced-app',
    persist: {
      key: 'app-state',
      storage: localStorage,

      // Selective persistence
      whitelist: ['user', 'settings'],
      blacklist: ['temp', 'cache'],

      // Custom serialization
      serialize: (state) => JSON.stringify(state),
      deserialize: (json) => JSON.parse(json),

      // Version migration
      version: 2,
      migrate: (state: any, version: number) => {
        if (version === 1) {
          // Migrate from v1 to v2
          return {
            ...state,
            newField: 'default',
          };
        }
        return state;
      },

      // Debounce saves
      debounce: 1000, // Save at most once per second

      // Merge strategy
      merge: (persisted, initial) => ({
        ...initial,
        ...persisted,
        // Keep initial values for sensitive data
        apiKey: initial.apiKey,
      }),
    },
  },
  reducer
);
```

### Manual Persistence

Use persistence middleware with existing stores:

```typescript
import { createStore, createPersistMiddleware, restoreState } from 'pulsar';

const persistMiddleware = createPersistMiddleware({
  key: 'my-state',
  storage: localStorage,
});

const store = createStore(initialState, reducer, persistMiddleware);

// Manual restore
const restored = restoreState({
  key: 'my-state',
  storage: localStorage,
  initialState,
});
```

---

## Middleware

### Custom Middleware

Create middleware to intercept actions:

```typescript
import { IStoreMiddleware } from 'pulsar';

const loggerMiddleware: IStoreMiddleware<MyState> = (store) => (next) => (action) => {
  console.log('Before:', store.getState());
  console.log('Action:', action);

  const result = next(action);

  console.log('After:', store.getState());
  return result;
};

const store = createStore(initialState, reducer, loggerMiddleware);
```

### Async Middleware

Handle async actions:

```typescript
const asyncMiddleware: IStoreMiddleware<AppState> = (store) => (next) => (action) => {
  if (action.type === 'FETCH_USER') {
    fetch('/api/user')
      .then((res) => res.json())
      .then((user) => {
        store.dispatch({ type: 'USER_LOADED', payload: user });
      });
    return;
  }
  return next(action);
};
```

### Composing Middleware

Combine multiple middleware:

```typescript
import { composeMiddleware } from 'pulsar';

const store = createStore(
  initialState,
  reducer,
  composeMiddleware(
    loggerMiddleware,
    asyncMiddleware,
    createUndoMiddleware(),
    createPersistMiddleware({ key: 'app' })
  )
);
```

---

## DevTools Integration

### Redux DevTools

Connect to Redux DevTools for debugging:

```typescript
const store = createStore(
  initialState,
  reducer,
  undefined, // no middleware
  {
    name: 'MyApp',
    trace: true,
    traceLimit: 25,
  }
);

// DevTools automatically connected if extension installed
```

### DevTools Features

- **Action History**: See all dispatched actions
- **State Snapshots**: View state at any point in time
- **Time Travel**: Jump to previous states
- **Action Replay**: Replay action sequences
- **State Diff**: See what changed between states

---

## Best Practices

### 1. Keep State Normalized

```typescript
// ❌ Bad: Nested data
interface State {
  users: {
    id: number;
    posts: Post[];
  }[];
}

// ✅ Good: Normalized
interface State {
  users: { [id: number]: User };
  posts: { [id: number]: Post };
  userPosts: { [userId: number]: number[] };
}
```

### 2. Use Action Creators

```typescript
// Action creators for type safety
const actions = {
  increment: () => ({ type: 'INCREMENT' as const }),
  setUser: (name: string) => ({
    type: 'SET_USER' as const,
    payload: name,
  }),
};

store.dispatch(actions.increment());
```

### 3. Split Large Reducers

```typescript
import { combineReducers } from 'pulsar';

const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer,
  settings: settingsReducer,
});
```

### 4. Memoize Expensive Selectors

```typescript
// ✅ Memoized selector
const expensiveComputation = store.select((state) => {
  return state.items
    .filter((item) => item.active)
    .map((item) => heavyComputation(item))
    .sort((a, b) => a.score - b.score);
});

// Computation only runs when state.items changes
```

### 5. Use TypeScript

```typescript
// Define state shape
interface AppState {
  count: number;
  user: User | null;
}

// Define action union
type AppAction = { type: 'INCREMENT' } | { type: 'SET_USER'; payload: User };

// Type-safe reducer
const reducer = (state: AppState, action: AppAction): AppState => {
  // Full type inference and checking
};
```

### 6. Selective Persistence

```typescript
// Don't persist sensitive or temporary data
const store = createPersistentStore(
  {
    initialState,
    persist: {
      key: 'app',
      // Only persist what's needed
      whitelist: ['settings', 'preferences'],
      // Never persist sensitive data
      blacklist: ['password', 'token', 'temp'],
    },
  },
  reducer
);
```

### 7. Handle Migration

```typescript
// Always version persisted state
const store = createPersistentStore(
  {
    initialState,
    persist: {
      key: 'app',
      version: 2,
      migrate: (state: any, version: number) => {
        // Handle each version upgrade
        if (version < 2) {
          state = migrateV1ToV2(state);
        }
        return state;
      },
    },
  },
  reducer
);
```

---

## Example: Todo App

Complete example combining all features:

```typescript
import {
    createPersistentStore,
    createUndoMiddleware,
    UndoRedoActions,
    undoable
} from 'pulsar'

// State
interface TodoState {
    todos: { id: number; text: string; done: boolean }[]
    filter: 'all' | 'active' | 'completed'
}

// Actions
type TodoAction =
    | { type: 'ADD_TODO'; payload: string }
    | { type: 'TOGGLE_TODO'; payload: number }
    | { type: 'DELETE_TODO'; payload: number }
    | { type: 'SET_FILTER'; payload: TodoState['filter'] }

// Reducer
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                ...state,
                todos: [
                    ...state.todos,
                    { id: Date.now(), text: action.payload, done: false }
                ]
            }
        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload
                        ? { ...todo, done: !todo.done }
                        : todo
                )
            }
        case 'DELETE_TODO':
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload)
            }
        case 'SET_FILTER':
            return { ...state, filter: action.payload }
        default:
            return state
    }
}

// Create store with undo/redo and persistence
const store = createPersistentStore(
    {
        initialState: { todos: [], filter: 'all' as const },
        name: 'todo-app',
        persist: {
            key: 'todos',
            storage: localStorage,
            whitelist: ['todos'], // Don't persist filter
            version: 1
        }
    },
    undoable(todoReducer, {
        filter: action => action.type !== 'SET_FILTER'
    })
)

// Selectors
const visibleTodos = store.select(state => {
    const { todos, filter } = state.present
    switch (filter) {
        case 'active':
            return todos.filter(t => !t.done)
        case 'completed':
            return todos.filter(t => t.done)
        default:
            return todos
    }
})

// Use in components
function TodoList() {
    const todos = visibleTodos()
    const state = store.getState()

    return (
        <div>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        <input
                            type="checkbox"
                            checked={todo.done}
                            onChange={() =>
                                store.dispatch({
                                    type: 'TOGGLE_TODO',
                                    payload: todo.id
                                })
                            }
                        />
                        {todo.text}
                    </li>
                ))}
            </ul>

            <div>
                <button
                    disabled={!state.present.past?.length}
                    onClick={() => store.dispatch(UndoRedoActions.undo())}
                >
                    Undo
                </button>
                <button
                    disabled={!state.present.future?.length}
                    onClick={() => store.dispatch(UndoRedoActions.redo())}
                >
                    Redo
                </button>
            </div>
        </div>
    )
}
```

---

## Performance Tips

1. **Use `select()` for derived state** - Memoization prevents unnecessary recalculations
2. **Keep reducers pure** - No side effects, always return new objects
3. **Normalize nested data** - Flat structure for easier updates
4. **Debounce persistence** - Avoid excessive localStorage writes
5. **Selective subscriptions** - Subscribe to specific slices of state
6. **Batch updates** - Group multiple dispatches when possible

## Migration from Redux

Pulsar's store API is intentionally similar to Redux:

```typescript
// Redux
const store = createStore(reducer, initialState, applyMiddleware(...))

// Pulsar (almost identical)
const store = createStore(initialState, reducer, middleware)
```

**Key differences:**

- State is automatically reactive (no `connect()` HOC needed)
- Selectors are memoized by default
- Built-in undo/redo and persistence
- TypeScript-first design with full inference

---

For more examples, see the [examples](./EXAMPLES.md) documentation.
