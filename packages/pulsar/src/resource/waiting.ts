/**
 * Waiting Component
 * 
 * Suspense-like wrapper that shows fallback UI while resources load.
 * Automatically switches to children when loading completes.
 * 
 * Usage:
 * ```typescript
 * Waiting({
 *   default: Loading(),
 *   children: Content()
 * })
 * ```
 */

import { IWaitingProps } from './waiting.types'

/**
 * Creates a Waiting component that conditionally renders loading fallback
 * 
 * @param props - Waiting props with default and children
 * @returns Container element managing loading/content states
 */
export function Waiting(props: IWaitingProps): HTMLElement {
    const container = document.createElement('div');
    container.setAttribute('data-waiting', 'true');
    
    // Normalize children to array
    const childElements = Array.isArray(props.children) 
        ? props.children 
        : [props.children];
    
    // Initially show default (loading state)
    container.appendChild(props.default);
    
    // Store for later switching
    Object.defineProperty(container, '__waitingDefault', {
        value: props.default,
        writable: false,
        enumerable: false,
        configurable: false
    });
    
    Object.defineProperty(container, '__waitingChildren', {
        value: childElements,
        writable: false,
        enumerable: false,
        configurable: false
    });
    
    return container;
}

/**
 * Utility to transition Waiting container from loading to content
 * 
 * @param container - Waiting container element
 */
export function resolveWaiting(container: HTMLElement): void {
    const defaultEl = (container as never)['__waitingDefault'] as HTMLElement | undefined;
    const children = (container as never)['__waitingChildren'] as HTMLElement[] | undefined;
    
    if (!defaultEl || !children) {
        return;
    }
    
    // Remove loading fallback
    if (defaultEl.parentNode === container) {
        container.removeChild(defaultEl);
    }
    
    // Add content children
    children.forEach(child => {
        container.appendChild(child);
    });
    
    // Mark as resolved
    container.removeAttribute('data-waiting');
}

/**
 * Utility to transition Waiting container back to loading state
 * 
 * @param container - Waiting container element
 */
export function suspendWaiting(container: HTMLElement): void {
    const defaultEl = (container as never)['__waitingDefault'] as HTMLElement | undefined;
    const children = (container as never)['__waitingChildren'] as HTMLElement[] | undefined;
    
    if (!defaultEl || !children) {
        return;
    }
    
    // Remove content children
    children.forEach(child => {
        if (child.parentNode === container) {
            container.removeChild(child);
        }
    });
    
    // Restore loading fallback
    if (defaultEl.parentNode !== container) {
        container.appendChild(defaultEl);
    }
    
    // Mark as waiting
    container.setAttribute('data-waiting', 'true');
}
