# Pulsar Testing Utilities

Complete testing framework for Pulsar applications with familiar APIs inspired by @testing-library/react.

## Installation

Testing utilities are included with Pulsar:

```typescript
import { render, screen, fireEvent, waitFor } from 'pulsar/testing';
```

## Quick Start

```typescript
import { render, screen, fireEvent, waitFor } from 'pulsar/testing';
import { Counter } from './Counter';

describe('Counter Component', () => {
  it('increments count on button click', async () => {
    render(Counter, { props: { initial: 0 } });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Count: 1')).toBeInTheDocument();
    });
  });
});
```

## API Reference

### Rendering

#### `render(component, options?)`

Renders a Pulsar component for testing.

```typescript
const { container, unmount, rerender, debug } = render(MyComponent, {
  props: { name: 'John' },
  wrapper: (children) => <Provider>{children}</Provider>,
  container: document.createElement('div')
});
```

**Options:**

- `props` - Initial props for the component
- `wrapper` - Wrap component (useful for providers)
- `container` - Custom DOM container

**Returns:**

- `container` - DOM element containing the component
- `unmount()` - Unmount the component
- `rerender(props?)` - Re-render with new props
- `debug()` - Print container HTML to console

#### `cleanup()`

Unmounts all rendered components. Called automatically with `setupAutoCleanup()`.

```typescript
afterEach(() => {
  cleanup();
});
```

#### `setupAutoCleanup()`

Automatically cleanup after each test:

```typescript
import { setupAutoCleanup } from 'pulsar/testing';

setupAutoCleanup();
```

### Queries

#### `screen`

Global queries on `document.body`:

```typescript
const button = screen.getByRole('button');
const heading = screen.getByText('Welcome');
const input = screen.getByLabelText('Email');
```

#### Query Types

All queries support these patterns:

- `getBy*` - Returns element or throws
- `getAllBy*` - Returns array or throws
- `queryBy*` - Returns element or null
- `queryAllBy*` - Returns array (empty if none)

#### `getByRole(role, options?)`

Query by ARIA role (explicit or implicit):

```typescript
screen.getByRole('button');
screen.getByRole('textbox');
screen.getByRole('heading', { level: 1 });
```

**Supported roles:**

- `button`, `link`, `heading`, `textbox`
- `checkbox`, `radio`, `img`
- `list`, `listitem`, `navigation`
- `main`, `article`, `section`, `form`

#### `getByLabelText(text, options?)`

Query by associated label:

```typescript
screen.getByLabelText('Email');
screen.getByLabelText(/email/i);
```

#### `getByText(text, options?)`

Query by text content:

```typescript
screen.getByText('Submit');
screen.getByText(/submit/i);
screen.getByText('Exact match', { exact: true });
```

#### `getByTestId(testId, options?)`

Query by `data-testid`:

```typescript
screen.getByTestId('submit-button');
```

### Events

#### `fireEvent`

Fire DOM events on elements:

```typescript
import { fireEvent } from 'pulsar/testing';

fireEvent.click(button);
fireEvent.change(input, 'new value');
fireEvent.focus(input);
fireEvent.blur(input);
fireEvent.submit(form);
```

#### `click(element, options?)`

```typescript
const button = screen.getByRole('button');
fireEvent.click(button);
```

#### `change(element, value)`

```typescript
const input = screen.getByRole('textbox');
fireEvent.change(input, 'hello@example.com');
```

#### `type(element, text)`

Types text character by character:

```typescript
const input = screen.getByRole('textbox');
fireEvent.type(input, 'Hello World');
```

#### `keyboard(element, key, options?)`

```typescript
fireEvent.keyboard(input, 'Enter', { type: 'keydown' });
```

### Async Utilities

#### `waitFor(callback, options?)`

Wait for a condition to be true:

```typescript
await waitFor(
  () => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  },
  { timeout: 2000, interval: 100 }
);
```

**Options:**

- `timeout` - Max wait time (default: 1000ms)
- `interval` - Check interval (default: 50ms)
- `onTimeout` - Callback on timeout

#### `waitForElement(callback, options?)`

Wait for an element to appear:

```typescript
const element = await waitForElement(() => screen.queryByText('Success'));
```

#### `waitForElementToBeRemoved(callback, options?)`

Wait for an element to disappear:

```typescript
await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));
```

#### `act(callback)`

Wrap state updates:

```typescript
await act(async () => {
  fireEvent.click(button);
});
```

#### `waitForStateUpdate()`

Wait for reactive state to update:

```typescript
fireEvent.click(button);
await waitForStateUpdate();
expect(screen.getByText('Updated')).toBeInTheDocument();
```

### Mocking

#### `mockService(token, implementation)`

Mock a DI service:

```typescript
const mock = mockService('userService', {
  getUser: () => ({ id: 1, name: 'John' }),
});

// Later: restore
mock.restore();
```

