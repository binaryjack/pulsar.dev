/**
 * Waiting Component Types
 * 
 * Suspense-like component for rendering loading states while
 * async resources are fetching.
 */

/**
 * Props for Waiting component
 */
export interface IWaitingProps {
    /**
     * Default fallback UI shown while loading
     */
    default: HTMLElement;
    
    /**
     * Content to show when loading completes
     * Can be a single element or array
     */
    children: HTMLElement | HTMLElement[];
}
