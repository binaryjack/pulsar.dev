/**
 * Catcher Component
 * 
 * Sub-component that renders caught errors with optional retry functionality.
 * Must be used inside a Tryer component.
 */

import { getActiveErrorBoundary } from './error-boundary-context-manager'
import { ICatcherProps, IErrorBoundaryContext, IErrorInfo } from './error-boundary.types'
import { resetTryer } from './tryer'

/**
 * Creates a Catcher component that displays error information
 * 
 * Must be used within a Tryer component to access error context.
 * 
 * @param props - Catcher props with optional custom renderer
 * @returns Error display element
 * 
 * @example
 * ```typescript
 * Tryer({
 *   children: [
 *     Catcher({ showRetry: true }),
 *     riskyComponent()
 *   ]
 * })
 * ```
 */
export function Catcher(props: ICatcherProps = {}): HTMLElement {
    const container = document.createElement('div');
    container.setAttribute('data-catcher', 'true');
    
    // Get current error boundary
    const errorBoundary = getActiveErrorBoundary();
    
    if (!errorBoundary) {
        // No error boundary found - show warning
        if (process.env.NODE_ENV !== 'production') {
            console.warn('Catcher must be used inside a Tryer component');
        }
        container.textContent = 'Catcher requires Tryer parent';
        return container;
    }
    
    // Render error if boundary has error
    if (errorBoundary.hasError && errorBoundary.errorInfo) {
        renderError(container, errorBoundary.errorInfo, props);
    } else {
        // No error - render nothing
        container.style.display = 'none';
    }
    
    // Store error boundary reference for updates
    Object.defineProperty(container, '__errorBoundary', {
        value: errorBoundary,
        writable: false,
        enumerable: false,
        configurable: false
    });
    
    return container;
}

/**
 * Renders error information
 */
function renderError(
    container: HTMLElement,
    errorInfo: IErrorInfo,
    props: ICatcherProps
): void {
    // Clear container
    container.innerHTML = '';
    container.style.display = 'block';
    
    // Use custom renderer if provided
    if (props.render) {
        const customElement = props.render(errorInfo);
        container.appendChild(customElement);
        return;
    }
    
    // Default error rendering
    const errorDisplay = document.createElement('div');
    errorDisplay.style.padding = '16px';
    errorDisplay.style.border = '1px solid #ffcccc';
    errorDisplay.style.borderRadius = '4px';
    errorDisplay.style.backgroundColor = '#fff5f5';
    errorDisplay.style.marginBottom = '16px';
    
    // Error icon and title
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.marginBottom = '8px';
    
    const icon = document.createElement('span');
    icon.textContent = '⚠️';
    icon.style.fontSize = '24px';
    icon.style.marginRight = '8px';
    
    const title = document.createElement('h4');
    title.textContent = 'An error occurred';
    title.style.margin = '0';
    title.style.color = '#cc0000';
    
    header.appendChild(icon);
    header.appendChild(title);
    
    // Error message
    const message = document.createElement('pre');
    message.textContent = errorInfo.error.message;
    message.style.margin = '8px 0';
    message.style.padding = '8px';
    message.style.backgroundColor = '#ffffff';
    message.style.border = '1px solid #ffdddd';
    message.style.borderRadius = '4px';
    message.style.fontSize = '13px';
    message.style.overflow = 'auto';
    
    errorDisplay.appendChild(header);
    errorDisplay.appendChild(message);
    
    // Show component name if available
    if (errorInfo.componentName) {
        const componentInfo = document.createElement('p');
        componentInfo.textContent = `Component: ${errorInfo.componentName}`;
        componentInfo.style.fontSize = '12px';
        componentInfo.style.color = '#666';
        componentInfo.style.margin = '4px 0';
        errorDisplay.appendChild(componentInfo);
    }
    
    container.appendChild(errorDisplay);
    
    // Add retry button if enabled
    if (props.showRetry !== false) {
        const retryButton = createRetryButton(container);
        container.appendChild(retryButton);
    }
}

/**
 * Creates retry button
 */
function createRetryButton(container: HTMLElement): HTMLElement {
    const button = document.createElement('button');
    button.textContent = '🔄 Retry';
    button.style.padding = '8px 16px';
    button.style.backgroundColor = '#0066cc';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    
    button.addEventListener('click', () => {
        // Find parent Tryer container
        const tryerContainer = findParentTryer(container);
        if (tryerContainer) {
            resetTryer(tryerContainer);
        }
    });
    
    return button;
}

/**
 * Finds parent Tryer container
 */
function findParentTryer(element: HTMLElement): HTMLElement | null {
    let current = element.parentElement;
    while (current) {
        if (current.getAttribute('data-error-boundary') === 'true') {
            return current;
        }
        current = current.parentElement;
    }
    return null;
}

/**
 * Update Catcher to reflect current error state
 * 
 * @param container - Catcher container element
 */
export function updateCatcher(container: HTMLElement): void {
    const errorBoundary = (container as { __errorBoundary?: IErrorBoundaryContext }).__errorBoundary;
    if (!errorBoundary) return;
    
    if (errorBoundary.hasError && errorBoundary.errorInfo) {
        container.style.display = 'block';
        renderError(container, errorBoundary.errorInfo, {});
    } else {
        container.style.display = 'none';
        container.innerHTML = '';
    }
}
