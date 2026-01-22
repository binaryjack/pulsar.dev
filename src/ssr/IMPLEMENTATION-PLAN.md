# SSR Implementation Plan

## Architecture Overview

Server-Side Rendering (SSR) for Pulsar following the Feature Slice Pattern and Prototype-Based architecture.

## Goals

1. **renderToString()** - Convert components to HTML on the server
2. **hydrate()** - Attach interactivity to server-rendered HTML
3. **SSG Support** - Pre-render static pages at build time
4. **Streaming SSR** - Stream HTML chunks as they render (future)
5. **Data Fetching** - Resolve resources before rendering

## File Structure

```
src/ssr/
├── ssr.types.ts                  # TypeScript interfaces
├── render-to-string.ts            # Server-side rendering
├── hydrate.ts                     # Client-side hydration
├── create-ssr-context.ts          # Server context creation
├── server/                        # Server utilities
│   ├── server-context.ts          # Request context
│   ├── collect-styles.ts          # CSS extraction
│   └── collect-scripts.ts         # Script collection
├── static/                        # SSG utilities
│   ├── generate-static.ts         # Static generation
│   ├── prerender.ts               # Pre-render pages
│   └── extract-data.ts            # Data extraction
├── utils/                         # SSR utilities
│   ├── escape-html.ts             # HTML escaping
│   ├── serialize-data.ts          # Data serialization
│   └── create-hydration-script.ts # Hydration script
└── index.ts                       # Public exports
```

## Core Types

### SSRContext

```typescript
interface ISSRContext {
  url: string;
  request?: Request;
  response?: Response;
  data?: Record<string, any>;
  styles?: string[];
  scripts?: string[];
}
```

### RenderOptions

```typescript
interface IRenderOptions {
  context?: ISSRContext;
  wrapper?: (html: string) => string;
  collectStyles?: boolean;
  collectScripts?: boolean;
}
```

## Implementation Steps

1. ✅ Create type definitions
2. ⏳ Implement renderToString() core
3. ⏳ Implement HTML escaping utilities
4. ⏳ Implement data serialization
5. ⏳ Implement hydrate() function
6. ⏳ Implement SSR context management
7. ⏳ Implement SSG utilities
8. ⏳ Write comprehensive tests
9. ⏳ Create example app
10. ⏳ Update documentation

## Key Features

### Server-Side Rendering

- Convert Pulsar components to HTML strings
- Handle signals (evaluate to static values)
- Handle effects (skip on server)
- Handle context providers
- Handle error boundaries

### Hydration

- Attach event listeners to existing DOM
- Initialize signals with server values
- Run effects after hydration
- Preserve server-rendered HTML

### Static Site Generation

- Pre-render pages at build time
- Resolve data dependencies
- Generate static HTML files
- Support dynamic routes

### Data Serialization

- Serialize store state
- Serialize resource data
- Inject into HTML as JSON
- Deserialize on client

## Testing Strategy

### Unit Tests

- renderToString with simple components
- renderToString with signals
- renderToString with context
- HTML escaping
- Data serialization
- Hydration matching

### Integration Tests

- Full SSR + hydration flow
- SSR with routing
- SSR with resources
- SSG generation
- Error handling

### Performance Tests

- Large component trees
- Many signals
- Deep nesting
- Memory leaks

## Browser vs Server

### Server-Only

- No DOM manipulation
- No event listeners
- No timers/intervals
- No browser APIs

### Universal

- Component rendering
- Signal evaluation (read-only)
- Context providers
- Error boundaries

### Client-Only

- Event handlers
- Effects
- Refs
- Browser APIs

## Rendering Algorithm

1. **Component Tree Traversal**
   - Start from root component
   - Execute component functions
   - Collect return values (JSX)

2. **Signal Evaluation**
   - Read current signal values
   - Don't track dependencies (server)
   - Convert to static strings

3. **HTML Generation**
   - Convert JSX to HTML strings
   - Escape user content
   - Preserve data attributes for hydration

4. **Data Collection**
   - Extract initial state
   - Serialize to JSON
   - Inject into HTML

## Hydration Strategy

1. **DOM Matching**
   - Walk server-rendered DOM
   - Match with virtual tree
   - Attach event listeners

2. **State Initialization**
   - Parse serialized data
   - Initialize signals
   - Initialize stores

3. **Effect Execution**
   - Run effects after hydration
   - Setup subscriptions
   - Initialize resources

## Example Usage

### Basic SSR

```typescript
import { renderToString, hydrate } from '@pulsar-framework/pulsar.dev';

// Server
const html = renderToString(App);

// Client
hydrate(App, document.getElementById('app'));
```

### With Context

```typescript
const context = {
  url: '/users/123',
  request: req,
  data: { userId: '123' },
};

const html = renderToString(App, { context });
```

### Static Generation

```typescript
import { generateStatic } from '@pulsar-framework/pulsar.dev/ssr';

await generateStatic({
  routes: ['/home', '/about', '/contact'],
  outDir: './dist',
});
```

## Success Criteria

- [ ] renderToString() works with all component types
- [ ] Hydration preserves server HTML
- [ ] SSG generates valid static files
- [ ] Performance: <10ms for simple pages
- [ ] Memory: No leaks after rendering
- [ ] Tests: 30+ passing tests
- [ ] Documentation: Complete SSR guide
- [ ] Example: Working SSR app

## Timeline

- **Day 1**: Core renderToString implementation
- **Day 2**: Hydration and context
- **Day 3**: SSG utilities
- **Day 4**: Testing and examples
- **Day 5**: Documentation and polish
