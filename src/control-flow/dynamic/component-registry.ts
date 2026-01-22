/**
 * Component Registry
 * Global registry for string-based component resolution
 */

import type { IComponentRegistry } from './dynamic.types';

/**
 * Global component registry storage
 */
const registry = new Map<string, (props: any) => HTMLElement>();

/**
 * Component registry singleton
 */
export const componentRegistry: IComponentRegistry = {
  /**
   * Register a component with a string identifier
   *
   * @example
   * ```typescript
   * componentRegistry.register('Button', ButtonComponent);
   * componentRegistry.register('Card', CardComponent);
   * ```
   */
  register(name: string, component: (props: any) => HTMLElement): void {
    if (!name || typeof name !== 'string') {
      throw new Error('Component name must be a non-empty string');
    }
    if (typeof component !== 'function') {
      throw new Error('Component must be a function');
    }
    registry.set(name, component);
  },

  /**
   * Resolve a component by name
   *
   * @example
   * ```typescript
   * const Button = componentRegistry.resolve('Button');
   * if (Button) {
   *   const element = Button({ text: 'Click me' });
   * }
   * ```
   */
  resolve(name: string): ((props: any) => HTMLElement) | undefined {
    return registry.get(name);
  },

  /**
   * Check if component is registered
   *
   * @example
   * ```typescript
   * if (componentRegistry.has('Button')) {
   *   // Use Button component
   * }
   * ```
   */
  has(name: string): boolean {
    return registry.has(name);
  },

  /**
   * Clear all registered components
   * Useful for testing or cleanup
   */
  clear(): void {
    registry.clear();
  },
};
