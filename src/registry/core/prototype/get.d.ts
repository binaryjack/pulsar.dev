/**
 * Get method for ElementRegistry
 * Retrieves an element entry by ID
 */
import type { IElementEntry } from '../../types';
import type { IElementRegistry } from '../element-registry.types';
export declare function get(this: IElementRegistry, id: string): IElementEntry | undefined;
