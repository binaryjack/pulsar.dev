# DevTools Overview: What, Why, How

## What is a DevTools Extension?

Browser extension that adds a tab to Chrome/Firefox DevTools for framework-specific debugging.

**Architecture:**

```
Page (Pulsar app) ←→ Content Script ←→ Background Script ←→ DevTools Panel
```

## Why Build DevTools?

1. **Debug Components** - See component tree, props, state
2. **Track Signals** - Visualize reactive dependencies
3. **Profile Performance** - Find slow components
4. **Inspect Store** - Debug state changes
5. **Time-Travel** - Undo/redo state changes

## How DevTools Work

### 1. Communication Pipeline

**Inject Hook into Page:**

```typescript
// Injected into page before app loads
window.__PULSAR_DEVTOOLS_HOOK__ = {
  emit(event: string, data: any) {
    window.postMessage({ source: 'pulsar-hook', event, data }, '*');
  },
};
```

**Content Script (Bridge):**

```typescript
// Listens to page messages, forwards to extension
window.addEventListener('message', (e) => {
  if (e.data.source === 'pulsar-hook') {
    chrome.runtime.sendMessage(e.data);
  }
});
```

**DevTools Panel:**

```typescript
// Listens to extension messages, updates UI
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.event === 'component-mounted') {
    updateComponentTree(msg.data);
  }
});
```

### 2. Component Tree Tracking

**Instrument Component Mounting:**

```typescript
// In src/bootstrap/mount-component.ts
export function mountComponent(component: Component, parent: IElement) {
  const node = {
    id: generateId(),
    name: component.name,
    props: component.props,
    parent: parent?.id,
  };

  // Report to DevTools
  if (window.__PULSAR_DEVTOOLS_HOOK__) {
    window.__PULSAR_DEVTOOLS_HOOK__.emit('component-mounted', node);
  }

  // Original mounting logic...
}
```

**Build Tree in DevTools:**

```typescript
// In devtools panel
const tree: ComponentNode[] = [];

function updateComponentTree(node: ComponentNode) {
  tree.push(node);
  renderTree(tree); // Update UI
}
```

### 3. Signal Dependency Tracking

**Instrument Signal Creation:**

```typescript
// In src/reactivity/create-signal.ts
export function createSignal<T>(value: T) {
  const signal = {
    id: generateId(),
    value,
    subscribers: new Set(),
  };

  // Report to DevTools
  if (window.__PULSAR_DEVTOOLS_HOOK__) {
    window.__PULSAR_DEVTOOLS_HOOK__.emit('signal-created', {
      id: signal.id,
      value: signal.value,
    });
  }

  return [
    () => signal.value,
    (newValue: T) => {
      signal.value = newValue;
      // Report update
      window.__PULSAR_DEVTOOLS_HOOK__.emit('signal-updated', {
        id: signal.id,
        value: newValue,
      });
    },
  ];
}
```

**Visualize Dependencies:**

```typescript
// Track which effects depend on which signals
function trackDependency(effectId: string, signalId: string) {
  dependencies.set(effectId, signalId);
  renderDependencyGraph(); // Update UI
}
```

### 4. Performance Profiling

**Instrument Rendering:**

```typescript
export function render(component: Component) {
  const startTime = performance.now();

  const result = renderInternal(component);

  const duration = performance.now() - startTime;
  if (window.__PULSAR_DEVTOOLS_HOOK__) {
    window.__PULSAR_DEVTOOLS_HOOK__.emit('render-complete', {
      component: component.name,
      duration,
    });
  }

  return result;
}
```

**Profile Panel:**

```typescript
// Show render times, identify slow components
const profiles: RenderProfile[] = [];

function addProfile(profile: RenderProfile) {
  profiles.push(profile);
  highlightSlowComponents(); // Red if >16ms
}
```

### 5. Time-Travel Debugging

**Integrate with Store:**

```typescript
// Store already has undo/redo
// DevTools UI controls it
function timeTravel(index: number) {
  chrome.runtime.sendMessage({
    type: 'time-travel',
    index,
  });
}

// In page hook
window.__PULSAR_DEVTOOLS_HOOK__.on('time-travel', (index) => {
  store.jumpToState(index);
});
```

