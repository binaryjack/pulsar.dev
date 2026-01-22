# Dynamic Component

Runtime component selection and rendering for dynamic UIs.

## Overview

The `Dynamic` component allows you to render different components at runtime based on data or state. It supports both function components and string-based resolution through a registry.

## Basic Usage

### Function Components

```typescript
import { Dynamic } from 'pulsar';

// Simple function component
const Button = (props: { text: string }) => {
  const el = document.createElement('button');
  el.textContent = props.text;
  return el;
};

// Render directly
Dynamic({
  component: Button,
  text: 'Click me',
});
```

### Component Maps

```typescript
const Button = (props: { text: string }) => {
  const el = document.createElement('button');
  el.textContent = props.text;
  return el;
};

const Link = (props: { text: string }) => {
  const el = document.createElement('a');
  el.textContent = props.text;
  return el;
};

const componentMap = {
  button: Button,
  link: Link,
};

const [type, setType] = createSignal<'button' | 'link'>('button');

// Dynamic selection from map
Dynamic({
  component: () => componentMap[type()],
  text: 'Interactive',
});

// Change component type
setType('link'); // Switches to Link component
```

### String-Based Resolution

```typescript
import { Dynamic, componentRegistry } from 'pulsar';

// Register components
componentRegistry.register('Button', Button);
componentRegistry.register('Link', Link);
componentRegistry.register('Card', Card);

// Use by string name
Dynamic({
  component: 'Button',
  text: 'Click me',
});

// With signals
const [componentName, setComponentName] = createSignal('Button');

Dynamic({
  component: componentName,
  text: 'Dynamic',
});

setComponentName('Link'); // Switches component
```

## Advanced Patterns

### Conditional Component Selection

```typescript
const [isButton, setIsButton] = createSignal(true);

Dynamic({
  component: () => (isButton() ? Button : Link),
  text: 'Toggle me',
});
```

### Data-Driven Components

```typescript
interface Item {
  type: 'text' | 'image' | 'video';
  content: string;
}

const componentMap = {
  text: TextComponent,
  image: ImageComponent,
  video: VideoComponent,
};

const [item, setItem] = createSignal<Item>({
  type: 'text',
  content: 'Hello',
});

Dynamic({
  component: () => componentMap[item().type],
  content: item().content,
});
```

### Form Field Selector

```typescript
const fieldComponents = {
  text: TextField,
  number: NumberField,
  email: EmailField,
  select: SelectField,
  checkbox: CheckboxField,
};

const [fieldType, setFieldType] = createSignal('text');

Dynamic({
  component: () => fieldComponents[fieldType()],
  label: 'Dynamic Field',
  value: fieldValue(),
  onChange: handleChange,
});
```

## Component Registry API

### register()

Register a component with a string identifier:

```typescript
componentRegistry.register('Button', ButtonComponent);
componentRegistry.register('Card', CardComponent);
```

### resolve()

Resolve a component by name:

```typescript
const Button = componentRegistry.resolve('Button');
if (Button) {
  const element = Button({ text: 'Click me' });
}
```

### has()

Check if component is registered:

```typescript
if (componentRegistry.has('Button')) {
  // Use Button component
}
```

### clear()

Clear all registered components:

```typescript
componentRegistry.clear(); // Usually for testing
```

## Props Forwarding

All props except `component` are forwarded to the rendered component:

```typescript
Dynamic({
  component: MyComponent,
  title: 'Hello', // Forwarded
  value: 42, // Forwarded
  onClick: handler, // Forwarded
  className: 'btn', // Forwarded
});
```

## Error Handling

### Component Not Found

When a string component can't be resolved:

```typescript
Dynamic({
  component: 'NonExistent', // Warning displayed
  text: 'Test',
});
// Shows: ⚠️ Component Not Found
```

### Rendering Errors

When a component throws during render:

```typescript
const ErrorComponent = () => {
  throw new Error('Oops!');
};

Dynamic({
  component: ErrorComponent, // Error displayed
});
// Shows: ⚠️ Dynamic Component Error
```

## TypeScript Support

### Typed Props

```typescript
interface ButtonProps {
  text: string;
  onClick?: () => void;
}

const Button = (props: ButtonProps) => {
  const el = document.createElement('button');
  el.textContent = props.text;
  if (props.onClick) {
    el.onclick = props.onClick;
  }
  return el;
};

// Type-safe usage
Dynamic<ButtonProps>({
  component: Button,
  text: 'Click me',
  onClick: () => console.log('Clicked'),
});
```

### Component Type

```typescript
import type { ComponentType } from 'pulsar';

const Button: ComponentType<ButtonProps> = (props) => {
  // Implementation
};
```

## Performance

- **Component Switching**: Only re-renders when component changes
- **Prop Forwarding**: Props are not reactive (passed once per component)
- **DOM Reuse**: Old component is removed, new one created
- **Memory**: Previous component cleaned up automatically

## When to Use

Use `Dynamic` when:

- ✅ Component type changes based on data
- ✅ Building configurable UIs
- ✅ Rendering from component dictionaries
- ✅ Form builders with dynamic field types

Don't use `Dynamic` when:

- ❌ Component is always the same (just render directly)
- ❌ Simple conditional (use `Show` instead)
- ❌ List rendering (use `For` or `Index`)

## Comparison with Show

| Feature     | Dynamic             | Show                 |
| ----------- | ------------------- | -------------------- |
| Purpose     | Select component    | Show/hide content    |
| Use case    | Multiple components | True/false condition |
| Input       | Function/string     | Boolean              |
| Performance | Component switch    | Toggle visibility    |

## Examples

### Widget Dashboard

```typescript
interface Widget {
  id: string;
  type: 'chart' | 'table' | 'card';
  data: any;
}

const widgetComponents = {
  chart: ChartWidget,
  table: TableWidget,
  card: CardWidget,
};

function WidgetRenderer(props: { widget: Widget }) {
  return Dynamic({
    component: () => widgetComponents[props.widget.type],
    data: props.widget.data,
  });
}
```

### Modal Content Switcher

```typescript
const modalContent = {
  login: LoginForm,
  signup: SignupForm,
  forgot: ForgotPasswordForm,
};

const [modalType, setModalType] = createSignal<keyof typeof modalContent>('login');

Dynamic({
  component: () => modalContent[modalType()],
  onClose: closeModal,
});
```

### Dynamic Icon Renderer

```typescript
componentRegistry.register('IconCheck', CheckIcon);
componentRegistry.register('IconX', XIcon);
componentRegistry.register('IconInfo', InfoIcon);

function StatusIcon(props: { status: string }) {
  const iconMap: Record<string, string> = {
    success: 'IconCheck',
    error: 'IconX',
    info: 'IconInfo',
  };

  return Dynamic({
    component: iconMap[props.status],
    size: 24,
  });
}
```

## API Reference

### Dynamic(props)

**Props:**

- `component: ComponentType | (() => ComponentType)` - Component to render
- `...props: any` - Props forwarded to component

**Returns:**

- `HTMLElement` - Container with rendered component

### ComponentType

```typescript
type ComponentType<P = any> = ((props: P) => HTMLElement) | string;
```

### componentRegistry

```typescript
interface IComponentRegistry {
  register(name: string, component: (props: any) => HTMLElement): void;
  resolve(name: string): ((props: any) => HTMLElement) | undefined;
  has(name: string): boolean;
  clear(): void;
}
```

## See Also

- [Show Component](../show.ts) - Conditional rendering
- [For Component](../for.ts) - Keyed list rendering
- [Index Component](../index/) - Non-keyed list rendering
