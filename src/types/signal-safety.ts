/**
 * TypeScript Helper Types for Pulsar Signal Safety
 *
 * These types help prevent signal function/value confusion at compile time
 */

/**
 * Marks a function as a Pulsar signal
 * This helps TypeScript and linters detect signal usage
 */
export interface SignalMarker {
  readonly __isSignal: true;
  readonly __isReactive: true;
}

/**
 * A Pulsar signal - a function that returns a value
 * When destructured in props, the value must be called with ()
 *
 * @example
 * const [count, setCount] = signal(0)
 * // count is Signal<number>
 *
 * // In JSX:
 * <Counter value={count()} />  // ✅ Pass the value
 * <Counter value={count} />    // ❌ Wrong - passes function
 */
export interface Signal<T> extends SignalMarker {
  (): T;
  [Symbol.iterator]?: () => Iterator<T>;
}

/**
 * Helper type to extract value from signal or passthrough for non-signals
 *
 * @example
 * type SignalOrValue<number | Signal<number>> = number
 * type SignalOrValue<string> = string
 */
export type SignalValue<T> = T extends Signal<infer U> ? U : T;

/**
 * Strict component props that prevent passing signal functions
 * Used to type component props so TypeScript catches uncalled signals
 *
 * @example
 * interface HeaderProps extends StrictProps {
 *   readonly sidebarOpen: boolean;  // NOT Signal<boolean>
 *   readonly onToggle: (open: boolean) => void;
 * }
 *
 * const Header: (props: HeaderProps) => HTMLElement = ({ sidebarOpen }) => {
 *   // sidebarOpen is already a boolean value
 *   return sidebarOpen ? <div>Open</div> : <div>Closed</div>
 * }
 */
export interface StrictProps {
  // Use readonly to prevent signal mutations
  readonly [key: string]: unknown;
}

/**
 * Component type that enforces strict prop values (not signal functions)
 *
 * @example
 * export const Header = StrictComponent<IHeaderProps>(({ sidebarOpen }) => {
 *   // ✅ TypeScript ensures sidebarOpen is boolean, not Signal<boolean>
 *   return sidebarOpen && <div>Open</div>
 * })
 */
export type StrictComponent<P extends StrictProps = StrictProps> = (
  props: P
) => HTMLElement | Node | DocumentFragment;

/**
 * Extract all signal properties from a component's signal source
 *
 * @example
 * const [sidebarOpen, setSidebarOpen] = signal(false)
 * const [activeCategory, setActiveCategory] = signal('overview')
 *
 * type AppSignals = SignalProps<{
 *   sidebarOpen: typeof sidebarOpen,
 *   activeCategory: typeof activeCategory,
 * }>
 * // Results in:
 * // {
 * //   sidebarOpen: () => boolean,
 * //   activeCategory: () => string,
 * // }
 */
export type SignalProps<T> = {
  [K in keyof T]: T[K] extends Signal<infer U> ? () => U : T[K];
};

/**
 * Component props resolved from signals (values only, not functions)
 *
 * @example
 * interface ResolvedProps {
 *   sidebarOpen: boolean;      // Signal<boolean> → boolean
 *   activeCategory: string;    // Signal<string> → string
 *   callback: () => void;      // Functions pass through
 * }
 */
export type ResolvedProps<T> = {
  [K in keyof T]: T[K] extends Signal<infer U> ? U : T[K];
};

/**
 * Runtime helper to ensure values are properly extracted from signals
 * Use in development to catch signal/value confusion
 *
 * @example
 * const headerProps = resolveSignalProps({
 *   sidebarOpen,      // Signal<boolean>
 *   onToggle: () => {}
 * })
 * // Returns { sidebarOpen: true|false, onToggle: () => {} }
 */
export function resolveSignalProps<T extends Record<string, any>>(props: T): ResolvedProps<T> {
  const resolved: any = {};

  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'function' && (value as any).__isSignal) {
      // Call signal to get value
      resolved[key] = (value as Signal<any>)();
    } else {
      resolved[key] = value;
    }
  }

  return resolved;
}

/**
 * Type-safe signal prop helper for component creation
 * Ensures props are values, not signal functions
 *
 * @example
 * type HeaderProps = SignalSafeProps<{
 *   sidebarOpen: boolean;
 *   activeCategory: string;
 * }>
 *
 * // Now TypeScript will error if you try to pass sidebarOpen (function)
 * // instead of sidebarOpen() (value)
 */
export type SignalSafeProps<T extends Record<string, any>> = {
  readonly [K in keyof T]: T[K] extends Signal<any>
    ? never // ← Error: signal function not allowed
    : T[K];
};