#### `createSpy(implementation?)`

Create a spy function:

```typescript
const onClick = createSpy();
render(Button, { props: { onClick } });

fireEvent.click(screen.getByRole('button'));

expect(onClick.callCount).toBe(1);
expect(onClick.calls[0]).toEqual([]);
```

#### `mockRouter(options?)`

Mock the router:

```typescript
const router = mockRouter({
  initialPath: '/dashboard',
  routes: [{ path: '/', component: Home }],
});

router.instance.navigate('/profile');
expect(router.instance.path).toBe('/profile');

router.restore();
```

#### `mockFetch(responses)`

Mock fetch requests:

```typescript
mockFetch({
  '/api/users': {
    data: [{ id: 1, name: 'John' }],
    status: 200,
  },
});

const response = await fetch('/api/users');
const users = await response.json();
```

#### `mockLocalStorage()`

Mock localStorage:

```typescript
const storage = mockLocalStorage();
storage.setItem('key', 'value');
expect(storage.getItem('key')).toBe('value');
```

## Complete Examples

### Testing a Form

```typescript
import { render, screen, fireEvent, waitFor } from 'pulsar/testing';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('submits form with user input', async () => {
    const onSubmit = createSpy();
    render(LoginForm, { props: { onSubmit } });

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(emailInput, 'user@example.com');
    fireEvent.change(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit.callCount).toBe(1);
      expect(onSubmit.calls[0][0]).toEqual({
        email: 'user@example.com',
        password: 'password123',
      });
    });
  });
});
```

### Testing Async Data Loading

```typescript
import { render, screen, waitFor } from 'pulsar/testing';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('loads and displays user data', async () => {
    mockFetch({
      '/api/user/1': {
        data: { id: 1, name: 'John Doe' },
      },
    });

    render(UserProfile, { props: { userId: 1 } });

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### Testing with Context

```typescript
import { render, screen, mockContext } from 'pulsar/testing';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('toggles theme', async () => {
    const theme = { current: 'light' };
    const wrapper = mockContext(theme);

    render(ThemeToggle, { wrapper });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(theme.current).toBe('dark');
    });
  });
});
```

### Testing Router Navigation

```typescript
import { render, screen, fireEvent, mockRouter } from 'pulsar/testing';
import { Navigation } from './Navigation';

describe('Navigation', () => {
  it('navigates on link click', async () => {
    const router = mockRouter({ initialPath: '/' });

    render(Navigation);

    const link = screen.getByText('About');
    fireEvent.click(link);

    await waitFor(() => {
      expect(router.instance.path).toBe('/about');
    });

    router.restore();
  });
});
```

## Best Practices

### 1. Query by Role/Label (Not Implementation)

```typescript
// ✅ Good
screen.getByRole('button');
screen.getByLabelText('Email');

// ❌ Avoid
screen.getByTestId('button-123');
container.querySelector('.submit-button');
```

### 2. Wait for Async Changes

```typescript
// ✅ Good
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// ❌ Avoid
expect(screen.getByText('Loaded')).toBeInTheDocument();
```

### 3. Clean Up After Tests

```typescript
import { setupAutoCleanup } from 'pulsar/testing';

setupAutoCleanup(); // Automatic cleanup
```

### 4. Test User Behavior

```typescript
// ✅ Good - Tests user interaction
fireEvent.click(screen.getByRole('button'));
await waitFor(() => screen.getByText('Success'));

// ❌ Avoid - Tests implementation
component.handleClick();
```

### 5. Use Semantic Queries

```typescript
// ✅ Good - Accessible
screen.getByRole('button', { name: /submit/i });

// 🟡 OK - Less robust
screen.getByText('Submit');

// ❌ Avoid - Implementation detail
screen.getByTestId('submit-btn');
```

## Troubleshooting

### Element Not Found

```typescript
// Check what's rendered
render(Component);
screen.debug(); // Logs HTML

// Use query* instead of get*
const element = screen.queryByText('Missing');
expect(element).toBeNull();
```

### Timeout Errors

```typescript
// Increase timeout
await waitFor(
  () => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  },
  { timeout: 5000 }
);

// Check async timing
await waitForStateUpdate();
```

### Act Warnings

```typescript
// Wrap state updates in act()
await act(async () => {
  fireEvent.click(button);
});
```

## Integration with Test Frameworks

### Vitest

```typescript
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from 'pulsar/testing';

afterEach(cleanup);

describe('Component', () => {
  it('works', () => {
    render(Component);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Jest

```typescript
import { render, screen, setupAutoCleanup } from 'pulsar/testing';

setupAutoCleanup();

test('component renders', () => {
  render(Component);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

## Contributing

To add new testing utilities, see [CONTRIBUTING.md](../../CONTRIBUTING.md).
