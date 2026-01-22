# Async Resources

**Status**: ✅ Implemented  
**Location**: `packages/core/resource/`

## Overview

The Resource system provides declarative async data fetching with automatic loading/error state management, stale-time tracking, and dependency-based refetching. It eliminates manual loading state management and provides a clean API for handling async operations.

## Key Features

- **Automatic State Management**: Idle → Loading → Success/Error lifecycle
- **Loading States**: Built-in `isLoading`, `isSuccess`, `isError` flags
- **Error Handling**: Automatic error capture with callbacks
- **Deduplication**: Concurrent load requests share same promise
- **Stale Time**: Configure how long data stays fresh
- **Dependency Tracking**: Auto-refetch when reactive dependencies change
- **Suspense-like UI**: `<Waiting>` component for loading fallbacks
- **Bulk Operations**: Utilities for managing multiple resources

## Core API

### createResource

Creates a resource that fetches data with automatic state management.

```typescript
import { createResource } from '@pulsar/core';

const userResource = createResource(
    () => fetch('/api/user').then(r => r.json()),
    {
        staleTime: 5000,  // Fresh for 5 seconds
        onSuccess: (data) => console.log('Loaded:', data),
        onError: (error) => console.error('Failed:', error)
    }
);

// Access state
console.log(userResource.isLoading);  // boolean
console.log(userResource.data);       // T | null
console.log(userResource.error);      // Error | null

// Manual operations
await userResource.refetch();  // Force refetch
userResource.clear();          // Reset to idle
```

**Options:**

```typescript
interface IResourceOptions {
    lazy?: boolean;           // Don't fetch immediately (default: false)
    staleTime?: number;       // Milliseconds until stale (default: 0)
    autoRefetch?: boolean;    // Auto-refetch on dependencies (default: true)
    onSuccess?: (data) => void;
    onError?: (error: Error) => void;
}
```

### createTrackedResource

Creates a resource that automatically refetches when reactive dependencies change.

```typescript
import { createSignal, createTrackedResource } from '@pulsar/core';

const userId = createSignal(1);

// Fetcher tracks userId signal
const userResource = createTrackedResource(
    () => fetch(`/api/users/${userId()}`).then(r => r.json())
);

// Changing userId triggers automatic refetch
userId(2);  // Resource automatically refetches for user 2
```

### Resource Properties

```typescript
interface IResource<T> {
    // State
    readonly state: 'idle' | 'loading' | 'success' | 'error';
    readonly data: T | null;
    readonly error: Error | null;
    
    // Flags
    readonly isLoading: boolean;
    readonly isSuccess: boolean;
    readonly isError: boolean;
    readonly isStale: boolean;
    
    // Methods
    refetch(): Promise<void>;
    clear(): void;
    load(): Promise<void>;
}
```

## Waiting Component

Suspense-like component that shows fallback UI while resources load.

### Vanilla DOM Syntax
```typescript
import { Waiting } from '@pulsar/core';

function UserProfile() {
    const userResource = createResource(fetchUser);
    
    return Waiting({
        default: div({ textContent: 'Loading user...' }),
        children: userResource.data 
            ? div({ textContent: `Hello ${userResource.data.name}` })
            : div({ textContent: 'No user' })
    });
}
```

### TSX Syntax
```tsx
import { Waiting } from '@pulsar/core';

function UserProfile() {
    const userResource = createResource(fetchUser);
    
    return (
        <Waiting default={<div>Loading user...</div>}>
            {userResource.data 
                ? <div>Hello {userResource.data.name}</div>
                : <div>No user</div>
            }
        </Waiting>
    );
}
```

**Manual Control:**

```typescript
import { Waiting, resolveWaiting, suspendWaiting } from '@pulsar/core';

const container = Waiting({
    default: loadingSpinner(),
    children: content()
});

// Transition to content when ready
resolveWaiting(container);

// Go back to loading (e.g., during refetch)
suspendWaiting(container);
```

## Resource Utilities

Helpers for managing multiple resources.

```typescript
import {
    isAnyLoading,
    isAllSuccess,
    isAnyError,
    getErrors,
    refetchAll,
    clearAll,
    waitForAll
} from '@pulsar/core';

const resources = [userResource, postsResource, commentsResource];

// Check states
if (isAnyLoading(resources)) {
    console.log('At least one resource is loading');
}

if (isAllSuccess(resources)) {
    console.log('All resources loaded successfully');
}

// Get all errors
const errors = getErrors(resources);
errors.forEach(err => console.error(err));

// Bulk operations
await refetchAll(resources);  // Refetch all in parallel
clearAll(resources);          // Reset all to idle
await waitForAll(resources);  // Wait for all to finish
```

## Examples

### Basic Data Fetching

