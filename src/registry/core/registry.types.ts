/**
 * Core Registry Types
 * Global registry for managing component lifecycle, state, and reactivity
 */

import type { ISignal } from '../../reactivity/signal/signal.types';

/**
 * Component execution context
 */
export interface IComponentContext {
  readonly id: string;
  readonly parentId: string | null;
  provides: Record<string, unknown>;
}

/**
 * Wire disposal function
 */
export type WireDisposer = () => void;

/**
 * Wire subscription set for a DOM element
 */
export type WireSet = Set<WireDisposer>;

/**
 * Effect with children tracking for nested cleanup
 */
export interface IEffectOwner {
  _subs: Set<ISignal<unknown>>;
  _children: Set<IEffectOwner>;
  run(): void;
  cleanup(): void;
  dispose(): void;
}

/**
 * Global Registry Interface
 */
export interface ICoreRegistry {
  // Component context stack
  readonly _stack: IComponentContext[];

  // Signal storage for SSR
  readonly _signals: Map<string, ISignal<unknown>>;

  // DOM node to wire mappings
  readonly _nodes: WeakMap<Node, WireSet>;

  // Component instances
  readonly _instances: Map<string, IComponentContext>;

  // Hydration ID counter for SSR
  _hidCounter: number;

  // Effect owner stack for nested effect tracking
  readonly _ownerStack: IEffectOwner[];

  // Current effect being executed (for automatic dependency tracking)
  _currentEffect: IEffectOwner | null;

  // --- Lifecycle & Context Methods ---

  /**
   * Execute a component factory within a tracked context
   */
  execute<T>(id: string, parentId: string | null, factory: () => T): T;

  /**
   * Get the current component context
   */
  getCurrent(): IComponentContext | undefined;

  // --- Reactivity & Wiring Methods ---

  /**
   * Wire a signal or getter to a DOM property path
   * @param el - Target DOM element
   * @param path - Property path (e.g., "textContent" or "style.left")
   * @param source - Signal or getter function
   */
  wire(el: Element, path: string, source: ISignal<unknown> | (() => unknown)): WireDisposer;

  /**
   * Dispose all wire effects for a specific element
   * @param el - Element whose wires should be disposed
   */
  disposeElement(el: Element): void;

  /**
   * Recursively dispose wire effects for an element and all its descendants
   * @param rootElement - Root element of the tree to dispose
   */
  disposeTree(rootElement: Element): void;

  // --- Effect Owner Methods ---

  /**
   * Run a function within an effect owner scope
   */
  runInScope(owner: IEffectOwner, fn: () => void): void;

  /**
   * Get the current effect owner
   */
  getCurrentOwner(): IEffectOwner | undefined;

  // --- SSR & Hydration Methods ---

  /**
   * Generate next hydration ID
   */
  nextHid(): number;

  /**
   * Boot client-side signals with server state
   */
  boot(state: Record<string, unknown> | null): void;

  /**
   * Dump all signal values for SSR serialization
   */
  dump(): Record<string, unknown>;

  // --- Debug Methods ---

  /**
   * Enable debug mode
   */
  enableDebug(): void;

  /**
   * Disable debug mode
   */
  disableDebug(): void;

  /**
   * Get all active wires for debugging
   */
  getWires(): Array<{ element: HTMLElement; property: string; subscriptions: number }>;

  /**
   * Get component tree
   */
  getComponentTree(): Record<string, { id: string; parent: string | null; element: string }>;

  /**
   * Get all registered signals
   */
  getSignals(): Record<string, { id: string; value: any; type: string }>;

  /**
   * Get registry statistics
   */
  getStats(): {
    components: number;
    signals: number;
    stackDepth: number;
    ownerStackDepth: number;
    hidCounter: number;
  };

  /**
   * Log current registry state
   */
  logState(): void;

  /**
   * Reset registry state (for testing)
   */
  reset(): void;
}
