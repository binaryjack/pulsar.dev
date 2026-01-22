# Server-Side Rendering (SSR)

Server-side rendering for Pulsar Framework with hydration and static site generation support.

## Features

✅ **renderToString()** - Render components to HTML on the server  
✅ **hydrate()** - Client-side hydration of server-rendered HTML  
✅ **generateStatic()** - Static site generation for multiple routes  
✅ **HTML Escaping** - XSS protection for user content  
✅ **State Serialization** - Serialize/deserialize application state  
✅ **TypeScript** - Full type safety  
✅ **15+ Tests** - Comprehensive test coverage

## Installation

SSR is included in the core Pulsar package:

```bash
npm install @pulsar-framework/pulsar.dev
```

## Basic Usage

### Server-Side Rendering

```typescript
import { renderToString } from '@pulsar-framework/pulsar.dev/ssr'

// Your Pulsar component
const App = () => {
  return (
    <div>
      <h1>Hello SSR</h1>
      <p>Server-rendered content</p>
    </div>
  )
}

// Render to HTML string
const result = renderToString(App)
console.log(result.html)
// Output: <div><h1>Hello SSR</h1><p>Server-rendered content</p></div>
```

### Client-Side Hydration

```typescript
import { hydrate } from '@pulsar-framework/pulsar.dev/ssr';

// Hydrate server-rendered HTML
hydrate(App, '#app');
```

### Full SSR Example

**Server (Node.js/Express):**

```typescript
import express from 'express';
import { renderToString, createSSRContext } from '@pulsar-framework/pulsar.dev/ssr';
import { App } from './App';

const server = express();

server.get('*', (req, res) => {
  // Create SSR context
  const context = createSSRContext({
    url: req.url,
    request: req,
    data: { userId: '123' },
  });

  // Render component
  const result = renderToString(App, {
    context,
    serializeState: true,
  });

  // Send HTML response
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>My App</title></head>
      <body>
        <div id="app">${result.html}</div>
        ${result.state || ''}
        <script src="/client.js"></script>
      </body>
    </html>
  `);
});

server.listen(3000);
```

**Client:**

```typescript
import { hydrate, extractHydrationState } from '@pulsar-framework/pulsar.dev/ssr';
import { App } from './App';

// Extract serialized state
const state = extractHydrationState();

// Hydrate the app
hydrate(App, '#app', { state });
```

## API Reference

### renderToString()

Convert a Pulsar component to an HTML string.

```typescript
function renderToString(component: () => any, options?: IRenderToStringOptions): IRenderResult;
```

**Options:**

- `context?: ISSRContext` - SSR context (url, request, data, etc.)
- `wrapper?: (html: string) => string` - Wrap the rendered HTML
- `collectStyles?: boolean` - Collect CSS during rendering
- `collectScripts?: boolean` - Collect scripts during rendering
- `serializeState?: boolean` - Serialize state for hydration

**Returns:**

- `html: string` - Rendered HTML
- `styles?: string[]` - Collected styles
- `scripts?: string[]` - Collected scripts
- `state?: string` - Serialized state script

**Example:**

```typescript
const result = renderToString(App, {
  context: {
    url: '/users/123',
    data: { user: { id: 123, name: 'John' } },
  },
  serializeState: true,
  wrapper: (html) => `<main>${html}</main>`,
});
```

### hydrate()

Attach interactivity to server-rendered HTML.

```typescript
function hydrate(component: () => any, target: Element | string, options?: IHydrateOptions): void;
```

**Options:**

- `state?: any` - Serialized state from server
- `root?: Element | string` - Custom hydration root

**Example:**

```typescript
hydrate(App, '#app', {
  state: extractHydrationState(),
});
```

### createSSRContext()

Create an SSR context for rendering.

```typescript
function createSSRContext(options?: Partial<ISSRContext>): ISSRContext;
```

**Example:**

```typescript
const context = createSSRContext({
  url: req.url,
  request: req,
  data: { theme: 'dark' },
});
```

### generateStatic()

Generate static HTML files for multiple routes.

```typescript
function generateStatic(options: IStaticGenerationOptions): Promise<void>;
```

**Options:**

- `routes: string[]` - Routes to pre-render
- `outDir: string` - Output directory
- `component: any` - Component to render
- `getData?: (route: string) => Promise<any>` - Data fetching function
- `template?: (html: string, data?: any) => string` - HTML template

**Example:**

```typescript
await generateStatic({
  routes: ['/home', '/about', '/contact'],
  outDir: './dist',
  component: App,
  getData: async (route) => {
    // Fetch data for this route
    return { title: route };
  },
  template: (html, data) => `
    <!DOCTYPE html>
    <html>
      <head><title>${data.title}</title></head>
      <body>${html}</body>
    </html>
  `,
});
```

## HTML Escaping

All user content is automatically escaped to prevent XSS attacks:

```typescript
const App = () => <div>{userInput}</div>

