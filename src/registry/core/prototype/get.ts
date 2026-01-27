/**
 * Get method for ElementRegistry
 * Retrieves an element entry by ID
 */
import type { IElementEntry } from '../../types';
import type { IElementRegistry } from '../element-registry.types';

export function get(this: IElementRegistry, id: string): IElementEntry | undefined {
  return this.registry.get(id);
}
