/**
 * Unit Tests for ForRegistry Control Flow
 * Tests list rendering with registry pattern
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createSignal } from '../../reactivity/signal';
import { $REGISTRY } from '../../registry/core';
import { ForRegistry } from '../for-registry';

describe('ForRegistry - Unit Tests', () => {
  beforeEach(() => {
    if (typeof document !== 'undefined') {
      document.body.innerHTML = '';
    }
  });

  afterEach(() => {
    $REGISTRY.reset();
  });

  describe('Basic Rendering', () => {
    it('should render empty list', () => {
      const container = ForRegistry({
        each: [],
        children: (item) => {
          const el = document.createElement('div');
          el.textContent = item;
          return el;
        },
      });

      expect(container.childNodes.length).toBe(0);
    });

    it('should render list with items', () => {
      const items = [1, 2, 3];

      const container = ForRegistry({
        each: items,
        children: (item) => {
          const el = document.createElement('div');
          el.textContent = String(item);
          return el;
        },
      });

      expect(container.childNodes.length).toBe(3);
      expect(container.childNodes[0].textContent).toBe('1');
      expect(container.childNodes[1].textContent).toBe('2');
      expect(container.childNodes[2].textContent).toBe('3');
    });

    it('should render list with complex objects', () => {
      const items = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ];

      const container = ForRegistry({
        each: items,
        children: (item) => {
          const el = document.createElement('div');
          el.textContent = item.name;
          el.dataset.id = String(item.id);
          return el;
        },
      });

      expect(container.childNodes.length).toBe(3);
      expect(container.childNodes[0].textContent).toBe('Alice');
      expect((container.childNodes[0] as HTMLElement).dataset.id).toBe('1');
    });
  });

  describe('Reactive Updates', () => {
    it('should update when signal changes', () => {
      const [items, setItems] = createSignal([1, 2, 3]);

      const container = ForRegistry({
        each: items,
        children: (item) => {
          const el = document.createElement('div');
          el.textContent = String(item);
          return el;
        },
      });

      expect(container.childNodes.length).toBe(3);

      // Update signal
      setItems([1, 2, 3, 4]);

      // Should have 4 items now
      expect(container.childNodes.length).toBe(4);
      expect(container.childNodes[3].textContent).toBe('4');
    });

    it('should remove items when list shrinks', () => {
      const [items, setItems] = createSignal([1, 2, 3, 4]);

      const container = ForRegistry({
        each: items,
        children: (item) => {
          const el = document.createElement('div');
          el.textContent = String(item);
          return el;
        },
      });

      expect(container.childNodes.length).toBe(4);

      // Shrink list
      setItems([1, 2]);

      expect(container.childNodes.length).toBe(2);
    });

    it('should clear all items when list becomes empty', () => {
      const [items, setItems] = createSignal([1, 2, 3]);

      const container = ForRegistry({
        each: items,
        children: (item) => {
          const el = document.createElement('div');
          el.textContent = String(item);
          return el;
        },
      });

      expect(container.childNodes.length).toBe(3);

      // Clear list
      setItems([]);

      expect(container.childNodes.length).toBe(0);
    });
  });

  describe('Key Function', () => {
    it('should use key function for reconciliation', () => {
      const [items, setItems] = createSignal([
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ]);

      const container = ForRegistry({
        each: items,
        key: (item) => item.id,
        children: (item) => {
          const el = document.createElement('div');
          el.textContent = item.name;
          el.dataset.id = String(item.id);
          return el;
        },
      });

      const firstEl = container.childNodes[0] as HTMLElement;
      expect(firstEl.dataset.id).toBe('1');

      // Reorder items
      setItems([
        { id: 2, name: 'B' },
        { id: 1, name: 'A' },
      ]);

      // First element should now have id 2
      const newFirstEl = container.childNodes[0] as HTMLElement;
      expect(newFirstEl.dataset.id).toBe('2');
    });

    it('should maintain stable references with keys', () => {
      const [items, setItems] = createSignal([
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ]);

      const container = ForRegistry({
        each: items,
        key: (item) => item.id,
        children: (item) => {
          const el = document.createElement('div');
          el.textContent = item.name;
          el.dataset.id = String(item.id);
          return el;
        },
      });

      const elementId1 = container.querySelector('[data-id="1"]');
      const elementId2 = container.querySelector('[data-id="2"]');

      // Reorder
      setItems([
        { id: 2, name: 'B' },
        { id: 1, name: 'A' },
      ]);

      // Elements should be the same instances
      const newElementId1 = container.querySelector('[data-id="1"]');
      const newElementId2 = container.querySelector('[data-id="2"]');

      expect(elementId1).toBe(newElementId1);
      expect(elementId2).toBe(newElementId2);
    });
  });

  describe('Reverse Order Bug Prevention', () => {
    it('should NOT reverse order when prepending item', () => {
      const [items, setItems] = createSignal([
        { id: 1, text: 'A' },
        { id: 2, text: 'B' },
      ]);

      const container = ForRegistry({
        each: items,
        key: (item) => item.id,
        children: (item) => {
          const el = document.createElement('div');
          el.textContent = item.text;
          el.dataset.id = String(item.id);
          return el;
        },
      });

      // Initial order: A, B
      let children = Array.from(container.childNodes) as HTMLElement[];
      expect(children[0].textContent).toBe('A');
      expect(children[1].textContent).toBe('B');

      // Prepend C
      setItems([
        { id: 3, text: 'C' },
        { id: 1, text: 'A' },
        { id: 2, text: 'B' },
      ]);

      // Order should be: C, A, B (NOT reversed)
      children = Array.from(container.childNodes) as HTMLElement[];
      expect(children[0].textContent).toBe('C');
      expect(children[1].textContent).toBe('A');
      expect(children[2].textContent).toBe('B');
    });

    it('should maintain order when inserting in middle', () => {
      const [items, setItems] = createSignal([
        { id: 1, text: 'A' },
        { id: 3, text: 'C' },
      ]);

      const container = ForRegistry({
        each: items,
        key: (item) => item.id,
        children: (item) => {
          const el = document.createElement('div');
          el.textContent = item.text;
          el.dataset.id = String(item.id);
          return el;
        },
      });

      // Insert B in middle
      setItems([
        { id: 1, text: 'A' },
        { id: 2, text: 'B' },
        { id: 3, text: 'C' },
      ]);

      const children = Array.from(container.childNodes) as HTMLElement[];
      expect(children[0].textContent).toBe('A');
      expect(children[1].textContent).toBe('B');
      expect(children[2].textContent).toBe('C');
    });

    it('should maintain order when removing from middle', () => {
      const [items, setItems] = createSignal([
        { id: 1, text: 'A' },
        { id: 2, text: 'B' },
        { id: 3, text: 'C' },
      ]);

      const container = ForRegistry({
        each: items,
        key: (item) => item.id,
        children: (item) => {
          const el = document.createElement('div');
          el.textContent = item.text;
          el.dataset.id = String(item.id);
          return el;
        },
      });

      // Remove B
      setItems([
        { id: 1, text: 'A' },
        { id: 3, text: 'C' },
      ]);

      const children = Array.from(container.childNodes) as HTMLElement[];
      expect(children[0].textContent).toBe('A');
      expect(children[1].textContent).toBe('C');
    });
  });

  describe('Index Accessor', () => {
    it('should provide index accessor to children', () => {
      const items = ['A', 'B', 'C'];

      const container = ForRegistry({
        each: items,
        children: (item, index) => {
          const el = document.createElement('div');
          el.textContent = `${index()}: ${item}`;
          return el;
        },
      });

      expect(container.childNodes[0].textContent).toBe('0: A');
      expect(container.childNodes[1].textContent).toBe('1: B');
      expect(container.childNodes[2].textContent).toBe('2: C');
    });

    it('should update index when items reorder', () => {
      const [items, setItems] = createSignal(['A', 'B', 'C']);

      const container = ForRegistry({
        each: items,
        key: (item) => item, // Use item value as key for proper reordering detection
        children: (item, index) => {
          const el = document.createElement('div');
          // Use wire to make index reactive - index() is a signal
          $REGISTRY.wire(el, 'textContent', () => {
            const idx = index();
            return `${idx}: ${item}`;
          });
          return el;
        },
      });

      // Initial state
      expect(container.childNodes[0].textContent).toBe('0: A');
      expect(container.childNodes[1].textContent).toBe('1: B');
      expect(container.childNodes[2].textContent).toBe('2: C');

      // Reorder - index() is reactive and returns NEW current position
      setItems(['C', 'B', 'A']);

      // Elements maintain same DOM nodes but index() returns current position
      expect(container.childNodes[0].textContent).toBe('0: C'); // C now at index 0
      expect(container.childNodes[1].textContent).toBe('1: B'); // B now at index 1
      expect(container.childNodes[2].textContent).toBe('2: A'); // A now at index 2
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined/null items gracefully', () => {
      const items = [undefined, null, 'A'] as any[];

      const container = ForRegistry({
        each: items,
        children: (item) => {
          const el = document.createElement('div');
          el.textContent = String(item);
          return el;
        },
      });

      expect(container.childNodes.length).toBe(3);
    });

    it('should handle rapid updates', () => {
      const [items, setItems] = createSignal([1]);

      const container = ForRegistry({
        each: items,
        children: (item) => {
          const el = document.createElement('div');
          el.textContent = String(item);
          return el;
        },
      });

      // Rapid updates
      for (let i = 2; i <= 10; i++) {
        setItems([...items(), i]);
      }

      expect(container.childNodes.length).toBe(10);
    });

    it('should handle duplicate keys', () => {
      const items = [
        { id: 1, name: 'A' },
        { id: 1, name: 'B' }, // Duplicate key - overwrites first item
        { id: 2, name: 'C' },
      ];

      const container = ForRegistry({
        each: items,
        key: (item) => item.id,
        children: (item) => {
          const el = document.createElement('div');
          el.textContent = item.name;
          return el;
        },
      });

      // Duplicate keys cause last item with that key to be used
      // Map will have: {1 => B element, 2 => C element}
      expect(container.childNodes.length).toBe(2);
      expect(container.childNodes[0].textContent).toBe('B'); // Last item with id=1
      expect(container.childNodes[1].textContent).toBe('C');
    });
  });

  describe('Memory Management', () => {
    it('should cleanup removed items', () => {
      const [items, setItems] = createSignal([1, 2, 3, 4, 5]);

      const container = ForRegistry({
        each: items,
        children: (item) => {
          const el = document.createElement('div');
          el.textContent = String(item);
          return el;
        },
      });

      // Remove items
      setItems([1, 2]);

      // Old items should be cleaned up
      expect(container.childNodes.length).toBe(2);
    });
  });
});
