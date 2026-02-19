/**
 * Tryer Component
 *
 * Self-contained error boundary. Catches synchronous render errors in children
 * and displays fallback UI. Uses the $REGISTRY.wire reactive loop so children
 * stay reactive and errors are caught on every re-evaluation cycle.
 *
 * API:
 *   <Tryer fallback={(error, reset) => <div>...</div>}>
 *     <RiskyComponent />
 *   </Tryer>
 */

import { DEV } from '../dev/dev.types';
import { onCleanup } from '../lifecycle/lifecycle-hooks';
import { createSignal } from '../reactivity/signal/create-signal';
import { $REGISTRY } from '../registry/core';
import { IErrorInfo, ITryerProps } from './error-boundary.types';

export function Tryer(props: ITryerProps): HTMLElement {
  const container = document.createElement('div');
  container.setAttribute('data-error-boundary', 'true');

  // Incrementing this token forces the wire to re-run (retry after error)
  const [retryToken, setRetryToken] = createSignal(0);
  const reset = (): void => setRetryToken((n) => n + 1);

  $REGISTRY.wire(container, '__tryerUpdate', () => {
    retryToken(); // subscribe — reset() increments this, triggering re-run

    // Clear previous render
    while (container.firstChild) container.removeChild(container.firstChild);

    try {
      const raw =
        typeof props.children === 'function' ? props.children() : props.children;
      const arr: unknown[] = Array.isArray(raw) ? raw : [raw];
      for (const child of arr) {
        if (child instanceof Node) {
          container.appendChild(child);
        } else if (child !== null && child !== undefined) {
          throw new Error(
            `Invalid child type: expected Node, got ${typeof child}. Value: ${String(child)}`
          );
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      // Clear anything partially appended
      container.innerHTML = '';

      if (props.fallback) {
        // New API: fallback prop
        const fb = props.fallback(err, reset);
        if (fb instanceof Node) container.appendChild(fb);
      } else if (props.options?.fallback) {
        // Deprecated: options.fallback for backward compat with existing tests
        const errorInfo: IErrorInfo = {
          error: err,
          componentName: 'Tryer',
          timestamp: Date.now(),
          context: { phase: 'render' },
        };
        const fb = props.options.fallback(errorInfo);
        if (fb instanceof Node) container.appendChild(fb);
        props.options.onError?.(errorInfo);
      } else {
        container.appendChild(createDefaultFallback(err));
      }
    }

    return null;
  });

  // Expose reset for resetTryer() utility and external lab access
  Object.defineProperty(container, '__tryerReset', {
    value: reset,
    writable: false,
    enumerable: false,
    configurable: true,
  });

  onCleanup(() => cleanupTryer(container));

  return container;
}

/**
 * Imperatively reset a Tryer container — re-evaluates children.
 */
export function resetTryer(container: HTMLElement): void {
  const reset = (container as { __tryerReset?: () => void }).__tryerReset;
  if (typeof reset === 'function') reset();
}

/**
 * Cleanup hook — no-op in new design (no window listeners).
 * Kept for API compatibility.
 */
export function cleanupTryer(_container: HTMLElement): void {
  // intentionally empty — $REGISTRY.wire disposes itself on element removal
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

function createDefaultFallback(error: Error): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '20px';
  wrapper.style.border = '2px solid #ff4444';
  wrapper.style.borderRadius = '8px';
  wrapper.style.backgroundColor = '#fff5f5';
  wrapper.style.color = '#cc0000';

  const title = document.createElement('h3');
  title.textContent = '\u274C Error Occurred';
  title.style.margin = '0 0 10px 0';

  const message = document.createElement('p');
  message.textContent = error.message;
  message.style.margin = '0';
  message.style.fontFamily = 'monospace';

  wrapper.appendChild(title);
  wrapper.appendChild(message);

  if (DEV) {
    const stack = document.createElement('pre');
    stack.textContent = error.stack ?? '';
    stack.style.fontSize = '11px';
    stack.style.color = '#888';
    stack.style.marginTop = '10px';
    stack.style.whiteSpace = 'pre-wrap';
    wrapper.appendChild(stack);
  }

  return wrapper;
}
