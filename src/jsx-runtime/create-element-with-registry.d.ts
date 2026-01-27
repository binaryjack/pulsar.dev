/**
 * Registry-Enhanced createElement
 * Automatically registers elements with the Element Registry during creation
 */
import { ElementType } from '../registry/types/element-type.enum';
import type { JSXChild, JSXElementType, JSXKey, JSXProps } from './jsx-runtime.types';
/**
 * Registry context metadata (passed by transformer)
 */
export interface IRegistryContext {
    /** Parent element ID (from parent component) */
    parentId?: string;
    /** Index in parent's children array */
    index?: number;
    /** Element type classification */
    elementType?: ElementType;
}
/**
 * Create an element with automatic registry registration
 * This is the enhanced version used by the transformer
 */
export declare function createElementWithRegistry<P extends JSXProps = JSXProps>(type: JSXElementType<P>, props: P, registryCtx?: IRegistryContext, key?: JSXKey): HTMLElement;
/**
 * Append children to an element with registry tracking
 */
export declare function appendChildren(parent: HTMLElement, children: JSXChild | JSXChild[], parentId?: string): void;
/**
 * Create a text node with registry tracking
 * Used for dynamic text content
 */
export declare function createTextNode(content: string, parentId?: string): Text;