## File Structure

```
devtools/
├── manifest.json               # Extension config
├── icons/                      # Extension icons
├── src/
│   ├── background/
│   │   └── background.ts       # Background script
│   ├── content/
│   │   └── content-script.ts   # Injected bridge
│   ├── devtools/
│   │   ├── devtools.html       # DevTools page entry
│   │   └── create-panel.ts     # Create panel
│   ├── panel/
│   │   ├── Panel.tsx           # Main UI
│   │   ├── ComponentTree.tsx   # Component tree
│   │   ├── StateInspector.tsx  # Props/state viewer
│   │   ├── SignalGraph.tsx     # Signal dependencies
│   │   ├── Profiler.tsx        # Performance
│   │   └── TimeTravel.tsx      # Time-travel UI
│   ├── bridge/
│   │   ├── bridge.ts           # Message passing
│   │   └── protocol.ts         # Message types
│   └── hook/
│       └── install-hook.ts     # Page hook injection
└── build/                      # Built extension
```

## Manifest Configuration

```json
{
  "manifest_version": 3,
  "name": "Pulsar DevTools",
  "version": "1.0.0",
  "devtools_page": "devtools.html",
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content-script.js"],
      "run_at": "document_start"
    }
  ],
  "permissions": ["tabs", "storage"]
}
```

## UI Framework

**Use Pulsar itself!**

```typescript
// Build DevTools panel with Pulsar
import { render, createSignal } from 'pulsar';
import { ComponentTree, StateInspector } from './components';

function DevToolsPanel() {
  const [activeTab, setActiveTab] = createSignal('components');

  return (
    <div class="devtools-panel">
      <Tabs active={activeTab()} onChange={setActiveTab}>
        <Tab id="components">Components</Tab>
        <Tab id="signals">Signals</Tab>
        <Tab id="profiler">Profiler</Tab>
        <Tab id="time-travel">Time Travel</Tab>
      </Tabs>

      <Show when={activeTab() === 'components'}>
        <ComponentTree />
      </Show>

      {/* Other tabs... */}
    </div>
  );
}
```

## Build Process

1. **Build UI** with Vite
2. **Copy assets** to build/
3. **Generate manifest.json**
4. **Zip for distribution**

```bash
# Build script
pnpm build:devtools
# → devtools/build/ ready for loading
```

## Installation

**Development:**

1. Open Chrome → Extensions
2. Enable Developer Mode
3. "Load unpacked" → select `devtools/build/`

**Production:**

1. Zip `devtools/build/`
2. Upload to Chrome Web Store
3. Users install from store

## Testing Strategy

1. **Unit:** Hook instrumentation, message passing
2. **Integration:** Page ↔ extension communication
3. **E2E:** Real browser with extension loaded
4. **Manual:** Test with sample apps

## Key Challenges

1. **Performance Overhead** - Minimize impact on app
2. **Large Trees** - Virtualize for 1000+ components
3. **Serialization** - Can't send functions, only data
4. **Updates** - Batch and debounce updates
5. **Compatibility** - Chrome and Firefox differences

## Protocol Design

```typescript
// Message types
type DevToolsMessage =
  | { type: 'component-mounted'; data: ComponentNode }
  | { type: 'component-updated'; data: ComponentUpdate }
  | { type: 'signal-created'; data: SignalInfo }
  | { type: 'signal-updated'; data: SignalUpdate }
  | { type: 'render-complete'; data: RenderProfile };

// Command types (DevTools → Page)
type DevToolsCommand =
  | { type: 'inspect-component'; componentId: string }
  | { type: 'edit-prop'; componentId: string; prop: string; value: any }
  | { type: 'time-travel'; index: number };
```

## Reference Implementations

- **React DevTools** - Most mature, complex
- **Vue DevTools** - Good balance
- **Solid DevTools** - Simpler, signal-focused
- **Svelte DevTools** - Minimal but effective

Study these for best practices!
