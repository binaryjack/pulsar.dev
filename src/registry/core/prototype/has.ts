/**
 * Has method for ElementRegistry
 * Checks if an element is registered
 */
import type { IElementRegistry } from '../element-registry.types';

export function has(this: IElementRegistry, id: string): boolean {
  return this.registry.has(id);
}
