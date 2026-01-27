/**
 * Registry Integration Tests
 * Tests registry working with other Pulsar systems
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { createEffect } from '../../../reactivity/effect';
import { createSignal } from '../../../reactivity/signal';
import type { IElementRegistry } from '../../index';
import { ElementRegistry, ElementType } from '../../index';

describe('Registry Integration', () => {
  let registry: IElementRegistry;

  beforeEach(() => {
    registry = new ElementRegistry();
  });

  describe('Registry with Signals', () => {
    it('should store signal references in metadata', () => {
      const el = document.createElement('div');
      const [count] = createSignal(0);

      registry.register('el-1', el, {
        element: el,
        type: ElementType.DYNAMIC,
      });

      const metadata = registry.metadata.get(el);
      expect(metadata).toBeDefined();
      expect(metadata?.signals).toBeInstanceOf(Set);

      // Store signal in metadata
      metadata?.signals.add(count);

      expect(metadata?.signals.has(count)).toBe(true);
      expect(metadata?.signals.size).toBe(1);
    });

    it('should track multiple signals per element', () => {
      const el = document.createElement('div');
      const [signal1] = createSignal('a');
      const [signal2] = createSignal('b');
      const [signal3] = createSignal('c');

      registry.register('el-1', el, {
        element: el,
        type: ElementType.DYNAMIC,
      });

      const metadata = registry.metadata.get(el);
      metadata?.signals.add(signal1);
      metadata?.signals.add(signal2);
      metadata?.signals.add(signal3);

      expect(metadata?.signals.size).toBe(3);
    });

    it('should cleanup signal subscriptions via cleanup callback', () => {
      const el = document.createElement('div');
      let cleanupCalled = false;

      registry.register('el-1', el, {
        element: el,
        type: ElementType.DYNAMIC,
      });

      const metadata = registry.metadata.get(el);
      if (metadata) {
        metadata.cleanup = () => {
          cleanupCalled = true;
        };
      }

      registry.unregister('el-1');

      expect(cleanupCalled).toBe(true);
    });
  });

  describe('Registry with Effects', () => {
    it('should store effect references in metadata', () => {
      const el = document.createElement('div');
      const [count] = createSignal(0);

      registry.register('el-1', el, {
        element: el,
        type: ElementType.DYNAMIC,
      });

      const metadata = registry.metadata.get(el);

      // Create effect and store dispose function
      const effect = createEffect(() => {
        const value = count();
        el.textContent = `Count: ${value}`;
      });

      metadata?.effects.add(() => effect.dispose());

      expect(metadata?.effects.size).toBe(1);
    });

    it('should cleanup all effects when element unregistered', () => {
      const el = document.createElement('div');
      const [count] = createSignal(0);
      let effect1Disposed = false;
      let effect2Disposed = false;

      registry.register('el-1', el, {
        element: el,
        type: ElementType.DYNAMIC,
      });

      const metadata = registry.metadata.get(el);

      // Mock effect dispose functions
      metadata?.effects.add(() => {
        effect1Disposed = true;
      });
      metadata?.effects.add(() => {
        effect2Disposed = true;
      });

      // Set cleanup to call all effects
      if (metadata) {
        metadata.cleanup = () => {
          metadata.effects.forEach((dispose) => dispose());
        };
      }

      registry.unregister('el-1');

      expect(effect1Disposed).toBe(true);
      expect(effect2Disposed).toBe(true);
    });
  });

  describe('Registry with Lifecycle', () => {
    it('should handle mount/unmount lifecycle', () => {
      const container = document.createElement('div');
      const child1 = document.createElement('span');
      const child2 = document.createElement('span');

      let cleanupCount = 0;

      // Register parent
      registry.register('container', container, {
        element: container,
        type: ElementType.STATIC,
      });

      const containerMeta = registry.metadata.get(container);
      if (containerMeta) {
        containerMeta.cleanup = () => cleanupCount++;
      }

      // Register children
      registry.register('child-1', child1, {
        element: child1,
        type: ElementType.DYNAMIC,
        parentId: 'container',
      });

      const child1Meta = registry.metadata.get(child1);
      if (child1Meta) {
        child1Meta.cleanup = () => cleanupCount++;
      }

      registry.register('child-2', child2, {
        element: child2,
        type: ElementType.DYNAMIC,
        parentId: 'container',
      });

      const child2Meta = registry.metadata.get(child2);
      if (child2Meta) {
        child2Meta.cleanup = () => cleanupCount++;
      }

      // Unmount entire subtree
      registry.unregisterSubtree('container');

      expect(cleanupCount).toBe(3);
      expect(registry.size()).toBe(0);
    });

    it('should track conditional rendering', () => {
      const container = document.createElement('div');
      const [show, setShow] = createSignal(true);

      registry.register('container', container, {
        element: container,
        type: ElementType.STATIC,
      });

      // Conditionally add child
      let childEl: HTMLElement | null = null;

      if (show()) {
        childEl = document.createElement('span');
        registry.register('child', childEl, {
          element: childEl,
          type: ElementType.DYNAMIC,
          parentId: 'container',
        });
      }

      expect(registry.has('child')).toBe(true);
      expect(registry.size()).toBe(2);

      // Hide child
      setShow(false);
      if (childEl) {
        registry.unregister('child');
      }

      expect(registry.has('child')).toBe(false);
      expect(registry.size()).toBe(1);
    });
  });

  describe('Registry with Dynamic Lists', () => {
    it('should handle list updates with reconciliation', () => {
      const list = document.createElement('ul');

      registry.register('list', list, {
        element: list,
        type: ElementType.STATIC,
      });

      // Initial items
      const items = ['A', 'B', 'C'];
      items.forEach((text, index) => {
        const li = document.createElement('li');
        li.textContent = text;

        registry.register(`item-${text}`, li, {
          element: li,
          type: ElementType.ARRAY_ITEM,
          parentId: 'list',
          index,
        });
      });

      expect(registry.size()).toBe(4); // list + 3 items

      // Update: remove 'B', add 'D'
      registry.unregister('item-B');

      const li = document.createElement('li');
      li.textContent = 'D';
      registry.register('item-D', li, {
        element: li,
        type: ElementType.ARRAY_ITEM,
        parentId: 'list',
        index: 2,
      });

      expect(registry.size()).toBe(4); // list + 3 items (A, C, D)
      expect(registry.has('item-B')).toBe(false);
      expect(registry.has('item-D')).toBe(true);
    });
  });

  describe('Memory Management', () => {
    it('should allow WeakMap to GC elements after unregister', () => {
      let el: HTMLElement | null = document.createElement('div');

      registry.register('el-1', el, {
        element: el,
        type: ElementType.DYNAMIC,
      });

      const metadata = registry.metadata.get(el);
      expect(metadata).toBeDefined();

      registry.unregister('el-1');

      // Element should no longer be in registry
      expect(registry.has('el-1')).toBe(false);

      // Metadata is still accessible while el is in scope
      const metadataStillExists = registry.metadata.get(el);
      expect(metadataStillExists).toBeDefined();

      // After el is nulled, WeakMap should eventually GC the metadata
      el = null;

      // Note: We can't force GC in tests, but the WeakMap design ensures
      // metadata will be collected when the element is no longer referenced
    });

    it('should handle large numbers of registrations efficiently', () => {
      const root = document.createElement('div');

      registry.register('root', root, {
        element: root,
        type: ElementType.STATIC,
      });

      const startTime = performance.now();

      // Register 1000 elements
      for (let i = 0; i < 1000; i++) {
        const el = document.createElement('div');
        registry.register(`el-${i}`, el, {
          element: el,
          type: ElementType.DYNAMIC,
          parentId: 'root',
        });
      }

      const duration = performance.now() - startTime;

      expect(registry.size()).toBe(1001);
      expect(duration).toBeLessThan(50); // < 50ms for 1000 registrations
    });
  });
});
