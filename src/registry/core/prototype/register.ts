/**
 * Register method for ElementRegistry
 * Registers an element with its metadata in the registry
 */
import type { IElementEntry } from '../../types';
import type { IElementRegistry } from '../element-registry.types';

export function register(
  this: IElementRegistry,
  id: string,
  element: HTMLElement,
  entry: IElementEntry
): void {
  // Validate inputs
  if (!id || typeof id !== 'string') {
    throw new Error('Element ID must be a non-empty string');
  }

  if (!(element instanceof HTMLElement)) {
    throw new Error('Element must be an HTMLElement instance');
  }

  // Check for duplicate ID
  if (this.registry.has(id)) {
    throw new Error(`Element with ID "${id}" is already registered`);
  }

  // Register entry
  this.registry.set(id, entry);

  // Create metadata entry
  this.metadata.set(element, {
    effects: new Set<() => void>(),
    signals: new Set(),
  });

  // Track parent-child relationship
  if (entry.parentId) {
    if (!this.parentChildren.has(entry.parentId)) {
      this.parentChildren.set(entry.parentId, new Set<string>());
    }
    this.parentChildren.get(entry.parentId)!.add(id);
  }
}