**Vanilla DOM:**
```typescript
import { createResource } from '@pulsar/core';

function UserList() {
    const usersResource = createResource(
        () => fetch('/api/users').then(r => r.json())
    );
    
    const container = document.createElement('div');
    
    if (usersResource.isLoading) {
        container.textContent = 'Loading users...';
    } else if (usersResource.isError) {
        container.textContent = `Error: ${usersResource.error.message}`;
    } else if (usersResource.isSuccess) {
        const ul = document.createElement('ul');
        usersResource.data.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user.name;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }
    
    return container;
}
```

**TSX:**
```tsx
import { createResource, Show, For } from '@pulsar/core';

function UserList() {
    const usersResource = createResource(
        () => fetch('/api/users').then(r => r.json())
    );
    
    return (
        <div>
            <Show when={() => usersResource.isLoading}>
                <div>Loading users...</div>
            </Show>
            
            <Show when={() => usersResource.isError}>
                <div>Error: {usersResource.error?.message}</div>
            </Show>
            
            <Show when={() => usersResource.isSuccess}>
                <ul>
                    <For each={() => usersResource.data || []}>
                        {(user) => <li>{user.name}</li>}
                    </For>
                </ul>
            </Show>
        </div>
    );
}
```

### Reactive Dependencies

```typescript
import { createSignal, createTrackedResource, createEffect } from '@pulsar/core';

function SearchResults() {
    const query = createSignal('');
    
    const resultsResource = createTrackedResource(
        () => fetch(`/api/search?q=${query()}`).then(r => r.json())
    );
    
    const input = document.createElement('input');
    input.addEventListener('input', (e) => {
        query((e.target as HTMLInputElement).value);
        // Resource automatically refetches on query change
    });
    
    const results = document.createElement('div');
    createEffect(() => {
        if (resultsResource.isSuccess) {
            results.textContent = `Found ${resultsResource.data.length} results`;
        }
    });
    
    return { input, results };
}
```

### Multiple Resources with Waiting

**Vanilla DOM:**
```typescript
import { createResource, Waiting, isAllSuccess } from '@pulsar/core';

function Dashboard() {
    const userResource = createResource(fetchUser);
    const statsResource = createResource(fetchStats);
    const notificationsResource = createResource(fetchNotifications);
    
    const resources = [userResource, statsResource, notificationsResource];
    
    return Waiting({
        default: div({ textContent: 'Loading dashboard...' }),
        children: isAllSuccess(resources)
            ? renderDashboard(
                userResource.data,
                statsResource.data,
                notificationsResource.data
              )
            : div({ textContent: 'Failed to load dashboard' })
    });
}
```

**TSX:**
```tsx
import { createResource, Waiting, isAllSuccess } from '@pulsar/core';

function Dashboard() {
    const userResource = createResource(fetchUser);
    const statsResource = createResource(fetchStats);
    const notificationsResource = createResource(fetchNotifications);
    
    const resources = [userResource, statsResource, notificationsResource];
    
    return (
        <Waiting default={<div>Loading dashboard...</div>}>
            {isAllSuccess(resources)
                ? <DashboardContent 
                    user={userResource.data}
                    stats={statsResource.data}
                    notifications={notificationsResource.data}
                  />
                : <div>Failed to load dashboard</div>
            }
        </Waiting>
    );
}
```

### Manual Refetch with Button

```typescript
import { createResource } from '@pulsar/core';

function DataView() {
    const dataResource = createResource(fetchData);
    
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh';
    refreshButton.addEventListener('click', () => {
        dataResource.refetch();
    });
    
    const content = document.createElement('div');
    createEffect(() => {
        if (dataResource.isLoading) {
            content.textContent = 'Refreshing...';
        } else if (dataResource.isSuccess) {
            content.textContent = JSON.stringify(dataResource.data);
        }
    });
    
    return { refreshButton, content };
}
```

### Stale-While-Revalidate Pattern

```typescript
import { createResource } from '@pulsar/core';

const cacheResource = createResource(
    () => fetch('/api/data').then(r => r.json()),
    {
        staleTime: 60000,  // Fresh for 1 minute
        onSuccess: (data) => {
            // Cache to localStorage
            localStorage.setItem('cached-data', JSON.stringify(data));
        }
    }
);

// Check if stale
if (cacheResource.isStale) {
    console.log('Data is stale, refetching...');
    cacheResource.refetch();
}
```

### Error Retry Logic

```typescript
import { createResource } from '@pulsar/core';

function fetchWithRetry<T>(
    fetcher: () => Promise<T>,
    maxRetries = 3
): () => Promise<T> {
    let retries = 0;
    
    return async () => {
        while (retries < maxRetries) {
            try {
                return await fetcher();
            } catch (error) {
                retries++;
                if (retries >= maxRetries) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * retries));
            }
        }
        throw new Error('Max retries exceeded');
    };
}

const resilientResource = createResource(
    fetchWithRetry(() => fetch('/api/data').then(r => r.json()))
);
```

## Architecture

### Feature Slice Structure

