/**
 * Size method for ElementRegistry
 * Returns the number of registered elements
 */
import type { IElementRegistry } from '../element-registry.types';

export function size(this: IElementRegistry): number {
  return this.registry.size;
}
