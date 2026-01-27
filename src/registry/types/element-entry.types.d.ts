/**
 * Element entry interface
 * Represents an element registered in the element registry
 */
import { ElementType } from './element-type.enum';
export interface IElementEntry {
    /**
     * The actual DOM element
     */
    element: HTMLElement;
    /**
     * Parent element ID in the registry hierarchy
     */
    parentId?: string;
    /**
     * Physical parent element ID (for portals - where element is actually mounted)
     */
    physicalParent?: string;
    /**
     * Type of element
     */
    type: ElementType;
    /**
     * Index in parent's children array (for array items only)
     */
    index?: number;
    /**
     * Flag indicating if this element is portal content
     */
    isPortalContent?: boolean;
}
