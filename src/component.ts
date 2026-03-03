/**
 * Component factory
 *
 * Wraps a component function with:
 * - `displayName` — inferred from the function name for devtools and error messages
 * - `__pulsarComponent` marker — consumed by the Pulsar VS Code extension and
 *   the transformer diagnostics for component identity
 * - `__hmrId` — stable identifier used by the Vite HMR plugin to preserve state
 *   across hot-reloads without full page refresh
 *
 * @example
 * ```ts
 * export const Counter = component(function Counter({ initial = 0 }) {
 *   const [count, setCount] = createSignal(initial);
 *   return <button onClick={() => setCount(c => c + 1)}>{count()}</button>;
 * });
 * ```
 */

export type ComponentProps = Record<string, unknown>;

export interface IPulsarComponent<T extends ComponentProps = ComponentProps> {
  (props: T): unknown;
  displayName: string;
  __pulsarComponent: true;
  __hmrId: string;
}

/**
 * Derive a stable 53-bit hash from a string (FNV-1a variant).
 * Used to generate a consistent `__hmrId` across reloads.
 */
const stableHash = (str: string): string => {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(16);
};

export function component<T extends ComponentProps = ComponentProps>(
  fn: (props: T) => unknown
): IPulsarComponent<T> {
  const name = fn.name || 'Anonymous';

  const wrapped = function pulsarComponent(props: T): unknown {
    return fn(props);
  } as IPulsarComponent<T>;

  wrapped.displayName = name;
  wrapped.__pulsarComponent = true;
  // Stable across hot-reloads: hash of the function name + source length
  wrapped.__hmrId = stableHash(`${name}:${fn.toString().length}`);

  // Preserve the original function name in stack traces
  Object.defineProperty(wrapped, 'name', { value: name, configurable: true });

  return wrapped;
}
