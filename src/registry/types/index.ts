/**
 * Registry types barrel export
 */
export type { IElementEntry } from './element-entry.types';
export type { IElementMetadata } from './element-metadata.types';
export { ElementType } from './element-type.enum';

// Import HTMLElement augmentation to make it available globally
import './html-element.augment';
