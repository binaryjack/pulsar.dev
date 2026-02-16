/**
 * Tryer Component
 *
 * Error boundary wrapper that catches errors in child components
 * and displays fallback UI. Named "Tryer" following user's naming convention.
 */

import { DEV } from '../dev/dev.types';
import { createErrorBoundaryContext } from './create-error-boundary-context';
import { getActiveErrorBoundary, setActiveErrorBoundary } from './error-boundary-context-manager';
import { IErrorBoundaryContextInternal, IErrorInfo, ITryerProps } from './error-boundary.types';

/**
 * Creates a Tryer (error boundary) component that catches errors in children
 *
 * @param props - Tryer props with children and options
 * @returns Container element with error boundary protection
 *
 * @example
 * ```typescript
 * Tryer({
 *   children: riskyComponent(),
 *   options: {
 *     fallback: (errorInfo) => div({ textContent: `Error: ${errorInfo.error.message}` }),
 *     onError: (errorInfo) => logError(errorInfo)
 *   }
 * })
 * ```
 */
export function Tryer(props: ITryerProps): HTMLElement {
  const container = document.createElement('div');
  container.setAttribute('data-error-boundary', 'true');

  // Get parent boundary (for nesting)
  const parentBoundary = getActiveErrorBoundary();

  // Create error boundary context
  const errorBoundary = createErrorBoundaryContext(props.options, parentBoundary);

  // Store original children for reset (before evaluation)
  (errorBoundary as IErrorBoundaryContextInternal)._originalChildren = props.children;

  // Store error boundary on container
  Object.defineProperty(container, '__errorBoundary', {
    value: errorBoundary,
    writable: false,
    enumerable: false,
    configurable: false,
  });

  // Wrap child rendering in try-catch
  try {
    // Set this boundary as active (for nested boundaries)
    const previousBoundary = getActiveErrorBoundary();
    setActiveErrorBoundary(errorBoundary);

    // Evaluate children if it's a function (deferred evaluation)
    // This must happen AFTER setting the error boundary so it can catch errors
    const evaluatedChildren = typeof props.children === 'function' ? props.children() : props.children;
    
    // Normalize children to array
    const childElements = Array.isArray(evaluatedChildren) ? evaluatedChildren : [evaluatedChildren];

    // Append children with validation
    childElements.forEach((child) => {
      // Validate child is a DOM node before appending
      // This catches components that throw errors and return undefined/null
      if (child instanceof Node) {
        container.appendChild(child);
      } else if (child === undefined || child === null) {
        // Child component threw an error or returned invalid value
        throw new Error(
          'Component returned null/undefined. This usually means the component threw an error during render.'
        );
      } else {
        // Invalid child type
        throw new Error(
          `Invalid child type: expected Node, got ${typeof child}. Value: ${String(child)}`
        );
      }
    });

    // Restore previous boundary
    setActiveErrorBoundary(previousBoundary);
  } catch (error) {
    // Catch synchronous errors during render
    errorBoundary.catchError(error instanceof Error ? error : new Error(String(error)), 'Tryer', {
      phase: 'render',
    });

    // Show fallback
    renderFallback(container, errorBoundary as IErrorBoundaryContextInternal);
  }

  // Setup global error handler for async errors
  setupErrorHandler(container, errorBoundary as IErrorBoundaryContextInternal);

  return container;
}

/**
 * Renders error fallback UI
 */
function renderFallback(
  container: HTMLElement,
  errorBoundary: IErrorBoundaryContextInternal
): void {
  const errorInfo = errorBoundary._errorInfo;
  const options = errorBoundary.options;

  if (!errorInfo) return;

  // Clear container
  container.innerHTML = '';

  // Render fallback if provided
  if (options.fallback) {
    const fallback = options.fallback(errorInfo);
    errorBoundary._fallbackElement = fallback;
    container.appendChild(fallback);
  } else {
    // Default fallback
    const defaultFallback = createDefaultFallback(errorInfo);
    container.appendChild(defaultFallback);
  }
}

/**
 * Creates default error fallback UI
 */
function createDefaultFallback(errorInfo: IErrorInfo): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '20px';
  wrapper.style.border = '2px solid #ff4444';
  wrapper.style.borderRadius = '8px';
  wrapper.style.backgroundColor = '#fff5f5';
  wrapper.style.color = '#cc0000';

  const title = document.createElement('h3');
  title.textContent = '❌ Error Occurred';
  title.style.margin = '0 0 10px 0';

  const message = document.createElement('p');
  message.textContent = errorInfo.error.message;
  message.style.margin = '0';
  message.style.fontFamily = 'monospace';

  wrapper.appendChild(title);
  wrapper.appendChild(message);

  if (DEV && errorInfo.componentName) {
    const component = document.createElement('p');
    component.textContent = `Component: ${errorInfo.componentName}`;
    component.style.fontSize = '12px';
    component.style.color = '#666';
    wrapper.appendChild(component);
  }

  return wrapper;
}

/**
 * Setup error event handler for catching async errors
 */
function setupErrorHandler(
  container: HTMLElement,
  errorBoundary: IErrorBoundaryContextInternal
): void {
  // Store handler for cleanup
  const errorHandler = (event: ErrorEvent) => {
    // Check if error originated from this container's subtree
    // Guard: event.target must be a Node (not Window, etc.)
    if (event.target && event.target instanceof Node && container.contains(event.target as Node)) {
      event.preventDefault();
      event.stopPropagation();

      errorBoundary.catchError(event.error || new Error(event.message), 'async', {
        type: 'ErrorEvent',
      });

      renderFallback(container, errorBoundary);
    }
  };

  window.addEventListener('error', errorHandler, true);

  // Store for cleanup
  Object.defineProperty(container, '__errorHandler', {
    value: errorHandler,
    writable: false,
    enumerable: false,
    configurable: false,
  });
}

/**
 * Cleanup error boundary
 *
 * @param container - Tryer container element
 */
export function cleanupTryer(container: HTMLElement): void {
  const errorHandler = (container as { __errorHandler?: EventListener }).__errorHandler;
  if (errorHandler) {
    window.removeEventListener('error', errorHandler, true);
  }
}

/**
 * Reset error boundary to retry rendering
 *
 * @param container - Tryer container element
 */
export function resetTryer(container: HTMLElement): void {
  const errorBoundary = (container as { __errorBoundary?: IErrorBoundaryContextInternal })
    .__errorBoundary;
  if (!errorBoundary) return;

  // Reset error state
  errorBoundary.reset();

  // Clear and restore children
  container.innerHTML = '';
  const originalChildren = errorBoundary._originalChildren;
  
  // Evaluate children if it's a function
  const evaluatedChildren = typeof originalChildren === 'function' ? originalChildren() : originalChildren;
  const childElements = Array.isArray(evaluatedChildren) ? evaluatedChildren : [evaluatedChildren];
  
  childElements.forEach((child) => {
    if (child instanceof Node) {
      container.appendChild(child);
    }
  });
}
