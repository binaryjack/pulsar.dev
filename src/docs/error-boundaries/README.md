# Error Boundaries (Tryer/Catcher)

**Status**: ✅ Implemented  
**Location**: `packages/core/error-boundary/`  
**Custom Names**: `Tryer` (ErrorBoundary), `Catcher` (Error Display)

## Overview

The Error Boundary system provides context-based error catching to prevent component errors from crashing the entire application. Using `Tryer` and `Catcher` components, you can gracefully handle errors, display fallback UI, and implement recovery mechanisms.

## Key Features

- **Error Isolation**: Catch errors in component subtrees without crashing app
- **Custom Fallbacks**: Render custom error UI with error details  
- **Recovery**: Reset/retry mechanisms to recover from errors
- **Nested Boundaries**: Support multiple error boundaries with propagation control
- **Development Logging**: Rich error information in development mode
- **Context-Based**: Uses error boundary context stack for proper nesting

## Core API

### Tryer Component

Error boundary wrapper that catches errors in children.

**Vanilla DOM:**
```typescript
import { Tryer } from '@pulsar/core';

function App() {
    return Tryer({
        children: RiskyComponent(),
        options: {
            fallback: (errorInfo) => {
                const div = document.createElement('div');
                div.textContent = `Error: ${errorInfo.error.message}`;
                return div;
            },
            onError: (errorInfo) => {
                logErrorToService(errorInfo);
            },
            onReset: () => {
                console.log('Recovering from error');
            }
        }
    });
}
```

**TSX:**
```tsx
import { Tryer } from '@pulsar/core';

function App() {
    return (
        <Tryer options={{
            fallback: (errorInfo) => (
                <div>Error: {errorInfo.error.message}</div>
            ),
            onError: (errorInfo) => {
                logErrorToService(errorInfo);
            },
            onReset: () => {
                console.log('Recovering from error');
            }
        }}>
            <RiskyComponent />
        </Tryer>
    );
}
```

**Options:**

```typescript
interface IErrorBoundaryOptions {
    fallback?: (errorInfo: IErrorInfo) => HTMLElement;
    onError?: (errorInfo: IErrorInfo) => void;
    onReset?: () => void;
    logErrors?: boolean;        // Log to console in dev (default: true)
    propagate?: boolean;        // Propagate to parent (default: false)
}
```

### Catcher Component

Renders error information inside a Tryer boundary.

**Vanilla DOM:**
```typescript
import { Tryer, Catcher } from '@pulsar/core';

function App() {
    return Tryer({
        children: [
            Catcher({ showRetry: true }),
            RiskyContent()
        ]
    });
}
```

**TSX:**
```tsx
import { Tryer, Catcher } from '@pulsar/core';

function App() {
    return (
        <Tryer>
            <Catcher showRetry={true} />
            <RiskyContent />
        </Tryer>
    );
}
```

**Custom Rendering (Vanilla DOM):**
```typescript
Catcher({
    render: (errorInfo) => {
        const container = document.createElement('div');
        container.innerHTML = `
            <h3>Something went wrong</h3>
            <p>${errorInfo.error.message}</p>
            <p>Time: ${new Date(errorInfo.timestamp).toLocaleString()}</p>
        `;
        return container;
    },
    showRetry: true
});
```

**Custom Rendering (TSX):**
```tsx
function App() {
    return (
        <Tryer>
            <Catcher 
                render={(errorInfo) => (
                    <div>
                        <h3>Something went wrong</h3>
                        <p>{errorInfo.error.message}</p>
                        <p>Time: {new Date(errorInfo.timestamp).toLocaleString()}</p>
                    </div>
                )}
                showRetry={true}
            />
        </Tryer>
    );
}
```

### Error Boundary Context

Direct context API for programmatic error handling.

```typescript
import { createErrorBoundaryContext } from '@pulsar/core';

const errorBoundary = createErrorBoundaryContext({
    onError: (errorInfo) => {
        console.error('Caught error:', errorInfo);
    }
});

// Catch errors
try {
    dangerousOperation();
} catch (error) {
    errorBoundary.catchError(error as Error, 'ComponentName');
}

// Check state
console.log(errorBoundary.hasError);
console.log(errorBoundary.errorInfo);

// Reset
errorBoundary.reset();
```

**Error Info Structure:**

```typescript
interface IErrorInfo {
    error: Error;
    componentName?: string;
    timestamp: number;
    context?: Record<string, unknown>;
}
```

## Examples

### Basic Error Boundary

**Vanilla DOM:**
```typescript
import { Tryer } from '@pulsar/core';

function App() {
    return Tryer({
        children: UserProfile(),
        options: {
            fallback: (errorInfo) => {
                const div = document.createElement('div');
                div.style.padding = '20px';
                div.style.color = 'red';
                div.textContent = `Failed to load profile: ${errorInfo.error.message}`;
                return div;
            }
        }
    });
}
```

**TSX:**
```tsx
import { Tryer } from '@pulsar/core';

function App() {
    return (
        <Tryer options={{
            fallback: (errorInfo) => (
                <div style={{ padding: '20px', color: 'red' }}>
                    Failed to load profile: {errorInfo.error.message}
                </div>
            )
        }}>
            <UserProfile />
        </Tryer>
    );
}
```

