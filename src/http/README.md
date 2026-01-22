# HTTP Client

Production-ready HTTP client with interceptors, caching, and retry logic built on the Fetch API.

## Features

✅ **Promise-based** - Built on modern Fetch API  
✅ **Interceptors** - Request, response, and error interceptors  
✅ **Caching** - Automatic GET request caching with TTL  
✅ **Retry Logic** - Exponential backoff with jitter  
✅ **TypeScript** - Full type safety with no `any` types  
✅ **Reactive Hook** - `useHttp()` hook with signal-based state  
✅ **Lightweight** - Minimal dependencies

## Installation

```bash
npm install @pulsar-framework/core
```

## Basic Usage

```typescript
import { createHttpClient } from '@pulsar-framework/core';

// Create client
const client = createHttpClient({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Make requests
const response = await client.get('/users');
console.log(response.data);

await client.post('/users', { name: 'John' });
await client.put('/users/1', { name: 'Jane' });
await client.delete('/users/1');
```

## Configuration

```typescript
interface IHttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  cache?: boolean; // Enable/disable caching (default: true)
  cacheTTL?: number; // Cache time-to-live in ms (default: 300000)
  retry?: boolean; // Enable/disable retry (default: false)
  retryConfig?: {
    maxAttempts?: number; // Max retry attempts (default: 3)
    baseDelay?: number; // Base delay in ms (default: 1000)
    maxDelay?: number; // Max delay in ms (default: 10000)
    factor?: number; // Backoff factor (default: 2)
    jitter?: boolean; // Add jitter (default: true)
    retryableStatuses?: number[]; // HTTP status codes to retry (default: [429, 500, 502, 503, 504])
  };
}
```

## Interceptors

### Request Interceptor

```typescript
client.addRequestInterceptor((config) => {
  // Add authentication token
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${getToken()}`,
  };
  return config;
});
```

### Response Interceptor

```typescript
client.addResponseInterceptor((response) => {
  // Transform response data
  return {
    ...response,
    data: transformData(response.data),
  };
});
```

### Error Interceptor

```typescript
client.addErrorInterceptor((error) => {
  // Log errors
  console.error('HTTP Error:', error.message);

  // Redirect on 401
  if (error.status === 401) {
    window.location.href = '/login';
  }

  throw error;
});
```

## Caching

GET requests are automatically cached:

```typescript
// First request hits the server
const data1 = await client.get('/users');

// Second request returns cached data
const data2 = await client.get('/users'); // From cache

// Clear cache
client.clearCache('/users');
// Or clear all
client.clearCache();
```

## Retry Logic

```typescript
const client = createHttpClient({
  baseURL: 'https://api.example.com',
  retry: true,
  retryConfig: {
    maxAttempts: 3,
    baseDelay: 1000,
    retryableStatuses: [429, 500, 502, 503],
  },
});

// Will retry on 5xx errors with exponential backoff
await client.get('/unstable-endpoint');
```

## Reactive Hook

`useHttp()` provides signal-based reactive state:

```typescript
import { useHttp, createHttpClient } from '@pulsar-framework/core'

const client = createHttpClient({ baseURL: 'https://api.example.com' })

function UserList() {
  const { data, loading, error, execute, refetch } = useHttp(client, {
    url: '/users',
    method: 'GET'
  })

  // Execute on mount or button click
  execute()

  return (
    <div>
      {loading() && <div>Loading...</div>}
      {error() && <div>Error: {error()!.message}</div>}
      {data() && (
        <ul>
          {data().map(user => <li key={user.id}>{user.name}</li>)}
        </ul>
      )}
      <button onclick={refetch}>Refresh</button>
    </div>
  )
}
```

### Hook Methods

```typescript
// Execute with additional config
await execute({ params: { page: 2 } });

// Refetch with same config
await refetch();

// Reset all state
reset();
```

### Convenience Hooks

```typescript
// GET requests
const { data, loading, execute } = useHttpGet(client, '/users');

// POST requests
const { data, loading, execute } = useHttpPost(client, '/users');
await execute({ body: { name: 'John' } });
```

## TypeScript

All APIs are fully typed:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Type-safe response
const response = await client.get<User[]>('/users');
const users: User[] = response.data;

// Type-safe hook
const { data } = useHttpGet<User[]>(client, '/users');
const users: User[] | null = data();
```

## Error Handling

```typescript
try {
  await client.get('/users');
} catch (error) {
  const httpError = error as IHttpError;

  console.log(httpError.status); // 404
  console.log(httpError.statusText); // "Not Found"
  console.log(httpError.message); // "HTTP Error 404"
  console.log(httpError.url); // Full URL
  console.log(httpError.config); // Request config
  console.log(httpError.response); // Original response
}
```

## Architecture

The HTTP client follows Pulsar's prototype-based architecture:

```
http/
  ├── http-client.ts              # Constructor
  ├── http-client.types.ts        # TypeScript interfaces
  ├── create-http-client.ts       # Factory function
  ├── use-http.ts                 # Reactive hook
  ├── prototype/                  # Prototype methods
  │   ├── request.ts              # Core request logic
  │   ├── get.ts, post.ts, etc.  # HTTP verb methods
  │   ├── add-*-interceptor.ts    # Interceptor methods
  │   └── clear-cache.ts          # Cache management
  ├── cache/                      # Caching logic
  │   ├── cache-key.ts            # Cache key generation
  │   └── memory-cache.ts         # In-memory cache
  ├── retry/                      # Retry logic
  │   └── retry-strategy.ts       # Exponential backoff
  └── utils/                      # Utilities
      ├── build-url.ts            # URL building
      └── create-http-error.ts    # Error creation
```

## Best Practices

1. **Create one client instance per base URL**:

   ```typescript
   export const apiClient = createHttpClient({ baseURL: 'https://api.example.com' });
   ```

2. **Use interceptors for global concerns** (auth, logging):

   ```typescript
   apiClient.addRequestInterceptor((config) => {
     config.headers['X-Request-ID'] = generateRequestId();
     return config;
   });
   ```

3. **Disable cache for mutations**:

   ```typescript
   await client.post('/users', data, { cache: false });
   ```

4. **Enable retry for idempotent requests**:

   ```typescript
   await client.get('/data', { retry: true });
   ```

5. **Use TypeScript generics for type safety**:
   ```typescript
   const response = await client.get<User[]>('/users');
   ```

## Testing

The HTTP client is fully tested with 25+ test cases covering:

- ✅ GET, POST, PUT, DELETE, PATCH methods
- ✅ Query parameters and request bodies
- ✅ HTTP errors (4xx, 5xx)
- ✅ Network errors and timeouts
- ✅ Caching with TTL
- ✅ Request/response/error interceptors
- ✅ Retry logic with exponential backoff
- ✅ Reactive hooks (useHttp, useHttpGet, useHttpPost)

## License

MIT
