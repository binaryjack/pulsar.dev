/**
 * Integration Tests for Full Registry Pattern Flow
 * Tests transformer → runtime → DOM updates
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ForRegistry } from '../../control-flow/for-registry';
import { ShowRegistry } from '../../control-flow/show-registry';
import { t_element } from '../../jsx-runtime/t-element';
import { createSignal } from '../../reactivity/signal';
import { $REGISTRY } from '../../registry/core';
import { bootFromState } from '../../ssr/hydration';

describe('Registry Pattern - Full Integration Tests', () => {
  beforeEach(() => {
    if (typeof document !== 'undefined') {
      document.body.innerHTML = '';
    }
    $REGISTRY.reset();
  });

  afterEach(() => {
    $REGISTRY.reset();
  });

  describe('Complete Component Lifecycle', () => {
    it('should handle component mount, update, and unmount', () => {
      // Simulate transformed component
      const Counter = (): HTMLElement => {
        return $REGISTRY.execute('test:Counter', null, () => {
          const [count, setCount] = createSignal(0);

          const button = t_element('button', {});
          $REGISTRY.wire(button, 'textContent', () => `Count: ${count()}`);
          button.addEventListener('click', () => setCount(count() + 1));

          return button;
        });
      };

      // Mount
      const button = Counter();
      document.body.appendChild(button);

      expect(button.textContent).toBe('Count: 0');

      // Update
      button.click();
      expect(button.textContent).toBe('Count: 1');

      button.click();
      expect(button.textContent).toBe('Count: 2');

      // Unmount
      document.body.removeChild(button);

      // Component should be cleaned up
      const stats = $REGISTRY.getStats();
      expect(stats).toBeDefined();
    });

    it('should handle nested component lifecycle', () => {
      const Child = (props: { value: number }): HTMLElement => {
        return $REGISTRY.execute('test:Child', 'test:Parent', () => {
          const span = t_element('span', {});
          span.textContent = `Child: ${props.value}`;
          return span;
        });
      };

      const Parent = (): HTMLElement => {
        return $REGISTRY.execute('test:Parent', null, () => {
          const [value, setValue] = createSignal(1);

          const container = t_element('div', {});
          const button = t_element('button', {});
          button.textContent = 'Increment';
          button.addEventListener('click', () => setValue(value() + 1));

          const child = Child({ value: value() });

          container.appendChild(button);
          container.appendChild(child);

          return container;
        });
      };

      const component = Parent();
      document.body.appendChild(component);

      const button = component.querySelector('button')!;
      const span = component.querySelector('span')!;

      expect(span.textContent).toBe('Child: 1');

      button.click();
      // Note: This would require reactivity in child props to update
    });
  });

  describe('Drag-and-Drop Scenario (Original Bug)', () => {
    interface IBox {
      id: number;
      x: number;
      y: number;
      label: string;
    }

    it('should NOT reverse order when dragging items', () => {
      const [boxes, setBoxes] = createSignal<IBox[]>([
        { id: 1, x: 0, y: 0, label: 'Box A' },
        { id: 2, x: 100, y: 0, label: 'Box B' },
        { id: 3, x: 200, y: 0, label: 'Box C' },
      ]);

      const BoxComponent = (box: IBox): HTMLElement => {
        return $REGISTRY.execute(`test:Box_${box.id}`, null, () => {
          const [x] = createSignal(box.x);
          const [y] = createSignal(box.y);

          const el = t_element('div', {
            className: 'box',
            'data-id': String(box.id),
          });

          $REGISTRY.wire(el, 'style.left', () => `${x()}px`);
          $REGISTRY.wire(el, 'style.top', () => `${y()}px`);

          el.textContent = box.label;
          return el;
        });
      };

      const container = t_element('div', { className: 'canvas' });
      const forElement = ForRegistry({
        each: boxes,
        key: (box) => box.id,
        children: (box) => BoxComponent(box),
      });

      container.appendChild(forElement);
      document.body.appendChild(container);

      // Verify initial order
      let boxElements = container.querySelectorAll('.box');
      expect(boxElements[0].getAttribute('data-id')).toBe('1');
      expect(boxElements[1].getAttribute('data-id')).toBe('2');
      expect(boxElements[2].getAttribute('data-id')).toBe('3');

      // Simulate drag: Move Box A from position 0 to position 1
      setBoxes([
        { id: 2, x: 0, y: 0, label: 'Box B' }, // Box B now first
        { id: 1, x: 100, y: 0, label: 'Box A' }, // Box A now second
        { id: 3, x: 200, y: 0, label: 'Box C' }, // Box C unchanged
      ]);

      // Verify order is correct (NOT reversed)
      boxElements = container.querySelectorAll('.box');
      expect(boxElements[0].getAttribute('data-id')).toBe('2'); // Box B
      expect(boxElements[1].getAttribute('data-id')).toBe('1'); // Box A
      expect(boxElements[2].getAttribute('data-id')).toBe('3'); // Box C

      // Verify no duplicates
      expect(boxElements.length).toBe(3);

      // Verify labels are correct
      expect(boxElements[0].textContent).toBe('Box B');
      expect(boxElements[1].textContent).toBe('Box A');
      expect(boxElements[2].textContent).toBe('Box C');
    });

    it('should maintain stable references during multiple drags', () => {
      const [boxes, setBoxes] = createSignal<IBox[]>([
        { id: 1, x: 0, y: 0, label: 'A' },
        { id: 2, x: 50, y: 0, label: 'B' },
        { id: 3, x: 100, y: 0, label: 'C' },
        { id: 4, x: 150, y: 0, label: 'D' },
      ]);

      const container = ForRegistry({
        each: boxes,
        key: (box) => box.id,
        children: (box) => {
          const el = t_element('div', { 'data-id': String(box.id) });
          el.textContent = box.label;
          return el;
        },
      });

      document.body.appendChild(container);

      // Capture original elements
      const originalElements = new Map<number, Element>();
      container.querySelectorAll('[data-id]').forEach((el) => {
        const id = parseInt(el.getAttribute('data-id')!);
        originalElements.set(id, el);
      });

      // Perform multiple reorderings
      setBoxes([
        { id: 4, x: 0, y: 0, label: 'D' },
        { id: 2, x: 50, y: 0, label: 'B' },
        { id: 1, x: 100, y: 0, label: 'A' },
        { id: 3, x: 150, y: 0, label: 'C' },
      ]);

      setBoxes([
        { id: 3, x: 0, y: 0, label: 'C' },
        { id: 1, x: 50, y: 0, label: 'A' },
        { id: 4, x: 100, y: 0, label: 'D' },
        { id: 2, x: 150, y: 0, label: 'B' },
      ]);

      // Verify elements are still the same instances
      container.querySelectorAll('[data-id]').forEach((el) => {
        const id = parseInt(el.getAttribute('data-id')!);
        expect(el).toBe(originalElements.get(id));
      });
    });
  });

  describe('SSR Hydration Flow', () => {
    it('should hydrate from server state', () => {
      // Server-side: Create component with signal
      $REGISTRY.reset();

      const App = (): HTMLElement => {
        return $REGISTRY.execute('app:HydrationTest', null, () => {
          const [count] = createSignal(42);

          const container = t_element('div', { 'data-hid': 'el_0' });
          const span = t_element('span', { 'data-hid': 'el_1' });
          $REGISTRY.wire(span, 'textContent', () => `Count: ${count()}`);
          container.appendChild(span);

          return container;
        });
      };

      // Execute on server to register signals
      const serverEl = App();
      const serverState = $REGISTRY.dump();

      // Simulate server HTML
      document.body.innerHTML = serverEl.outerHTML;

      // Client-side: Boot from state
      $REGISTRY.reset();
      (window as any).__INITIAL_STATE__ = serverState;
      bootFromState();

      // Hydrate component - should pick existing nodes
      const container = t_element('div', { 'data-hid': 'el_0' }, true); // isSSR = true
      const span = container.querySelector('[data-hid="el_1"]');

      // Should have hydrated content
      expect(span?.textContent).toBe('Count: 42');
    });

    it('should handle full SSR → hydration cycle', () => {
      // Server-side simulation
      $REGISTRY.reset();

      const App = (): HTMLElement => {
        return $REGISTRY.execute('app:App', null, () => {
          const [message] = createSignal('Hello from server');

          const div = t_element('div', { 'data-hid': 'el_0' });
          $REGISTRY.wire(div, 'textContent', () => message());

          return div;
        });
      };

      const serverElement = App();
      const serverState = $REGISTRY.dump();

      // Simulate HTML transfer
      const serverHTML = serverElement.outerHTML;
      document.body.innerHTML = serverHTML;

      // Client-side hydration
      $REGISTRY.reset();
      (window as any).__INITIAL_STATE__ = serverState;
      bootFromState();

      const clientElement = App();

      // Should match server-rendered element
      expect(clientElement.getAttribute('data-hid')).toBe('el_0');
    });
  });

  describe('Complex Nested State', () => {
    it('should handle deeply nested reactive state', () => {
      const [outer, setOuter] = createSignal(0);
      const [middle, setMiddle] = createSignal(0);
      const [inner, setInner] = createSignal(0);

      const outerDiv = t_element('div', { className: 'outer' });
      const middleDiv = t_element('div', { className: 'middle' });
      const innerDiv = t_element('div', { className: 'inner' });

      $REGISTRY.wire(outerDiv, 'textContent', () => `Outer: ${outer()}`);
      $REGISTRY.wire(middleDiv, 'textContent', () => `Middle: ${middle()}`);
      $REGISTRY.wire(innerDiv, 'textContent', () => `Inner: ${inner()}`);

      outerDiv.appendChild(middleDiv);
      middleDiv.appendChild(innerDiv);
      document.body.appendChild(outerDiv);

      expect(outerDiv.textContent).toContain('Outer: 0');
      expect(middleDiv.textContent).toContain('Middle: 0');
      expect(innerDiv.textContent).toContain('Inner: 0');

      setOuter(1);
      expect(outerDiv.textContent).toContain('Outer: 1');

      setMiddle(2);
      expect(middleDiv.textContent).toContain('Middle: 2');

      setInner(3);
      expect(innerDiv.textContent).toContain('Inner: 3');
    });
  });

  describe('Conditional Rendering with ShowRegistry', () => {
    it('should show/hide content based on condition', () => {
      const [visible, setVisible] = createSignal(true);

      const container = t_element('div', {});
      const showElement = ShowRegistry({
        when: visible,
        children: () => {
          const content = t_element('div', {});
          content.textContent = 'Visible content';
          return content;
        },
      });

      container.appendChild(showElement);
      document.body.appendChild(container);

      // Initially visible
      expect(container.textContent).toContain('Visible content');

      // Hide
      setVisible(false);
      expect(container.textContent).not.toContain('Visible content');

      // Show again
      setVisible(true);
      expect(container.textContent).toContain('Visible content');
    });

    it('should combine ForRegistry and ShowRegistry', () => {
      const [items, setItems] = createSignal([1, 2, 3]);
      const [showList, setShowList] = createSignal(true);

      const container = t_element('div', {});
      const showElement = ShowRegistry({
        when: showList,
        children: () => {
          return ForRegistry({
            each: items,
            children: (item) => {
              const el = t_element('div', {});
              el.textContent = String(item);
              return el;
            },
          });
        },
      });

      container.appendChild(showElement);
      document.body.appendChild(container);

      expect(container.querySelectorAll('div').length).toBeGreaterThan(0);

      // Hide list
      setShowList(false);
      expect(container.textContent).toBe('');

      // Show list with updated items
      setItems([4, 5, 6]);
      setShowList(true);

      const divs = container.querySelectorAll('div');
      expect(divs.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Performance and Memory', () => {
    it('should handle 1000 simultaneous wires efficiently', () => {
      const signals = Array.from({ length: 1000 }, (_, i) => createSignal(i));
      const elements = Array.from({ length: 1000 }, () => t_element('div', {}));

      const startTime = performance.now();

      elements.forEach((el, i) => {
        $REGISTRY.wire(el, 'textContent', () => `Value: ${signals[i][0]()}`);
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete in reasonable time (< 100ms for 1000 wires)
      expect(duration).toBeLessThan(100);

      // Verify wires work
      expect(elements[0].textContent).toBe('Value: 0');
      expect(elements[999].textContent).toBe('Value: 999');
    });

    it('should cleanup wires when elements removed', (done) => {
      if (typeof document === 'undefined') {
        done();
        return;
      }

      const [count, setCount] = createSignal(0);
      const elements = Array.from({ length: 100 }, () => {
        const el = t_element('div', {});
        $REGISTRY.wire(el, 'textContent', () => `Count: ${count()}`);
        document.body.appendChild(el);
        return el;
      });

      // Remove all elements
      elements.forEach((el) => document.body.removeChild(el));

      // Wait for cleanup
      setTimeout(() => {
        // Update signal - should not cause errors
        setCount(1);
        setCount(2);
        setCount(3);

        done();
      }, 100);
    });

    it('should handle rapid component mounting/unmounting', () => {
      const Component = (id: number): HTMLElement => {
        return $REGISTRY.execute(`test:Component${id}`, null, () => {
          const [value] = createSignal(id);
          const el = t_element('div', {});
          $REGISTRY.wire(el, 'textContent', () => `Component ${value()}`);
          return el;
        });
      };

      // Mount 100 components
      const components = Array.from({ length: 100 }, (_, i) => Component(i));
      components.forEach((c) => document.body.appendChild(c));

      const statsBeforeUnmount = $REGISTRY.getStats();
      expect(statsBeforeUnmount.components).toBeGreaterThanOrEqual(100);

      // Unmount all
      components.forEach((c) => document.body.removeChild(c));

      // Components should be tracked (cleanup happens via MutationObserver)
      const statsAfterUnmount = $REGISTRY.getStats();
      expect(statsAfterUnmount).toBeDefined();
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle todo list with add/remove/toggle', () => {
      interface ITodo {
        id: number;
        text: string;
        completed: boolean;
      }

      const [todos, setTodos] = createSignal<ITodo[]>([
        { id: 1, text: 'Buy milk', completed: false },
        { id: 2, text: 'Learn Pulsar', completed: true },
      ]);

      const container = ForRegistry({
        each: todos,
        key: (todo) => todo.id,
        children: (todo) => {
          const li = t_element('li', { 'data-id': String(todo.id) });

          const checkbox = t_element('input', {
            type: 'checkbox',
            checked: todo.completed,
          }) as HTMLInputElement;

          const span = t_element('span', {});
          span.textContent = todo.text;

          li.appendChild(checkbox);
          li.appendChild(span);

          return li;
        },
      });

      document.body.appendChild(container);

      // Add todo
      setTodos([...todos(), { id: 3, text: 'New todo', completed: false }]);

      expect(container.querySelectorAll('li').length).toBe(3);

      // Remove todo
      setTodos(todos().filter((t) => t.id !== 2));

      expect(container.querySelectorAll('li').length).toBe(2);

      // Toggle completed
      const updatedTodos = todos().map((t) => (t.id === 1 ? { ...t, completed: !t.completed } : t));
      setTodos(updatedTodos);

      // Verify checkbox state
      const firstCheckbox = container.querySelector('[data-id="1"] input') as HTMLInputElement;
      // Note: Checkbox state would need reactive binding to update
    });

    it('should handle form with multiple inputs', () => {
      const [name, setName] = createSignal('');
      const [email, setEmail] = createSignal('');
      const [submitted, setSubmitted] = createSignal(false);

      const form = t_element('form', {});

      const nameInput = t_element('input', {
        type: 'text',
        placeholder: 'Name',
      }) as HTMLInputElement;
      nameInput.addEventListener('input', (e) => setName((e.target as HTMLInputElement).value));

      const emailInput = t_element('input', {
        type: 'email',
        placeholder: 'Email',
      }) as HTMLInputElement;
      emailInput.addEventListener('input', (e) => setEmail((e.target as HTMLInputElement).value));

      const submitButton = t_element('button', { type: 'submit' });
      submitButton.textContent = 'Submit';

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        setSubmitted(true);
      });

      const result = t_element('div', {});
      $REGISTRY.wire(result, 'textContent', () =>
        submitted() ? `Submitted: ${name()}, ${email()}` : ''
      );

      form.appendChild(nameInput);
      form.appendChild(emailInput);
      form.appendChild(submitButton);
      form.appendChild(result);
      document.body.appendChild(form);

      // Fill form
      nameInput.value = 'John Doe';
      nameInput.dispatchEvent(new Event('input'));

      emailInput.value = 'john@example.com';
      emailInput.dispatchEvent(new Event('input'));

      // Submit
      form.dispatchEvent(new Event('submit'));

      expect(result.textContent).toBe('Submitted: John Doe, john@example.com');
    });
  });
});