### Nested Error Boundaries

**Vanilla DOM:**
```typescript
import { Tryer } from '@pulsar/core';

function Dashboard() {
    return Tryer({
        children: [
            // Outer boundary catches dashboard errors
            Header(),
            Tryer({
                // Inner boundary catches sidebar errors only
                children: Sidebar(),
                options: {
                    fallback: () => {
                        const div = document.createElement('div');
                        div.textContent = 'Sidebar failed to load';
                        return div;
                    }
                }
            }),
            MainContent()
        ],
        options: {
            fallback: () => {
                const div = document.createElement('div');
                div.textContent = 'Dashboard failed to load';
                return div;
            }
        }
    });
}
```

**TSX:**
```tsx
import { Tryer } from '@pulsar/core';

function Dashboard() {
    return (
        <Tryer options={{
            fallback: () => <div>Dashboard failed to load</div>
        }}>
            <Header />
            
            <Tryer options={{
                fallback: () => <div>Sidebar failed to load</div>
            }}>
                <Sidebar />
            </Tryer>
            
            <MainContent />
        </Tryer>
    );
}
```

### Error Propagation

```typescript
import { Tryer } from '@pulsar/core';

// Child boundary propagates errors to parent
Tryer({
    children: [
        Tryer({
            children: CriticalComponent(),
            options: {
                propagate: true,  // Propagate to parent on error
                onError: (errorInfo) => {
                    console.log('Child caught error, propagating up');
                }
            }
        }),
        OtherContent()
    ],
    options: {
        onError: (errorInfo) => {
            console.log('Parent received propagated error');
            sendToErrorTracking(errorInfo);
        }
    }
});
```

### With Retry Logic

```typescript
import { Tryer, Catcher, resetTryer } from '@pulsar/core';

function ComponentWithRetry() {
    const container = Tryer({
        children: [
            Catcher({ showRetry: true }),  // Includes retry button
            DataFetcher()
        ],
        options: {
            onReset: () => {
                console.log('User clicked retry');
            }
        }
    });
    
    // Manual retry trigger
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Manual Retry';
    retryButton.addEventListener('click', () => {
        resetTryer(container);
    });
    
    return { container, retryButton };
}
```

### Error Logging to Service

```typescript
import { Tryer } from '@pulsar/core';

function App() {
    return Tryer({
        children: AppContent(),
        options: {
            onError: async (errorInfo) => {
                // Log to error tracking service
                await fetch('/api/errors', {
                    method: 'POST',
                    body: JSON.stringify({
                        message: errorInfo.error.message,
                        stack: errorInfo.error.stack,
                        component: errorInfo.componentName,
                        timestamp: errorInfo.timestamp,
                        context: errorInfo.context
                    })
                });
            }
        }
    });
}
```

### Development vs Production

```typescript
import { Tryer, DEV } from '@pulsar/core';

function App() {
    return Tryer({
        children: Content(),
        options: {
            fallback: (errorInfo) => {
                const div = document.createElement('div');
                
                if (DEV) {
                    // Detailed error in development
                    div.innerHTML = `
                        <h3>Error in ${errorInfo.componentName || 'Component'}</h3>
                        <pre>${errorInfo.error.stack}</pre>
                        <p>Time: ${new Date(errorInfo.timestamp).toLocaleString()}</p>
                    `;
                } else {
                    // User-friendly message in production
                    div.textContent = 'Something went wrong. Please try again later.';
                }
                
                return div;
            },
            logErrors: DEV  // Only log in development
        }
    });
}
```

### Async Error Handling

```typescript
import { Tryer, getActiveErrorBoundary } from '@pulsar/core';

function AsyncComponent() {
    const container = document.createElement('div');
    
    // Get error boundary from context
    const errorBoundary = getActiveErrorBoundary();
    
    async function loadData() {
        try {
            const data = await fetch('/api/data').then(r => r.json());
            container.textContent = JSON.stringify(data);
        } catch (error) {
            // Manually catch async error
            if (errorBoundary) {
                errorBoundary.catchError(
                    error as Error,
                    'AsyncComponent',
                    { operation: 'loadData' }
                );
            }
        }
    }
    
    loadData();
    return container;
}

// Wrap in Tryer
Tryer({
    children: AsyncComponent(),
    options: {
        fallback: (errorInfo) => {
            const div = document.createElement('div');
            div.textContent = `Failed to load: ${errorInfo.error.message}`;
            return div;
        }
    }
});
```

### Multiple Components with Catcher

**Vanilla DOM:**
```typescript
import { Tryer, Catcher } from '@pulsar/core';

function MultiComponentView() {
    return Tryer({
        children: [
            Header(),
            Catcher({
                render: (errorInfo) => {
                    const div = document.createElement('div');
                    div.style.backgroundColor = '#fee';
                    div.style.padding = '10px';
                    div.textContent = `⚠️ ${errorInfo.error.message}`;
                    return div;
                }
            }),
            ContentArea(),
            Footer()
        ]
    });
}
```

