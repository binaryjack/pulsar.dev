/**
 * GetChildren method for ElementRegistry
 * Returns all child element IDs for a given parent
 */
import type { IElementRegistry } from '../element-registry.types';
export declare function getChildren(this: IElementRegistry, parentId: string): string[];
