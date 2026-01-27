/**
 * GetChildren method for ElementRegistry
 * Returns all child element IDs for a given parent
 */
import type { IElementRegistry } from '../element-registry.types';

export function getChildren(this: IElementRegistry, parentId: string): string[] {
  const children = this.parentChildren.get(parentId);
  return children ? Array.from(children) : [];
}
