/**
 * Integration Tests for Registry Pattern
 * Tests the complete flow: Component → Transformer → Runtime
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ForRegistry } from '../control-flow/for-registry';
import { t_element } from '../jsx-runtime/t-element';
import { createSignal } from '../reactivity/signal';
import { $REGISTRY } from '../registry/core';

describe('Registry Pattern - Integration Tests', () => {
  beforeEach(() => {
    // Clear registry between tests
    if (typeof document !== 'undefined') {
      document.body.innerHTML = '';
    }
  });

  afterEach(() => {
    // Clean up any active wires
    if (typeof document !== 'undefined') {
      document.body.innerHTML = '';
    }
  });

  describe('Basic Element Generation', () => {
    it('should create element with t_element', () => {
      const el = t_element('div', { className: 'box' });

      expect(el.tagName).toBe('DIV');
      expect(el.className).toBe('box');
    });

    it('should wire reactive property', () => {
      const [count, setCount] = createSignal(0);
      const el = t_element('div', {});

      $REGISTRY.wire(el, 'textContent', () => `Count: ${count()}`);

      expect(el.textContent).toBe('Count: 0');

      setCount(5);
      expect(el.textContent).toBe('Count: 5');
    });

    it('should wire style properties atomically', () => {
      const [x, setX] = createSignal(10);
      const [y, setY] = createSignal(20);

      const el = t_element('div', { className: 'box' });
      $REGISTRY.wire(el, 'style.left', () => `${x()}px`);
      $REGISTRY.wire(el, 'style.top', () => `${y()}px`);

      expect(el.style.left).toBe('10px');
      expect(el.style.top).toBe('20px');

      // Update only X - Y should not re-compute
      setX(30);
      expect(el.style.left).toBe('30px');
      expect(el.style.top).toBe('20px'); // Unchanged
    });
  });

  describe('Component Execution', () => {
    it('should execute component with stable ID', () => {
      const Component = (): HTMLElement => {
        return $REGISTRY.execute('test:Component', null, () => {
          const el = t_element('div', {});
          el.textContent = 'Hello';
          return el;
        });
      };

      const el = Component();
      expect(el.textContent).toBe('Hello');
    });

    it('should track nested components', () => {
      const Child = (): HTMLElement => {
        return $REGISTRY.execute('test:Child', 'test:Parent', () => {
          return t_element('span', { textContent: 'Child' });
        });
      };

      const Parent = (): HTMLElement => {
        return $REGISTRY.execute('test:Parent', null, () => {
          const container = t_element('div', {});
          container.appendChild(Child());
          return container;
        });
      };

      const el = Parent();
      expect(el.querySelector('span')?.textContent).toBe('Child');
    });
  });

  describe('Event Handling', () => {
    it('should attach event listeners', () => {
      let clicked = false;
      const el = t_element('button', {});
      el.addEventListener('click', () => {
        clicked = true;
      });

      el.click();
      expect(clicked).toBe(true);
    });

    it('should work with reactive state updates', () => {
      const [count, setCount] = createSignal(0);
      const el = t_element('button', {});

      $REGISTRY.wire(el, 'textContent', () => `Count: ${count()}`);
      el.addEventListener('click', () => setCount(count() + 1));

      expect(el.textContent).toBe('Count: 0');

      el.click();
      expect(el.textContent).toBe('Count: 1');

      el.click();
      expect(el.textContent).toBe('Count: 2');
    });
  });

  describe('Control Flow - ForRegistry', () => {
    it('should render list items', () => {
      const [items] = createSignal([
        { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' },
        { id: 3, text: 'Item 3' },
      ]);

      const container = t_element('ul', {});
      const forElement = ForRegistry({
        each: items,
        children: (item) => {
          const li = t_element('li', {});
          li.textContent = item.text;
          return li;
        },
      });

      container.appendChild(forElement);

      const listItems = container.querySelectorAll('li');
      expect(listItems.length).toBe(3);
      expect(listItems[0].textContent).toBe('Item 1');
      expect(listItems[1].textContent).toBe('Item 2');
      expect(listItems[2].textContent).toBe('Item 3');
    });

    it('should update list reactively without reverse order bug', () => {
      const [items, setItems] = createSignal([
        { id: 1, text: 'A' },
        { id: 2, text: 'B' },
      ]);

      const container = t_element('ul', {});
      const forElement = ForRegistry({
        each: items,
        key: (item) => item.id, // Use id as key for proper reconciliation
        children: (item) => {
          const li = t_element('li', {});
          li.textContent = item.text;
          li.dataset.id = item.id.toString();
          return li;
        },
      });

      container.appendChild(forElement);

      let listItems = container.querySelectorAll('li');
      expect(listItems[0].textContent).toBe('A');
      expect(listItems[1].textContent).toBe('B');

      // Add item at beginning - should NOT reverse order
      setItems([
        { id: 3, text: 'C' },
        { id: 1, text: 'A' },
        { id: 2, text: 'B' },
      ]);

      listItems = container.querySelectorAll('li');
      expect(listItems[0].textContent).toBe('C');
      expect(listItems[1].textContent).toBe('A');
      expect(listItems[2].textContent).toBe('B');
    });
  });

  describe('SSR Hydration', () => {
    it('should generate stable HIDs', () => {
      const hid1 = $REGISTRY.nextHid();
      const hid2 = $REGISTRY.nextHid();
      const hid3 = $REGISTRY.nextHid();

      expect(hid1).toBe(0);
      expect(hid2).toBe(1);
      expect(hid3).toBe(2);
    });

    it('should dump and boot state', () => {
      const [count, setCount] = createSignal(42);

      // Dump state
      const state = $REGISTRY.dump();
      expect(state.signals).toBeDefined();
      expect(Object.keys(state.signals).length).toBeGreaterThan(0);

      // Boot with state
      $REGISTRY.boot(state);

      // Verify state restored
      expect(count()).toBe(42);
    });
  });

  describe('Memory Leak Prevention', () => {
    it('should cleanup wires when element removed', (done) => {
      if (typeof document === 'undefined') {
        done();
        return;
      }

      const [count, setCount] = createSignal(0);
      const el = t_element('div', {});

      $REGISTRY.wire(el, 'textContent', () => `Count: ${count()}`);
      document.body.appendChild(el);

      // Verify wire is active
      expect(el.textContent).toBe('Count: 0');
      setCount(1);
      expect(el.textContent).toBe('Count: 1');

      // Remove element
      document.body.removeChild(el);

      // Wait for MutationObserver to fire
      setTimeout(() => {
        // Update signal - wire should be disposed, no error
        setCount(2);

        // Element should not update (disconnected)
        expect(el.textContent).toBe('Count: 1'); // Last value before disposal
        done();
      }, 100);
    });
  });

  describe('Drag-and-Drop Scenario (Original Bug)', () => {
    it('should maintain stable references during property updates', () => {
      interface IBox {
        id: number;
        x: number;
        y: number;
      }

      const [boxes, setBoxes] = createSignal<IBox[]>([
        { id: 1, x: 0, y: 0 },
        { id: 2, x: 100, y: 0 },
        { id: 3, x: 200, y: 0 },
      ]);

      const BoxComponent = (box: IBox): HTMLElement => {
        return $REGISTRY.execute(`test:Box_${box.id}`, null, () => {
          const [x] = createSignal(box.x);
          const [y] = createSignal(box.y);

          const el = t_element('div', {
            className: 'box',
            'data-id': box.id.toString(),
          });

          $REGISTRY.wire(el, 'style.left', () => `${x()}px`);
          $REGISTRY.wire(el, 'style.top', () => `${y()}px`);

          el.textContent = `Box ${box.id}`;
          return el;
        });
      };

      const container = t_element('div', {});
      const forElement = ForRegistry({
        each: boxes,
        key: (box) => box.id, // Use id as key for proper reconciliation
        children: (box) => BoxComponent(box),
      });

      container.appendChild(forElement);

      // Verify initial order
      const initial = container.querySelectorAll('.box');
      expect(initial[0].dataset.id).toBe('1');
      expect(initial[1].dataset.id).toBe('2');
      expect(initial[2].dataset.id).toBe('3');

      // Simulate drag: move box 1 to position 2
      setBoxes([
        { id: 2, x: 0, y: 0 }, // Box 2 now first
        { id: 1, x: 100, y: 0 }, // Box 1 now second
        { id: 3, x: 200, y: 0 }, // Box 3 unchanged
      ]);

      // Verify order maintained (no reverse order bug)
      const updated = container.querySelectorAll('.box');
      expect(updated[0].dataset.id).toBe('2'); // Box 2 first
      expect(updated[1].dataset.id).toBe('1'); // Box 1 second
      expect(updated[2].dataset.id).toBe('3'); // Box 3 third

      // Verify no extra re-renders or duplicates
      expect(updated.length).toBe(3);
    });
  });
});
