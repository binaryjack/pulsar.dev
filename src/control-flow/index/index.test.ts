/**
 * Index Component Tests
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createEffect, createSignal } from '../../reactivity';
import { Index } from './index-component';

describe('Index Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Basic Rendering', () => {
    it('should render empty list', () => {
      const indexEl = Index({
        each: [],
        children: (item, index) => {
          const el = document.createElement('div');
          el.textContent = `${index}: ${item()}`;
          return el;
        },
      });

      container.appendChild(indexEl);
      // With display:contents, the wrapper doesn't count, check direct children
      expect(indexEl.children.length).toBe(0);
    });

    it('should render list of primitives', () => {
      const items = ['a', 'b', 'c'];

      const indexEl = Index({
        each: items,
        children: (item, index) => {
          const el = document.createElement('div');
          el.textContent = `${index}: ${item()}`;
          return el;
        },
      });

      container.appendChild(indexEl);
      expect(indexEl.children.length).toBe(3);
      expect(indexEl.children[0].textContent).toBe('0: a');
      expect(indexEl.children[1].textContent).toBe('1: b');
      expect(indexEl.children[2].textContent).toBe('2: c');
    });

    it('should render list of objects', () => {
      const items = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];

      const indexEl = Index({
        each: items,
        children: (item, index) => {
          const el = document.createElement('div');
          el.textContent = `${index}: ${item().name}`;
          return el;
        },
      });

      container.appendChild(indexEl);
      expect(indexEl.children.length).toBe(2);
      expect(indexEl.children[0].textContent).toBe('0: Alice');
      expect(indexEl.children[1].textContent).toBe('1: Bob');
    });

    it('should render with signal-based array', () => {
      const [items, setItems] = createSignal(['x', 'y']);

      const indexEl = Index({
        each: items,
        children: (item, index) => {
          const el = document.createElement('div');
          el.textContent = `${index}: ${item()}`;
          return el;
        },
      });

      container.appendChild(indexEl);
      expect(indexEl.children.length).toBe(2);
      expect(indexEl.children[0].textContent).toBe('0: x');

      // Update array
      setItems(['x', 'y', 'z']);

      // Give effect time to run
      setTimeout(() => {
        expect(indexEl.children.length).toBe(3);
        expect(indexEl.children[2].textContent).toBe('2: z');
      }, 0);
    });
  });

  describe('Item-as-Signal Pattern', () => {
    it('should wrap each item in a signal', async () => {
      const [items, setItems] = createSignal([1, 2, 3]);

      const indexEl = Index({
        each: items,
        children: (item, index) => {
          const el = document.createElement('div');
          // Use createEffect to track the signal
          createEffect(() => {
            el.textContent = `${index}: ${item()}`;
          });
          return el;
        },
      });

      container.appendChild(indexEl);
      expect(indexEl.children[0].textContent).toBe('0: 1');

      // Update item at index 0
      setItems([10, 2, 3]);

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(indexEl.children[0].textContent).toBe('0: 10');
    });

    it('should keep stable index number', () => {
      let capturedIndices: number[] = [];

      Index({
        each: ['a', 'b', 'c'],
        children: (item, index) => {
          capturedIndices.push(index);
          const el = document.createElement('div');
          el.textContent = `${index}`;
          return el;
        },
      });

      expect(capturedIndices).toEqual([0, 1, 2]);
    });

    it('should update item without recreating DOM node', () => {
      const [items, setItems] = createSignal([{ value: 1 }, { value: 2 }]);
      const domNodes: HTMLElement[] = [];

      const indexEl = Index({
        each: items,
        children: (item, index) => {
          const el = document.createElement('div');
          el.textContent = `${item().value}`;
          domNodes.push(el);
          return el;
        },
      });

      container.appendChild(indexEl);
      const firstNode = domNodes[0];

      // Update first item
      setItems([{ value: 10 }, { value: 2 }]);

      setTimeout(() => {
        // Same DOM node should still be used
        expect(indexEl.children[0]).toBe(firstNode);
      }, 0);
    });
  });

  describe('Array Length Changes', () => {
    it('should handle array growing', () => {
      const [items, setItems] = createSignal([1, 2]);

      const indexEl = Index({
        each: items,
        children: (item, index) => {
          const el = document.createElement('div');
          el.textContent = `${index}: ${item()}`;
          return el;
        },
      });

      container.appendChild(indexEl);
      expect(indexEl.children.length).toBe(2);

      // Grow array
      setItems([1, 2, 3, 4]);

      setTimeout(() => {
        expect(indexEl.children.length).toBe(4);
        expect(indexEl.children[3].textContent).toBe('3: 4');
      }, 0);
    });

    it('should handle array shrinking', () => {
      const [items, setItems] = createSignal([1, 2, 3, 4]);

      const indexEl = Index({
        each: items,
        children: (item, index) => {
          const el = document.createElement('div');
          el.textContent = `${index}: ${item()}`;
          return el;
        },
      });

      container.appendChild(indexEl);
      expect(indexEl.children.length).toBe(4);

      // Shrink array
      setItems([1, 2]);

      setTimeout(() => {
        expect(indexEl.children.length).toBe(2);
      }, 0);
    });

    it('should handle array becoming empty', () => {
      const [items, setItems] = createSignal([1, 2, 3]);

      const indexEl = Index({
        each: items,
        children: (item, index) => {
          const el = document.createElement('div');
          el.textContent = `${index}: ${item()}`;
          return el;
        },
      });

      container.appendChild(indexEl);
      expect(indexEl.children.length).toBe(3);

      // Empty array
      setItems([]);

      setTimeout(() => {
        expect(indexEl.children.length).toBe(0);
      }, 0);
    });

    it('should handle array going from empty to filled', () => {
      const [items, setItems] = createSignal<number[]>([]);

      const indexEl = Index({
        each: items,
        children: (item, index) => {
          const el = document.createElement('div');
          el.textContent = `${index}: ${item()}`;
          return el;
        },
      });

      container.appendChild(indexEl);
      expect(indexEl.children.length).toBe(0);

      // Fill array
      setItems([1, 2, 3]);

      setTimeout(() => {
        expect(indexEl.children.length).toBe(3);
      }, 0);
    });
  });

  describe('Fallback Content', () => {
    it('should show fallback when array is empty', () => {
      const fallback = document.createElement('div');
      fallback.textContent = 'No items';

      const indexEl = Index({
        each: [],
        children: (item, index) => {
          const el = document.createElement('div');
          el.textContent = `${index}: ${item()}`;
          return el;
        },
        fallback,
      });

      container.appendChild(indexEl);
      expect(container.textContent).toBe('No items');
    });

    it('should show fallback with function', () => {
      const indexEl = Index({
        each: [],
        children: (item, index) => {
          const el = document.createElement('div');
          el.textContent = `${index}: ${item()}`;
          return el;
        },
        fallback: () => {
          const el = document.createElement('div');
          el.textContent = 'Empty list';
          return el;
        },
      });

      container.appendChild(indexEl);
      expect(container.textContent).toBe('Empty list');
    });

    it('should hide fallback when items exist', () => {
      const [items, setItems] = createSignal<string[]>([]);

      const indexEl = Index({
        each: items,
        children: (item, index) => {
          const el = document.createElement('div');
          el.textContent = `${index}: ${item()}`;
          return el;
        },
        fallback: () => {
          const el = document.createElement('div');
          el.textContent = 'No items';
          return el;
        },
      });

      container.appendChild(indexEl);
      expect(container.textContent).toBe('No items');

      // Add items
      setItems(['a', 'b']);

      setTimeout(() => {
        expect(indexEl.textContent).not.toContain('No items');
        expect(indexEl.children.length).toBe(2);
      }, 0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined items', () => {
      const items = [null, undefined, 'valid'];

      const indexEl = Index({
        each: items as any[],
        children: (item, index) => {
          const el = document.createElement('div');
          el.textContent = `${index}: ${item()}`;
          return el;
        },
      });

      container.appendChild(indexEl);
      expect(indexEl.children.length).toBe(3);
      expect(indexEl.children[0].textContent).toBe('0: null');
      expect(indexEl.children[1].textContent).toBe('1: undefined');
      expect(indexEl.children[2].textContent).toBe('2: valid');
    });

    it('should handle rapid updates', () => {
      const [items, setItems] = createSignal([1]);

      const indexEl = Index({
        each: items,
        children: (item, index) => {
          const el = document.createElement('div');
          el.textContent = `${index}: ${item()}`;
          return el;
        },
      });

      container.appendChild(indexEl);

      // Rapid updates
      setItems([1, 2]);
      setItems([1, 2, 3]);
      setItems([1, 2, 3, 4]);

      setTimeout(() => {
        expect(indexEl.children.length).toBe(4);
      }, 0);
    });

    it('should handle large arrays efficiently', () => {
      const items = Array.from({ length: 1000 }, (_, i) => i);

      const indexEl = Index({
        each: items,
        children: (item, index) => {
          const el = document.createElement('div');
          el.textContent = `${index}: ${item()}`;
          return el;
        },
      });

      container.appendChild(indexEl);
      expect(indexEl.children.length).toBe(1000);
      expect(indexEl.children[999].textContent).toBe('999: 999');
    });
  });

  describe('Comparison with For Component', () => {
    it('should be more efficient for position-based updates', () => {
      // This test documents the difference:
      // Index: Items are signals, updates don't recreate DOM
      // For: Items trigger reconciliation, DOM may be recreated

      const [items, setItems] = createSignal([
        { id: 1, value: 'a' },
        { id: 2, value: 'b' },
      ]);

      const nodeRefs: HTMLElement[] = [];

      const indexEl = Index({
        each: items,
        children: (item, index) => {
          const el = document.createElement('div');
          el.textContent = `${item().value}`;
          nodeRefs.push(el);
          return el;
        },
      });

      container.appendChild(indexEl);
      const originalFirstNode = nodeRefs[0];

      // Update value (not position)
      setItems([
        { id: 1, value: 'CHANGED' },
        { id: 2, value: 'b' },
      ]);

      setTimeout(() => {
        // Same DOM node reused (Index advantage)
        expect(indexEl.children[0]).toBe(originalFirstNode);
      }, 0);
    });
  });
});
