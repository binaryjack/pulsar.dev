/**
 * Dynamic Component Types
 * Runtime component selection and resolution
 */

/**
 * Component type - can be a function or string identifier
 */
export type ComponentType<P = any> = ((props: P) => HTMLElement) | string;

/**
 * Props for Dynamic component
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
