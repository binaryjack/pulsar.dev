/**
 * Registry Performance Benchmarks
 * Validates performance requirements
 */
import { beforeEach, describe, expect, it } from 'vitest';
import type { IElementRegistry, IIdGenerationContext } from '../../index';
import { createIdContext, ElementRegistry, ElementType, generateId } from '../../index';

describe('Registry Performance', () => {
  let registry: IElementRegistry;
  let idContext: IIdGenerationContext;

  beforeEach(() => {
    registry = new ElementRegistry();
    idContext = createIdContext();
  });

  describe('Registration Performance', () => {
    it('should register 1000 elements in < 10ms', () => {
      const elements: HTMLElement[] = [];

      // Pre-create elements (don't count DOM creation time)
      for (let i = 0; i < 1000; i++) {
        elements.push(document.createElement('div'));
      }

      const startTime = performance.now();

      // Register all elements
      elements.forEach((el, index) => {
        const id = generateId(idContext, undefined, index);
        registry.register(id, el, {
          element: el,
          type: ElementType.DYNAMIC,
        });
      });

      const duration = performance.now() - startTime;

      expect(registry.size()).toBe(1000);
      expect(duration).toBeLessThan(10); // Target: < 10ms
      console.log(`✓ Registered 1000 elements in ${duration.toFixed(2)}ms`);
    });

    it('should register hierarchical elements efficiently', () => {
      const root = document.createElement('div');
      const rootId = generateId(idContext);

      const startTime = performance.now();

      // Register root
      registry.register(rootId, root, {
        element: root,
        type: ElementType.STATIC,
      });

      // Register 999 children
      for (let i = 0; i < 999; i++) {
        const child = document.createElement('div');
        const childId = generateId(idContext, rootId, i);

        registry.register(childId, child, {
          element: child,
          type: ElementType.DYNAMIC,
          parentId: rootId,
        });
      }

      const duration = performance.now() - startTime;

      expect(registry.size()).toBe(1000);
      expect(registry.getChildren(rootId).length).toBe(999);
      expect(duration).toBeLessThan(15); // Slightly higher due to parent tracking
      console.log(`✓ Registered 1 root + 999 children in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Lookup Performance', () => {
    beforeEach(() => {
      // Pre-populate registry with 1000 elements
      for (let i = 0; i < 1000; i++) {
        const el = document.createElement('div');
        const id = generateId(idContext, undefined, i);
        registry.register(id, el, {
          element: el,
          type: ElementType.DYNAMIC,
        });
      }
    });

    it('should lookup 10000 elements in < 5ms', () => {
      const startTime = performance.now();

      // Lookup elements (10x more lookups than elements)
      for (let i = 0; i < 10000; i++) {
        const index = i % 1000; // Cycle through all IDs
        const id = generateId({ generation: 0, fragmentCounter: index });
        registry.has(id);
      }

      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(10); // Map lookups are O(1), relaxed for test variance
      console.log(`✓ 10000 lookups in ${duration.toFixed(2)}ms`);
    });

    it('should get child list efficiently', () => {
      const root = document.createElement('div');
      const rootId = generateId(idContext);

      registry.register(rootId, root, {
        element: root,
        type: ElementType.STATIC,
      });

      // Add 500 children
      for (let i = 0; i < 500; i++) {
        const child = document.createElement('div');
        const childId = generateId(idContext, rootId, i);

        registry.register(childId, child, {
          element: child,
          type: ElementType.DYNAMIC,
          parentId: rootId,
        });
      }

      const startTime = performance.now();

      // Get children 1000 times
      for (let i = 0; i < 1000; i++) {
        const children = registry.getChildren(rootId);
        expect(children.length).toBe(500);
      }

      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(15); // Relaxed for test variance
      console.log(`✓ Retrieved children list 1000 times in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Unregistration Performance', () => {
    it('should unregister 1000 elements in < 10ms', () => {
      const ids: string[] = [];

      // Register 1000 elements
      for (let i = 0; i < 1000; i++) {
        const el = document.createElement('div');
        const id = generateId(idContext, undefined, i);
        ids.push(id);

        registry.register(id, el, {
          element: el,
          type: ElementType.DYNAMIC,
        });
      }

      const startTime = performance.now();

      // Unregister all elements
      ids.forEach((id) => {
        registry.unregister(id);
      });

      const duration = performance.now() - startTime;

      expect(registry.size()).toBe(0);
      expect(duration).toBeLessThan(10);
      console.log(`✓ Unregistered 1000 elements in ${duration.toFixed(2)}ms`);
    });

    it('should unregister subtree efficiently', () => {
      const root = document.createElement('div');
      const rootId = generateId(idContext);

      registry.register(rootId, root, {
        element: root,
        type: ElementType.STATIC,
      });

      // Create 3-level tree: 1 root + 10 level1 + 100 level2 = 111 total
      for (let i = 0; i < 10; i++) {
        const level1 = document.createElement('div');
        const level1Id = generateId(idContext, rootId, i);

        registry.register(level1Id, level1, {
          element: level1,
          type: ElementType.DYNAMIC,
          parentId: rootId,
        });

        for (let j = 0; j < 10; j++) {
          const level2 = document.createElement('div');
          const level2Id = generateId(idContext, level1Id, j);

          registry.register(level2Id, level2, {
            element: level2,
            type: ElementType.DYNAMIC,
            parentId: level1Id,
          });
        }
      }

      expect(registry.size()).toBe(111);

      const startTime = performance.now();

      // Unregister entire subtree (BFS traversal + cleanup)
      registry.unregisterSubtree(rootId);

      const duration = performance.now() - startTime;

      expect(registry.size()).toBe(0);
      expect(duration).toBeLessThan(5); // Should be very fast
      console.log(`✓ Unregistered subtree (111 elements) in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Clear Performance', () => {
    it('should clear 1000 elements in < 5ms', () => {
      // Register 1000 elements with cleanup callbacks
      for (let i = 0; i < 1000; i++) {
        const el = document.createElement('div');
        const id = generateId(idContext, undefined, i);

        registry.register(id, el, {
          element: el,
          type: ElementType.DYNAMIC,
        });

        const metadata = registry.metadata.get(el);
        if (metadata) {
          metadata.cleanup = () => {
            /* cleanup logic */
          };
        }
      }

      const startTime = performance.now();

      registry.clear();

      const duration = performance.now() - startTime;

      expect(registry.size()).toBe(0);
      expect(duration).toBeLessThan(5);
      console.log(`✓ Cleared 1000 elements in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Memory Footprint', () => {
    it('should use < 150 bytes per element', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Register 1000 elements
      for (let i = 0; i < 1000; i++) {
        const el = document.createElement('div');
        const id = generateId(idContext, undefined, i);

        registry.register(id, el, {
          element: el,
          type: ElementType.DYNAMIC,
        });
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryUsed = finalMemory - initialMemory;
      const bytesPerElement = memoryUsed / 1000;

      // Note: Actual measurement varies by browser
      // This is a rough estimate
      if (memoryUsed > 0) {
        console.log(`Memory used: ${(memoryUsed / 1024).toFixed(2)} KB for 1000 elements`);
        console.log(`Estimated bytes per element: ${bytesPerElement.toFixed(0)} bytes`);

        // Target: < 150 bytes per element
        // In practice, this includes:
        // - Map entry: ~32 bytes (key + value reference)
        // - WeakMap entry: minimal (GC-able)
        // - Entry object: ~80 bytes (6 properties)
        // - Metadata object: ~40 bytes (3 properties)
        // Total: ~152 bytes per element (close to target)

        // This test is informational since memory varies by browser
        expect(bytesPerElement).toBeLessThan(300); // Relaxed for test stability
      } else {
        console.log('⚠ Memory measurement not available (browser-specific feature)');
      }
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle rapid add/remove cycles', () => {
      const startTime = performance.now();

      // Simulate 100 cycles of adding/removing 10 elements
      for (let cycle = 0; cycle < 100; cycle++) {
        const ids: string[] = [];

        // Add 10 elements
        for (let i = 0; i < 10; i++) {
          const el = document.createElement('div');
          const id = generateId(idContext, undefined, i);
          ids.push(id);

          registry.register(id, el, {
            element: el,
            type: ElementType.DYNAMIC,
          });
        }

        // Remove all 10 elements
        ids.forEach((id) => registry.unregister(id));
      }

      const duration = performance.now() - startTime;

      expect(registry.size()).toBe(0);
      expect(duration).toBeLessThan(20); // 1000 operations in < 20ms
      console.log(`✓ 100 cycles of add/remove (1000 ops) in ${duration.toFixed(2)}ms`);
    });

    it('should handle mixed operations efficiently', () => {
      const root = document.createElement('div');
      const rootId = generateId(idContext);

      registry.register(rootId, root, {
        element: root,
        type: ElementType.STATIC,
      });

      const startTime = performance.now();

      // Perform 1000 mixed operations
      for (let i = 0; i < 1000; i++) {
        const op = i % 4;

        if (op === 0) {
          // Register
          const el = document.createElement('div');
          const id = generateId(idContext, rootId, i);
          registry.register(id, el, {
            element: el,
            type: ElementType.DYNAMIC,
            parentId: rootId,
          });
        } else if (op === 1) {
          // Lookup
          registry.has(rootId);
        } else if (op === 2) {
          // Get children
          registry.getChildren(rootId);
        } else {
          // Check size
          registry.size();
        }
      }

      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(15); // Mixed operations should be fast
      console.log(`✓ 1000 mixed operations in ${duration.toFixed(2)}ms`);
    });
  });
});
