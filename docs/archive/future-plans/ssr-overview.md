# SSR Overview: What, Why, How

## What is SSR?

Server-Side Rendering = Generate HTML on server, send to client, then "hydrate" to make interactive.

**Flow:**

```
Server: Component → HTML string → Send to browser
Browser: Receive HTML → Display → Download JS → Hydrate → Interactive
```

## Why SSR?

1. **Faster First Paint** - HTML displays before JS loads
2. **SEO** - Search engines see content immediately
3. **Social Sharing** - Meta tags work (Open Graph, Twitter Cards)
4. **Low-End Devices** - Content visible before heavy JS parsing

## Structural Changes Required

### 1. Separate Server/Client Code

**Current:** Single render target (DOM)

```typescript
// src/index.ts
export { render } from './render'; // Uses DOM
```

**New:** Dual render targets

```typescript
// src/server/index.ts
export { renderToString, renderToStream } from './render-server'; // Uses string builder

// src/client/index.ts
export { render, hydrate } from './render-client'; // Uses DOM
```

### 2. DOM-Independent Rendering Core

**Problem:** Current renderer uses `document.createElement()`

```typescript
// Current: src/bootstrap/create-element.ts
export function createElement(tag: string): HTMLElement {
  return document.createElement(tag); // ❌ Fails on server
}
```

**Solution:** Abstract element creation

```typescript
// src/core/element-factory.ts
export interface IElementFactory {
  createElement(tag: string): IElement;
  createTextNode(text: string): ITextNode;
}

// Server implementation
class StringElementFactory implements IElementFactory {
  createElement(tag: string): StringElement {
    return new StringElement(tag); // Builds HTML string
  }
}

// Client implementation
class DOMElementFactory implements IElementFactory {
  createElement(tag: string): HTMLElement {
    return document.createElement(tag); // Real DOM
  }
}
```

### 3. Hydration Markers

**Purpose:** Link server HTML to client components

**Server Output:**

```html
<div data-hyd="c1">
  <span data-hyd="c1-0">Hello</span>
  <button data-hyd="c1-1">Click</button>
</div>
```

**Client:** Uses markers to attach, not recreate

```typescript
function hydrate(component: Component, rootId: string) {
  const existing = document.querySelector(`[data-hyd="${rootId}"]`);
  attachComponent(existing, component); // Attach, don't create
}
```

### 4. Async Resource Resolution

**Problem:** Client can lazy-load, server must resolve upfront

**Client (current):**

```typescript
const [data] = createResource(() => fetchUser(id));
// Renders loading state, fetches in background
```

**Server (new):**

```typescript
await renderToStringAsync(() => <App />);
// Must wait for ALL resources before sending HTML
```

**Implementation:**

```typescript
// Collect all resource promises
const resources: Promise<any>[] = [];
function collectResource(promise: Promise<any>) {
  resources.push(promise);
}

// Wait for all
await Promise.all(resources);
// Then render with loaded data
```

### 5. Streaming Architecture

**Concept:** Send HTML in chunks, not all at once

**Traditional SSR:**

```
Server: Wait → Wait → Wait → Send complete HTML (10s)
Browser: Nothing → Nothing → Nothing → Display (10s)
```

**Streaming SSR:**

```
Server: Send shell → Send chunk 1 → Send chunk 2 → Done (1s + 2s + 3s)
Browser: Display shell (1s) → Update (2s) → Update (3s) → Done
```

**Implementation:**

```typescript
async function* renderToStream(component: Component) {
  yield '<html><head>...</head><body>'; // Shell (immediate)

  for await (const chunk of renderComponent(component)) {
    yield chunk; // Incremental content
  }

  yield '</body></html>'; // Close
}
```

### 6. Out-of-Order Streaming (Suspense)

**Problem:** Slow data blocks fast content

**Without:**

```html
<!-- Wait 5s for slow data, then send everything -->
<div>Fast content</div>
<div>Slow content (waited 5s)</div>
```

**With Out-of-Order:**

```html
<!-- Send immediately -->
<div>Fast content</div>
<template id="suspense-1">Loading...</template>

<!-- Later, send script to replace -->
<template id="suspense-1-data">
  <div>Slow content (loaded)</div>
</template>
<script>
  replace('suspense-1', 'suspense-1-data');
</script>
```

## Implementation Phases

### Phase 1: renderToString() (2 weeks)

- String-based element builder
- Attribute serialization
- HTML escaping
- Hydration markers
- Synchronous only (no async)

### Phase 2: renderToStringAsync() (1 week)

- Resource collection
- Wait for promises
- Suspense boundary resolution
- Timeout handling

### Phase 3: renderToStream() (2 weeks)

- Stream builder
- Chunk writing
- Backpressure handling
- Progressive rendering

### Phase 4: hydrate() (1 week)

- Marker parsing
- DOM attachment
- Event replay
- Mismatch handling

## Key Files to Create

```
src/
├── server/                     # Server-only code
│   ├── render-to-string.ts
│   ├── render-to-string-async.ts
│   ├── render-to-stream.ts
│   ├── dom-builder/            # HTML string generation
│   ├── hydration/              # Marker generation
│   └── stream/                 # Streaming utilities
├── client/                     # Client-only code
│   ├── hydrate.ts
│   ├── marker-parser.ts
│   └── event-replay.ts
├── core/                       # Shared abstractions
│   ├── element-factory.ts      # Abstract element creation
│   └── renderer.ts             # Core render logic (DOM-agnostic)
└── env/
    └── is-server.ts            # Environment detection
```

## Build Configuration

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./server": {
      "import": "./dist/server/index.js",
      "types": "./dist/server/index.d.ts",
      "node": "./dist/server/index.js"
    },
    "./client": {
      "import": "./dist/client/index.js",
      "types": "./dist/client/index.d.ts",
      "browser": "./dist/client/index.js"
    }
  }
}
```

## Testing Strategy

1. **Unit:** String builder, marker generation, HTML escaping
2. **Integration:** Full SSR → hydration cycle
3. **E2E:** Real browser hydration tests
4. **Performance:** TTFB, TTI, hydration time

## Common Pitfalls

1. **Don't use DOM APIs in server code** - No `window`, `document`, `localStorage`
2. **Escape HTML** - Prevent XSS
3. **Handle async carefully** - Server can't have "loading" state
4. **Event handlers** - Attach during hydration, not in HTML
5. **Mismatches** - Server/client must render identically