```
packages/core/resource/
├── resource.types.ts              # Type definitions
├── resource.ts                    # Constructor
├── create-resource.ts             # Factory function
├── create-tracked-resource.ts     # Tracked variant
├── waiting.types.ts               # Waiting component types
├── waiting.ts                     # Waiting component
├── resource-utils.ts              # Bulk utilities
├── prototype/
│   ├── load.ts                    # Load method
│   ├── refetch.ts                 # Refetch method
│   └── clear.ts                   # Clear method
├── resource.test.ts               # Resource tests
├── waiting.test.ts                # Waiting tests
└── index.ts                       # Public exports
```

### State Machine

```
┌─────┐
│Idle │ ──load()──> ┌─────────┐
└─────┘             │Loading  │
   ↑                └─────────┘
   │                    │   │
   │                    │   │
clear()            success error
   │                    │   │
   │                    ↓   ↓
   │              ┌─────────┐ ┌───────┐
   └──────────────│Success  │ │Error  │
                  └─────────┘ └───────┘
                       │           │
                       └─refetch()─┘
```

## Best Practices

### 1. Use Lazy Loading for On-Demand Data

```typescript
const userResource = createResource(
    () => fetch(`/api/user/${userId()}`).then(r => r.json()),
    { lazy: true }
);

// Load when needed
button.addEventListener('click', () => {
    userResource.load();
});
```

### 2. Handle Errors Gracefully

```typescript
const resource = createResource(fetchData, {
    onError: (error) => {
        if (error.message.includes('404')) {
            showNotFound();
        } else {
            showErrorToast(error.message);
        }
    }
});
```

### 3. Combine with Show/For Components

```typescript
import { Show, For, createResource } from '@pulsar/core';

const usersResource = createResource(fetchUsers);

Show({
    when: () => usersResource.isSuccess,
    children: For({
        each: () => usersResource.data || [],
        children: (user) => renderUser(user)
    }),
    fallback: div({ textContent: 'Loading...' })
});
```

### 4. Debounce Tracked Resources

```typescript
import { debounce } from 'lodash';

const searchQuery = createSignal('');

const debouncedFetch = debounce(
    (query: string) => fetch(`/api/search?q=${query}`).then(r => r.json()),
    300
);

const searchResource = createTrackedResource(
    () => debouncedFetch(searchQuery())
);
```

## Testing

Resources include comprehensive test coverage:

- ✅ Loading state transitions
- ✅ Success data handling  - ✅ Error capture and callbacks
- ✅ Concurrent load deduplication
- ✅ Refetch functionality
- ✅ Clear/reset operations
- ✅ Stale time tracking
- ✅ Waiting component transitions
- ✅ Bulk utility operations

**Run tests:**

```bash
pnpm test resource
```

## Performance Considerations

### Deduplication

Resources automatically deduplicate concurrent loads - multiple `load()` calls share the same promise.

### Stale-While-Revalidate

Configure `staleTime` to serve cached data immediately while refetching in background:

```typescript
const resource = createResource(fetchData, { staleTime: 30000 });

// Serve stale data immediately, refetch if stale
if (resource.isStale) {
    resource.refetch(); // Non-blocking
}
return resource.data; // Serve immediately
```

### Memory Management

Resources store minimal state. Call `clear()` when component unmounts:

```typescript
onCleanup(() => {
    resource.clear();
});
```

## Migration from Other Frameworks

### From React Query

```typescript
// React Query
const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: fetchUser
});

// pulsar
const userResource = createResource(() => fetchUser(userId));
// Access: userResource.data, userResource.isLoading, userResource.error
// Refetch: userResource.refetch()
```

### From SolidJS createResource

```typescript
// SolidJS
const [data, { refetch }] = createResource(userId, fetchUser);

// pulsar
const userResource = createTrackedResource(() => fetchUser(userId()));
// Similar tracked dependencies, same refetch API
```

## Limitations & Future Work

### Current Limitations

1. **No Query Caching**: Each resource instance is independent (no global cache)
2. **Manual Tracked Resources**: Effect-based tracking needs refinement
3. **No Infinite Queries**: Pagination requires manual management
4. **No Optimistic Updates**: Mutations need separate handling

### Future Enhancements

- Global query cache with cache keys
- Mutation system for optimistic updates
- Infinite query support with `fetchMore()`
- Request cancellation with AbortController
- Background refetch strategies
- Query invalidation system

## Related Systems

- **[Reactivity](../reactivity/)** - Signal/Effect system for dependency tracking
- **[Control Flow](../control-flow/)** - Show/For components for conditional rendering
- **[Dev Utilities](../dev/)** - Development warnings and debugging
- **[Error Boundaries](../error-boundaries/)** - Error catching (coming soon)

---

**Implementation**: Days 1-5 of Week 1  
**Tests**: 29 passing (resource.test.ts, waiting.test.ts)  
**Status**: Production-ready ✅
