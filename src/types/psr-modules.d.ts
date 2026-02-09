/**
 * TypeScript Module Declarations for Pulsar .psr Files
 *
 * This wildcard declaration allows importing any named export from .psr files.
 * The transformer converts `export component Foo()` to `export function Foo()`.
 *
 * @example Named exports (recommended)
 * ```typescript
 * // In MyComponents.psr
 * export component Button() { return <button>Click</button>; }
 * export component Input() { return <input />; }
 *
 * // In your .ts file
 * import { Button, Input } from './MyComponents.psr';
 * ```
 *
 * @example Single component
 * ```typescript
 * // In App.psr
 * export component App() { return <div>App</div>; }
 *
 * // In your .ts file
 * import { App } from './App.psr';
 * ```
 */

declare module '*.psr';