**TSX:**
```tsx
import { Tryer, Catcher } from '@pulsar/core';

function MultiComponentView() {
    return (
        <Tryer>
            <Header />
            
            <Catcher render={(errorInfo) => (
                <div style={{ backgroundColor: '#fee', padding: '10px' }}>
                    ⚠️ {errorInfo.error.message}
                </div>
            )} />
            
            <ContentArea />
            <Footer />
        </Tryer>
    );
}
```

## Architecture

### Feature Slice Structure

```
packages/core/error-boundary/
├── error-boundary.types.ts            # Type definitions
├── error-boundary-context.ts          # Context constructor
├── error-boundary-context-manager.ts  # Context stack management
├── create-error-boundary-context.ts   # Factory function
├── tryer.ts                          # Tryer component
├── catcher.ts                        # Catcher component
├── prototype/
│   ├── catch-error.ts                # Catch error method
│   ├── reset.ts                      # Reset method
│   └── propagate.ts                  # Propagate method
├── error-boundary.test.ts            # Tests
└── index.ts                          # Public exports
```

### Error Boundary Context Stack

```
┌─────────────────────┐
│  App (Tryer)        │  ← Outer boundary
│  ┌───────────────┐  │
│  │ Sidebar       │  │
│  │ (Tryer)       │  │  ← Inner boundary
│  │  └─ Widget ❌ │  │     Error caught here first
│  └───────────────┘  │
│  Content            │
└─────────────────────┘

Stack during Widget render:
[App ErrorBoundary, Sidebar ErrorBoundary] ← Active
```

## Best Practices

### 1. Boundary Placement

Place error boundaries at strategic levels - not around every component.

```typescript
// ✅ GOOD - Strategic boundaries
App
  ├─ Tryer (page-level)
  │   ├─ Header
  │   ├─ Sidebar (with own Tryer if critical)
  │   └─ Content
  └─ Footer

// ❌ BAD - Too many boundaries
App
  ├─ Tryer
  │   ├─ Tryer (Header)
  │   ├─ Tryer (Button)
  │   └─ Tryer (Text)
```

### 2. Error Context

Include useful context when catching errors.

```typescript
errorBoundary.catchError(error, 'FormSubmit', {
    userId: currentUser.id,
    formData: sanitizedData,
    timestamp: Date.now()
});
```

### 3. User-Friendly Fallbacks

Show helpful messages, not raw error details in production.

```typescript
fallback: (errorInfo) => {
    const div = document.createElement('div');
    
    // User sees friendly message
    div.textContent = 'Unable to load this section. Please refresh or try again later.';
    
    // Log full details for debugging
    console.error('Full error:', errorInfo);
    
    return div;
}
```

### 4. Cleanup on Reset

Clean up any side effects when resetting.

```typescript
Tryer({
    children: Component(),
    options: {
        onReset: () => {
            // Clean up
            clearIntervals();
            closeWebSockets();
            resetGlobalState();
        }
    }
});
```

## Testing

Error boundaries include comprehensive test coverage:

- ✅ Error catching and state transitions
- ✅ Custom fallback rendering
- ✅ Error callbacks (onError, onReset)
- ✅ Nested boundary support
- ✅ Error propagation
- ✅ Recovery/reset mechanisms
- ✅ Development logging
- ✅ Context management

**Run tests:**

```bash
pnpm test error-boundary
```

## Performance Considerations

### Minimal Overhead

Error boundaries have near-zero cost when no errors occur - just context stack management.

### Avoid Over-Nesting

Deeply nested boundaries add minimal overhead, but clarity suffers:

```typescript
// Reasonable: 2-3 levels
App → PageBoundary → CriticalSectionBoundary

// Excessive: boundary per component
App → Boundary → Boundary → Boundary → ...
```

## Migration from Other Frameworks

### From React Error Boundaries

```typescript
// React
class ErrorBoundary extends React.Component {
    componentDidCatch(error, errorInfo) {
        logError(error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }
        return this.props.children;
    }
}

// pulsar
Tryer({
    children: YourComponent(),
    options: {
        onError: (errorInfo) => logError(errorInfo),
        fallback: () => {
            const h1 = document.createElement('h1');
            h1.textContent = 'Something went wrong.';
            return h1;
        }
    }
});
```

## Limitations & Future Work

### Current Limitations

1. **No Error Stack Traces**: Component stack traces not automatically captured
2. **Async Errors**: Must manually catch and report async errors
3. **Event Handler Errors**: Window error events used, may miss some cases

### Future Enhancements

- Component stack trace capture
- Automatic async error catching
- Error boundary DevTools
- Error rate limiting
- Recovery strategies (exponential backoff)

## Related Systems

- **[Resource System](../async-resources/)** - Async data fetching with error states
- **[Dev Utilities](../dev/)** - Development warnings and debugging
- **[Control Flow](../control-flow/)** - Show/For conditional rendering

---

**Implementation**: Days 1-5 of Week 2  
**Tests**: 22 passing (error-boundary.test.ts)  
**Status**: Production-ready ✅
