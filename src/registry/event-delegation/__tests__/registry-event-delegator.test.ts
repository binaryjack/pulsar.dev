/**
 * Registry Event Delegator Tests
 * Comprehensive test coverage for registry-based event delegation
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { ApplicationRoot } from '../../../bootstrap/application-root';
import type { IApplicationRoot } from '../../../bootstrap/application-root.interface';
import type { IRegistryEventDelegator } from '../registry-event-delegator.types';
// Import builder to ensure prototype methods are attached
import '../../../bootstrap/builder';

// Extend HTMLElement to include __elementId property
declare global {
  interface HTMLElement {
    __elementId?: string;
  }
}

describe('RegistryEventDelegator', () => {
  let rootElement: HTMLElement;
  let appRoot: IApplicationRoot;
  let delegator: IRegistryEventDelegator;

  beforeEach(() => {
    // Create root element
    rootElement = document.createElement('div');
    document.body.appendChild(rootElement);

    // Create ApplicationRoot
    appRoot = new (ApplicationRoot as any)(rootElement);
    delegator = appRoot.eventDelegator;
  });

  afterEach(() => {
    // Cleanup
    document.body.removeChild(rootElement);
  });

  describe('Constructor', () => {
    it('should initialize with ApplicationRoot reference', () => {
      expect(delegator.appRoot).toBe(appRoot);
    });

    it('should initialize empty handler registry', () => {
      expect(delegator.handlers.size).toBe(0);
    });

    it('should initialize empty native listeners map', () => {
      expect(delegator.nativeListeners.size).toBe(0);
    });
  });

  describe('Handler Registration', () => {
    it('should register event handler', () => {
      const handler = () => {};
      delegator.registerHandler('a.0', 'click', handler);

      expect(delegator.handlers.has('a.0')).toBe(true);
      expect(delegator.handlers.get('a.0')?.has('click')).toBe(true);
    });

    it('should return cleanup function', () => {
      const handler = () => {};
      const cleanup = delegator.registerHandler('a.0', 'click', handler);

      expect(typeof cleanup).toBe('function');

      // Verify registered
      expect(delegator.handlers.get('a.0')?.has('click')).toBe(true);

      // Call cleanup
      cleanup();

      // Verify unregistered (element entry removed when no more handlers)
      expect(delegator.handlers.has('a.0')).toBe(false);
    });

    it('should handle multiple handlers for same element', () => {
      const clickHandler = () => {};
      const mouseHandler = () => {};

      delegator.registerHandler('a.0', 'click', clickHandler);
      delegator.registerHandler('a.0', 'mousemove', mouseHandler);

      const handlers = delegator.handlers.get('a.0')!;
      expect(handlers.size).toBe(2);
      expect(handlers.has('click')).toBe(true);
      expect(handlers.has('mousemove')).toBe(true);
    });

    it('should handle handlers for multiple elements', () => {
      const handler1 = () => {};
      const handler2 = () => {};

      delegator.registerHandler('a.0', 'click', handler1);
      delegator.registerHandler('a.1', 'click', handler2);

      expect(delegator.handlers.size).toBe(2);
      expect(delegator.handlers.has('a.0')).toBe(true);
      expect(delegator.handlers.has('a.1')).toBe(true);
    });

    it('should store handler options', () => {
      const handler = () => {};
      delegator.registerHandler('a.0', 'click', handler, {
        synthetic: true,
        once: true,
      });

      const entry = delegator.handlers.get('a.0')?.get('click');
      expect(entry?.options?.synthetic).toBe(true);
      expect(entry?.options?.once).toBe(true);
    });
  });

  describe('Event Delegation', () => {
    it('should start delegation when first handler registered', () => {
      expect(delegator.nativeListeners.has('click')).toBe(false);

      delegator.registerHandler('a.0', 'click', () => {});

      expect(delegator.nativeListeners.has('click')).toBe(true);
    });

    it('should not start delegation twice for same event type', () => {
      delegator.registerHandler('a.0', 'click', () => {});
      const size = delegator.nativeListeners.size;

      delegator.registerHandler('a.1', 'click', () => {});

      // Should still have same number of listeners
      expect(delegator.nativeListeners.size).toBe(size);
    });

    it('should fire handler when event bubbles to root', () => {
      let clicked = false;
      const button = document.createElement('button');
      button.__elementId = 'a.0';
      rootElement.appendChild(button);

      delegator.registerHandler('a.0', 'click', () => {
        clicked = true;
      });

      button.click();
      expect(clicked).toBe(true);
    });

    it('should lookup element by __elementId', () => {
      let clickedId: string | undefined;
      const button = document.createElement('button');
      button.__elementId = 'a.0.0.1';
      rootElement.appendChild(button);

      delegator.registerHandler('a.0.0.1', 'click', () => {
        clickedId = 'a.0.0.1';
      });

      button.click();
      expect(clickedId).toBe('a.0.0.1');
    });

    it('should walk up DOM tree to find handlers', () => {
      let clickedId: string | undefined;

      const container = document.createElement('div');
      container.__elementId = 'a.0';
      rootElement.appendChild(container);

      const button = document.createElement('button');
      button.__elementId = 'a.0.0';
      container.appendChild(button);

      // Register handler on container
      delegator.registerHandler('a.0', 'click', () => {
        clickedId = 'a.0';
      });

      // Click button (should bubble to container)
      button.click();
      expect(clickedId).toBe('a.0');
    });

    it('should fire multiple handlers in bubbling order', () => {
      const order: string[] = [];

      const container = document.createElement('div');
      container.__elementId = 'a.0';
      rootElement.appendChild(container);

      const button = document.createElement('button');
      button.__elementId = 'a.0.0';
      container.appendChild(button);

      delegator.registerHandler('a.0.0', 'click', () => {
        order.push('button');
      });

      delegator.registerHandler('a.0', 'click', () => {
        order.push('container');
      });

      button.click();
      expect(order).toEqual(['button', 'container']);
    });

    it('should stop propagation when requested', () => {
      let containerClicked = false;

      const container = document.createElement('div');
      container.__elementId = 'a.0';
      rootElement.appendChild(container);

      const button = document.createElement('button');
      button.__elementId = 'a.0.0';
      container.appendChild(button);

      delegator.registerHandler('a.0.0', 'click', (e: Event) => {
        e.stopPropagation();
      });

      delegator.registerHandler('a.0', 'click', () => {
        containerClicked = true;
      });

      button.click();
      expect(containerClicked).toBe(false);
    });
  });

  describe('Handler Unregistration', () => {
    it('should unregister specific handler', () => {
      delegator.registerHandler('a.0', 'click', () => {});
      expect(delegator.handlers.get('a.0')?.has('click')).toBe(true);

      delegator.unregisterHandler('a.0', 'click');
      // Element entry removed when no more handlers
      expect(delegator.handlers.has('a.0')).toBe(false);
    });

    it('should remove element entry when no handlers left', () => {
      delegator.registerHandler('a.0', 'click', () => {});
      expect(delegator.handlers.has('a.0')).toBe(true);

      delegator.unregisterHandler('a.0', 'click');
      expect(delegator.handlers.has('a.0')).toBe(false);
    });

    it('should stop delegation when no handlers remain for event type', () => {
      delegator.registerHandler('a.0', 'click', () => {});
      expect(delegator.nativeListeners.has('click')).toBe(true);

      delegator.unregisterHandler('a.0', 'click');
      expect(delegator.nativeListeners.has('click')).toBe(false);
    });

    it('should keep delegation active if other handlers exist', () => {
      delegator.registerHandler('a.0', 'click', () => {});
      delegator.registerHandler('a.1', 'click', () => {});
      expect(delegator.nativeListeners.has('click')).toBe(true);

      delegator.unregisterHandler('a.0', 'click');
      expect(delegator.nativeListeners.has('click')).toBe(true);
    });

    it('should unregister all handlers for element', () => {
      delegator.registerHandler('a.0', 'click', () => {});
      delegator.registerHandler('a.0', 'mousemove', () => {});
      delegator.registerHandler('a.0', 'keydown', () => {});

      delegator.unregisterElement('a.0');

      expect(delegator.handlers.has('a.0')).toBe(false);
    });
  });

  describe('Once Listeners', () => {
    it('should auto-cleanup after first fire', () => {
      let clickCount = 0;
      const button = document.createElement('button');
      button.__elementId = 'a.0';
      rootElement.appendChild(button);

      delegator.registerHandler(
        'a.0',
        'click',
        () => {
          clickCount++;
        },
        { once: true }
      );

      button.click();
      expect(clickCount).toBe(1);

      button.click();
      expect(clickCount).toBe(1); // Should not fire again
    });

    it('should unregister after first fire', () => {
      const button = document.createElement('button');
      button.__elementId = 'a.0';
      rootElement.appendChild(button);

      delegator.registerHandler('a.0', 'click', () => {}, { once: true });
      expect(delegator.handlers.get('a.0')?.has('click')).toBe(true);

      button.click();
      // Element entry removed when no more handlers
      expect(delegator.handlers.has('a.0')).toBe(false);
    });
  });

  describe('Synthetic Events', () => {
    it('should wrap native event when synthetic option enabled', () => {
      let receivedEvent: any;
      const button = document.createElement('button');
      button.__elementId = 'a.0';
      rootElement.appendChild(button);

      delegator.registerHandler(
        'a.0',
        'click',
        (e: any) => {
          receivedEvent = e;
        },
        { synthetic: true }
      );

      button.click();

      // Synthetic events have nativeEvent property
      expect(receivedEvent).toBeDefined();
      expect(receivedEvent.nativeEvent).toBeDefined();
      expect(receivedEvent.type).toBe('click');
    });

    it('should pass native event when synthetic disabled', () => {
      let receivedEvent: any;
      const button = document.createElement('button');
      button.__elementId = 'a.0';
      rootElement.appendChild(button);

      delegator.registerHandler(
        'a.0',
        'click',
        (e: any) => {
          receivedEvent = e;
        },
        { synthetic: false }
      );

      button.click();

      // Native events don't have nativeEvent property
      expect(receivedEvent).toBeDefined();
      expect(receivedEvent.nativeEvent).toBeUndefined();
      expect(receivedEvent.type).toBe('click');
    });
  });

  describe('Error Handling', () => {
    it('should catch handler errors', () => {
      const button = document.createElement('button');
      button.__elementId = 'a.0';
      rootElement.appendChild(button);

      delegator.registerHandler('a.0', 'click', () => {
        throw new Error('Handler error');
      });

      // Should not throw
      expect(() => button.click()).not.toThrow();
    });

    it('should call onError callback when handler throws', () => {
      let errorCaught: Error | undefined;
      const button = document.createElement('button');
      button.__elementId = 'a.0';
      rootElement.appendChild(button);

      // Create new ApplicationRoot with onError
      const customRoot = new (ApplicationRoot as any)(
        rootElement,
        undefined,
        undefined,
        (err: Error) => {
          errorCaught = err;
        }
      );

      customRoot.eventDelegator.registerHandler('a.0', 'click', () => {
        throw new Error('Test error');
      });

      button.click();
      expect(errorCaught?.message).toBe('Test error');
    });
  });

  describe('Destroy', () => {
    it('should remove all native listeners', () => {
      delegator.registerHandler('a.0', 'click', () => {});
      delegator.registerHandler('a.1', 'mousemove', () => {});
      delegator.registerHandler('a.2', 'keydown', () => {});

      expect(delegator.nativeListeners.size).toBe(3);

      delegator.destroy();

      expect(delegator.nativeListeners.size).toBe(0);
    });

    it('should clear all handler registrations', () => {
      delegator.registerHandler('a.0', 'click', () => {});
      delegator.registerHandler('a.1', 'click', () => {});

      expect(delegator.handlers.size).toBe(2);

      delegator.destroy();

      expect(delegator.handlers.size).toBe(0);
    });

    it('should prevent events from firing after destroy', () => {
      let clicked = false;
      const button = document.createElement('button');
      button.__elementId = 'a.0';
      rootElement.appendChild(button);

      delegator.registerHandler('a.0', 'click', () => {
        clicked = true;
      });

      delegator.destroy();

      button.click();
      expect(clicked).toBe(false);
    });
  });

  describe('Multiple Event Types', () => {
    it('should handle different event types independently', () => {
      const events: string[] = [];
      const button = document.createElement('button');
      button.__elementId = 'a.0';
      rootElement.appendChild(button);

      delegator.registerHandler('a.0', 'click', () => events.push('click'));
      delegator.registerHandler('a.0', 'mousemove', () => events.push('mousemove'));

      button.click();
      button.dispatchEvent(new Event('mousemove', { bubbles: true }));

      expect(events).toEqual(['click', 'mousemove']);
    });

    it('should cleanup event types independently', () => {
      delegator.registerHandler('a.0', 'click', () => {});
      delegator.registerHandler('a.0', 'mousemove', () => {});

      delegator.unregisterHandler('a.0', 'click');

      expect(delegator.nativeListeners.has('click')).toBe(false);
      expect(delegator.nativeListeners.has('mousemove')).toBe(true);
    });
  });

  describe('Integration with ApplicationRoot', () => {
    it('should be accessible from ApplicationRoot', () => {
      expect(appRoot.eventDelegator).toBeDefined();
      expect(appRoot.eventDelegator).toBe(delegator);
    });

    it('should cleanup on ApplicationRoot unmount', () => {
      // Register a handler first
      delegator.registerHandler('a.0', 'click', () => {});
      expect(delegator.handlers.size).toBe(1);
      expect(delegator.nativeListeners.size).toBe(1); // 'click' delegation started

      // Mount a component to set up proper state
      const component = document.createElement('div');
      appRoot.mount(component);

      // Unmount should destroy the delegator
      appRoot.unmount();

      // Delegator should be destroyed (handlers and listeners cleared)
      expect(delegator.handlers.size).toBe(0);
      expect(delegator.nativeListeners.size).toBe(0);
    });
  });
});
