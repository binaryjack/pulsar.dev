/**
 * Start delegating a specific event type
 */

import { createSyntheticEvent } from '../../../events/synthetic-event';
import type { ISyntheticEvent } from '../../../events/synthetic-event/synthetic-event.types';
import '../../../registry/types/html-element.augment';
import type { IRegistryEventDelegator } from '../registry-event-delegator.types';

/**
 * Start delegating a specific event type
 * Adds native listener at ApplicationRoot level
 */
export const startDelegation = function (this: IRegistryEventDelegator, eventType: string): void {
  // Already delegating this event type
  if (this.nativeListeners.has(eventType)) {
    return;
  }

  // Create delegated handler
  const delegatedHandler = (nativeEvent: Event) => {
    let target = nativeEvent.target as HTMLElement;

    // Walk up the DOM tree until we hit the root
    while (target && target !== this.appRoot.rootElement) {
      // Get element ID from DOM element (via type augmentation)
      const elementId = target.__elementId;

      if (elementId) {
        // Lookup handler in registry
        const elementHandlers = this.handlers.get(elementId);
        const handlerEntry = elementHandlers?.get(eventType);

        if (handlerEntry) {
          const { handler, options } = handlerEntry;

          // Create synthetic event if requested
          const event = options?.synthetic ? createSyntheticEvent(nativeEvent) : nativeEvent;

          // Invoke handler with appropriate event type
          // Cast needed because EventHandler is a union type and TS can't narrow it automatically
          try {
            handler(event as Event & ISyntheticEvent);
          } catch (error) {
            // Report error to ApplicationRoot if handler throws
            if (this.appRoot.onError) {
              this.appRoot.onError(error as Error);
            } else {
              console.error('Event handler error:', error);
            }
          }

          // Check if propagation stopped
          if (nativeEvent.cancelBubble) {
            break;
          }

          // Auto-cleanup for once listeners
          if (options?.once) {
            this.unregisterHandler(elementId, eventType);
          }
        }
      }

      // Move up to parent element
      target = target.parentElement as HTMLElement;
    }
  };

  // Add native listener at root
  // IMPORTANT: All handlers of the same event type MUST use the same capture phase
  // We use capture=true by default to catch events early, then check handlers during bubble
  // This ensures consistent behavior regardless of registration order
  const capture = true; // Always use capture phase for delegated events

  this.appRoot.rootElement.addEventListener(eventType, delegatedHandler, { capture });

  // Store cleanup function
  const cleanup = () => {
    this.appRoot.rootElement.removeEventListener(eventType, delegatedHandler, { capture });
  };

  this.nativeListeners.set(eventType, cleanup);
};
