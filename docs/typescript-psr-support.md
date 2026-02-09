# TypeScript Support for .psr Files

**Automatic type declarations for seamless PSR component imports**

---

## Overview

Pulsar's `.psr` files use a simplified component syntax where `export component` automatically exports components without requiring explicit `export` statements. This document explains how TypeScript support works.

---

## How It Works

### The Challenge

`.psr` files are transformed at build time by the Vite plugin:

```psr
// MyComponent.psr
export component MyComponent() {
  return <div>Hello</div>;
}
```

**Transforms to:**

```typescript
export function MyComponent() {
  return /* ... DOM manipulation code ... */;
}
```

TypeScript's language server checks types **before** this transformation happens, so it needs to know what exports to expect from `.psr` files.

---

## The Solution

### Automatic Type Declarations

When you install `@pulsar-framework/pulsar.dev`, TypeScript support for `.psr` files is **automatically included**. No configuration needed!

**What's provided:**

```typescript
declare module '*.psr' {
  // Default export (single component files)
  const component: (...args: any[]) => HTMLElement;
  export default component;

  // Named exports (any component name allowed)
  export const [key: string]: (...args: any[]) => HTMLElement;
}
```

This declaration tells TypeScript:

- ✅ Any `.psr` file can be imported
- ✅ Any function name can be imported from a `.psr` file
- ✅ Components return `HTMLElement` instances
- ✅ Components can accept any props via `(...args: any[])`

---

## Usage Examples

### Example 1: Single Component (Named Export)

```psr
// Counter.psr
export component Counter(props: { initialCount: number }) {
  const [count, setCount] = createSignal(props.initialCount);
  return <button onClick={() => setCount(c => c + 1)}>
    Count: {count()}
  </button>;
}
```

**Import:**

```typescript
import { Counter } from './Counter.psr';

const counterElement = Counter({ initialCount: 0 });
pulse(counterElement);
```

✅ **No TypeScript errors**

---

### Example 2: Single Component (Default Export)

```psr
// App.psr
export component App() {
  return <div>My App</div>;
}
```

**Import (both work):**

```typescript
// Option 1: Named import
import { App } from './App.psr';

// Option 2: Default import
import App from './App.psr';
```

✅ **No TypeScript errors**

---

### Example 3: Multiple Components

```psr
// UIComponents.psr
export component Button(props: { label: string }) {
  return <button>{props.label}</button>;
}

export component Input(props: { placeholder: string }) {
  return <input type="text" placeholder={props.placeholder} />;
}

export component Card(props: { title: string, children: HTMLElement }) {
  return <div class="card">
    <h3>{props.title}</h3>
    {props.children}
  </div>;
}
```

**Import:**

```typescript
import { Button, Input, Card } from './UIComponents.psr';

const btn = Button({ label: 'Submit' });
const input = Input({ placeholder: 'Enter name' });
const card = Card({ title: 'Profile', children: input });
```

✅ **No TypeScript errors**

---

## How It Works Behind the Scenes

### 1. Framework Package Includes Types

The `@pulsar-framework/pulsar.dev` package includes `src/types/psr-modules.d.ts`:

```typescript
/// <reference path="./types/psr-modules.d.ts" />
```

This is automatically loaded when you import from the framework.

---

### 2. Vite Plugin Fallback (Optional)

The `@pulsar-framework/vite-plugin` has a **fallback mechanism**:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    pulsar({
      autoCreateTypes: true, // Default: true
    }),
  ],
});
```

**What it does:**

- Checks if `src/types/psr-modules.d.ts` exists
- If missing, creates it automatically
- Logs a friendly message

**When it runs:**

- First time you run `vite dev` or `vite build`
- Only if the file doesn't already exist

**Output:**

```
[pulsar] ✅ Created PSR type declarations: src/types/psr-modules.d.ts
[pulsar] 💡 This enables TypeScript support for .psr file imports
```

---

### 3. TypeScript Configuration

Your `tsconfig.json` needs to include the types directory:

```json
{
  "compilerOptions": {
    "types": ["@pulsar-framework/pulsar.dev"],
    "jsx": "preserve",
    "jsxImportSource": "@pulsar-framework/pulsar.dev"
  },
  "include": ["src/**/*"]
}
```

**Note:** The `"types"` field is usually **not required** - TypeScript finds types automatically from installed packages. Only add if you're having issues.

---

## Troubleshooting

### Error: "Module '\*.psr' has no exported member 'MyComponent'"

**Cause:** TypeScript can't find the PSR type declarations.

**Solutions:**

#### Solution 1: Rebuild the framework

```bash
cd packages/pulsar.dev
pnpm build
```

#### Solution 2: Manually create the types file

```bash
mkdir -p src/types
```

Create `src/types/psr-modules.d.ts`:

```typescript
declare module '*.psr' {
  const component: (...args: any[]) => HTMLElement;
  export default component;
  export const [key: string]: (...args: any[]) => HTMLElement;
}
```

#### Solution 3: Restart TypeScript server

In VS Code:

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "TypeScript: Restart TS Server"
3. Press Enter

#### Solution 4: Check tsconfig.json

Ensure `src/types` is included:

```json
{
  "include": ["src/**/*", "src/types/**/*"]
}
```

---

### Error: "Cannot find module '\*.psr'"

**Cause:** TypeScript can't resolve `.psr` file paths.

**Solution:** Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": false
  }
}
```