// Input: <script>alert('xss')</script>
// Output: &lt;script&gt;alert('xss')&lt;/script&gt;
```

You can also manually escape:

```typescript
import { escapeHtml, escapeAttribute } from '@pulsar-framework/pulsar.dev/ssr';

const safe = escapeHtml('<script>alert("xss")</script>');
// Result: &lt;script&gt;alert('xss')&lt;/script&gt;
```

## State Serialization

Serialize state on the server and restore on the client:

**Server:**

```typescript
const result = renderToString(App, {
  context: {
    data: {
      user: { id: 1, name: 'John' },
      posts: [{ id: 1, title: 'Hello' }],
    },
  },
  serializeState: true,
});

// result.state contains:
// <script id="__PULSAR_STATE__" type="application/json">
//   {"user":{"id":1,"name":"John"},"posts":[...]}
// </script>
```

**Client:**

```typescript
import { extractHydrationState } from '@pulsar-framework/pulsar.dev/ssr';

const state = extractHydrationState();
console.log(state);
// { user: { id: 1, name: 'John' }, posts: [...] }
```

## Static Site Generation

Pre-render pages at build time:

```typescript
import { generateStatic } from '@pulsar-framework/pulsar.dev/ssr';

await generateStatic({
  routes: ['/', '/about', '/blog/post-1', '/blog/post-2'],
  outDir: './dist',
  component: App,
  getData: async (route) => {
    if (route.startsWith('/blog/')) {
      const slug = route.split('/').pop();
      return await fetchPost(slug);
    }
    return {};
  },
});

// Generates:
// dist/index.html
// dist/about/index.html
// dist/blog/post-1/index.html
// dist/blog/post-2/index.html
```

## Component Features

### Supported

- ✅ Text nodes
- ✅ HTML elements
- ✅ Nested components
- ✅ Props and attributes
- ✅ Children
- ✅ Arrays
- ✅ Null/undefined (skipped)
- ✅ Functions (signals - evaluated on server)
- ✅ Numbers

### Skipped on Server

- Event handlers (`onclick`, `onchange`, etc.)
- Effects (`createEffect`)
- Refs (`createRef`)
- Browser APIs

## Architecture

The SSR implementation follows Pulsar's Feature Slice Pattern:

```
src/ssr/
├── ssr.types.ts           # TypeScript interfaces
├── render-to-string.ts    # Server-side rendering
├── hydrate.ts             # Client-side hydration
├── create-ssr-context.ts  # Context creation
├── utils/
│   ├── escape-html.ts     # HTML escaping
│   └── serialize-data.ts  # State serialization
├── static/
│   └── generate-static.ts # Static generation
└── index.ts               # Public exports
```

## TypeScript

Full type safety with no `any` types:

```typescript
import type {
  ISSRContext,
  IRenderToStringOptions,
  IRenderResult,
  IHydrateOptions,
  IStaticGenerationOptions,
} from '@pulsar-framework/pulsar.dev/ssr';
```

## Testing

The SSR module has comprehensive test coverage:

```bash
npm test src/ssr
```

**Test Results:**

- ✅ 15+ passing tests
- ✅ Text rendering
- ✅ HTML elements
- ✅ Nested elements
- ✅ HTML escaping
- ✅ Boolean attributes
- ✅ Event handler skipping
- ✅ Void elements
- ✅ Arrays and composition
- ✅ State serialization
- ✅ Wrapper functions

## Best Practices

### 1. Minimize Server-Side Logic

Keep components simple on the server. Complex logic should run on the client:

```typescript
const App = () => {
  // Bad: Complex computation on every render
  const expensiveResult = heavyComputation()

  // Good: Compute once, pass as prop
  return <Component data={expensiveResult} />
}
```

### 2. Handle Server/Client Differences

Check environment before using browser APIs:

```typescript
const isBrowser = typeof window !== 'undefined'

const App = () => {
  if (isBrowser) {
    // Client-only code
    localStorage.setItem('key', 'value')
  }

  return <div>Content</div>
}
```

### 3. Serialize Only Necessary Data

Only serialize data needed for hydration:

```typescript
const result = renderToString(App, {
  context: {
    data: {
      // Only essential data
      userId: user.id,
      userName: user.name,
      // Don't include: user.fullProfile, user.history, etc.
    },
  },
  serializeState: true,
});
```

### 4. Use Static Generation When Possible

For content that doesn't change often, use SSG:

```typescript
// Build time
await generateStatic({
  routes: blogPosts.map((post) => `/blog/${post.slug}`),
  outDir: './dist',
  component: BlogPost,
});
```

## Limitations

- Effects don't run on the server
- Event handlers are skipped during SSR
- Browser APIs are not available
- Refs are not initialized on the server
- Suspense/async rendering not yet supported (v0.9.0)

## License

MIT
