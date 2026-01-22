/**
 * Control flow component types for pulsar
 */

/**
 * Show component props
 * Conditionally renders children based on when condition
 */
export interface IShowProps {
  /**
   * Condition to determine visibility
   * Can be a boolean or a function returning boolean
   */
  when: boolean | (() => boolean);

  /**
   * Fallback content when condition is false
   */
  fallback?: HTMLElement | (() => HTMLElement);

  /**
   * Content to show when condition is true
   */
  children: HTMLElement | (() => HTMLElement);
}

/**
 * For component props
 * Renders a list of items with efficient reconciliation
 */
export interface IForProps<T> {
  /**
   * Array of items or function returning array
   */
  each: T[] | (() => T[]);

  /**
   * Function to extract unique key from item
   * Used for efficient reconciliation
   */
  key?: (item: T, index: number) => string | number;

  /**
   * Render function for each item
   */
  children: (item: T, index: () => number) => HTMLElement;

  /**
   * Fallback content when array is empty
   */
  fallback?: HTMLElement | (() => HTMLElement);
}

/**
 * Internal state for For component
 */
export interface IForState<_T = unknown> {
  /**
   * Map of key to DOM node
   */
  items: Map<string | number, HTMLElement>;

  /**
   * Container element
   */
  container: HTMLElement;

  /**
   * Cleanup functions for each item
   */
  cleanups: Map<string | number, () => void>;
}

/**
 * Index component props
 * Non-keyed list rendering with item-as-signal pattern
 */
export interface IIndexProps<T> {
  /**
   * Array of items or function returning array
   */
  each: T[] | (() => T[]);

  /**
   * Render function for each item
   * Item is wrapped in a signal, index is a stable number
   */
  children: (item: () => T, index: number) => HTMLElement;

  /**
   * Fallback content when array is empty
   */
  fallback?: HTMLElement | (() => HTMLElement);
}

/**
 * Internal state for Index component
 */
export interface IIndexState<T> {
  /**
   * Map of index to DOM node
   */
  items: Map<number, HTMLElement>;

  /**
   * Map of index to item signal
   */
  signals: Map<number, () => T>;

  /**
   * Container element
   */
  container: HTMLElement;

  /**
   * Cleanup functions for each index
   */
  cleanups: Map<number, () => void>;
}

/**
 * Component type - can be a function or string identifier
 */
export type ComponentType<P = any> = ((props: P) => HTMLElement) | string;

/**
 * Dynamic component props
 * Runtime component selection and resolution
 */
export interface IDynamicProps<P = any> {
  /**
   * Component to render - can be function or string
   * If string, will attempt to resolve from registry
   */
  readonly component: ComponentType<P> | (() => ComponentType<P>);

  /**
   * Props to forward to the resolved component
   */
  readonly [key: string]: any;
}

/**
 * Internal state for Dynamic component
 */
export interface IDynamicState {
  /**
   * Current component being rendered
   */
  currentComponent: ComponentType | null;

  /**
   * Currently rendered element
   */
  currentElement: HTMLElement | null;

  /**
   * Container element
   */
  container: HTMLElement;
}

/**
 * Component registry for string-based resolution
 */
export interface IComponentRegistry {
  /**
   * Register a component
   */
  register(name: string, component: (props: any) => HTMLElement): void;

  /**
   * Resolve a component by name
   */
  resolve(name: string): ((props: any) => HTMLElement) | undefined;

  /**
   * Check if component exists
   */
  has(name: string): boolean;

  /**
   * Clear all registered components
   */
  clear(): void;
}