---

### Vite Plugin Not Creating Types

**Cause:** File already exists or auto-creation is disabled.

**Check:**

1. Look for `src/types/psr-modules.d.ts` - if it exists, that's fine
2. Check `vite.config.ts`:
   ```typescript
   pulsar({
     autoCreateTypes: true, // Make sure this is true
     debug: true, // Enable to see what's happening
   });
   ```

---

## Advanced: Customizing Type Declarations

### Add Stronger Typing

If you want better type safety, you can customize the generated file:

```typescript
// src/types/psr-modules.d.ts
declare module '*.psr' {
  // More specific return type
  export const [key: string]: <P = unknown>(props?: P) => HTMLElement;
}
```

### Type-Safe Component Props

For specific components with known props:

```typescript
// src/types/components.d.ts
declare module './Counter.psr' {
  export function Counter(props: { initialCount: number }): HTMLElement;
}

declare module './Button.psr' {
  export function Button(props: { label: string; onClick: () => void }): HTMLElement;
}
```

**Trade-off:** More type safety, but requires manual maintenance.

---

## Comparison: Before vs After

### ❌ Without Type Declarations

```typescript
import { MyComponent } from './MyComponent.psr';
//      ^^^^^^^^^^^ ERROR: Module '*.psr' has no exported member 'MyComponent'
```

### ✅ With Type Declarations

```typescript
import { MyComponent } from './MyComponent.psr';
// ✅ No errors, full IntelliSense support
```

---

## Feature Matrix

| Feature              | Support    | Notes                                     |
| -------------------- | ---------- | ----------------------------------------- |
| **Named imports**    | ✅ Full    | `import { Component } from './file.psr'`  |
| **Default imports**  | ✅ Full    | `import Component from './file.psr'`      |
| **Multiple exports** | ✅ Full    | Multiple `export component` in one file   |
| **Prop typing**      | ⚠️ Generic | Props are `any[]`, can be customized      |
| **Return type**      | ✅ Typed   | Always `HTMLElement`                      |
| **Autocomplete**     | ⚠️ Partial | Component names autocomplete, props don't |
| **Error checking**   | ✅ Full    | No red squiggles on valid imports         |

---

## FAQ

### Q: Do I need to configure anything?

**A:** No! Just install `@pulsar-framework/pulsar.dev` and it works.

---

### Q: Why is everything `any`?

**A:** Because `.psr` files don't have their types extracted yet. This is intentional to avoid build-time complexity. Future versions may add type extraction.

---

### Q: Can I get autocomplete for component props?

**A:** Not automatically. You can manually type components in `src/types/components.d.ts` if needed (see Advanced section).

---

### Q: What if I don't want auto-created types?

**A:** Disable in Vite config:

```typescript
pulsar({
  autoCreateTypes: false,
});
```

The framework types will still work.

---

### Q: Does this work with monorepos?

**A:** Yes! Each package gets its own type declarations. The framework types are available workspace-wide via `node_modules`.

---

### Q: What about SSR/build mode?

**A:** Works identically. Types are checked at author-time (in your editor), not at build time.

---

## File Locations

### Framework (Always Available)

```
node_modules/@pulsar-framework/pulsar.dev/
└── dist/
    ├── index.d.ts                    # Includes psr-modules reference
    └── types/
        └── psr-modules.d.ts          # PSR declarations
```

### Project (Auto-Created Fallback)

```
your-project/
└── src/
    └── types/
        └── psr-modules.d.ts          # Created by Vite plugin if needed
```

---

## Summary

✅ **Zero configuration** - Works out of the box with framework installation

✅ **Automatic fallback** - Vite plugin creates local types if needed

✅ **Flexible** - Can customize for stronger typing if desired

✅ **No red squiggles** - Import any component from any `.psr` file

✅ **Type safe** - Returns are always `HTMLElement`

⚠️ **Generic props** - Props are `any[]` by default (can be customized)

---

## Related Documentation

- [Pulse API Guide](./pulse-api.md)
- [Component Authoring](../../docs/components/authoring.md)
- [TypeScript Configuration](../../docs/typescript-setup.md)
- [Vite Plugin Options](../../packages/pulsar-vite-plugin/README.md)

---

**Last Updated:** 2026-02-09  
**Version:** 1.0.0
