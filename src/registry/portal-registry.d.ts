/**
 * Portal Registry Integration
 * Utilities for integrating Portal with Element Registry
 */
/**
 * Portal registration context
 */
export interface IPortalRegistrationContext {
    /** Parent element ID (logical hierarchy) */
    parentId?: string;
    /** Physical parent element ID (DOM location) */
    physicalParentId?: string;
    /** Portal content element */
    content: HTMLElement;
    /** Portal target container */
    target: HTMLElement;
}
/**
 * Register portal content with the registry
 * Returns the generated element ID and cleanup function
 */
export declare function registerPortalContent(ctx: IPortalRegistrationContext): {
    elementId: string;
    cleanup: () => void;
};
/**
 * Get logical parent ID for current portal context
 * Walks up the DOM to find parent with __elementId
 */
export declare function getLogicalParentId(element: HTMLElement): string | undefined;
/**
 * Get physical parent ID for portal target
 * Checks if target has __elementId
 */
export declare function getPhysicalParentId(target: HTMLElement): string | undefined;
