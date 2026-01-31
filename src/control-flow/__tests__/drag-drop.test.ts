/**
 * Drag-and-Drop Integration Test
 * Verifies ForRegistry handles move operations without reversing order
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ForRegistry } from '../../control-flow/for-registry';
import { t_element } from '../../jsx-runtime/t-element';
import { createSignal } from '../../reactivity/signal';
import { $REGISTRY } from '../../registry/core';

interface IBox {
  id: number;
  x: number;
  y: number;
  color: string;
}

describe('ForRegistry Drag-and-Drop Integration', () => {
  beforeEach(() => {
    $REGISTRY.reset();
  });

  afterEach(() => {
    $REGISTRY.reset();
  });

  it('should maintain stable DOM nodes when array reorders', () => {
    const [boxes, setBoxes] = createSignal<IBox[]>([
      { id: 1, x: 0, y: 0, color: 'red' },
      { id: 2, x: 100, y: 0, color: 'blue' },
      { id: 3, x: 200, y: 0, color: 'green' },
    ]);

    const container = document.createElement('div');
    const forElement = ForRegistry({
      each: boxes,
      key: (box) => box.id,
      children: (box) => {
        const el = t_element('div', {
          'data-id': String(box.id),
          className: 'box',
        }) as HTMLElement;
        el.textContent = box.color;
        return el;
      },
    });

    container.appendChild(forElement);

    // Store references to original DOM nodes
    const originals = Array.from(container.querySelectorAll('.box'));
    expect(originals).toHaveLength(3);
    expect(originals[0].textContent).toBe('red');
    expect(originals[1].textContent).toBe('blue');
    expect(originals[2].textContent).toBe('green');

    // Reorder: move first item to end
    setBoxes([
      { id: 2, x: 100, y: 0, color: 'blue' },
      { id: 3, x: 200, y: 0, color: 'green' },
      { id: 1, x: 0, y: 0, color: 'red' },
    ]);

    // Check new order
    const reordered = Array.from(container.querySelectorAll('.box'));
    expect(reordered).toHaveLength(3);
    expect(reordered[0].textContent).toBe('blue');
    expect(reordered[1].textContent).toBe('green');
    expect(reordered[2].textContent).toBe('red');

    // CRITICAL: Verify same DOM nodes (not recreated)
    expect(reordered[0]).toBe(originals[1]); // blue node moved
    expect(reordered[1]).toBe(originals[2]); // green node moved
    expect(reordered[2]).toBe(originals[0]); // red node moved
  });

  it('should handle complex drag-and-drop reordering', () => {
    const [items, setItems] = createSignal([1, 2, 3, 4, 5]);

    const container = document.createElement('div');
    const forElement = ForRegistry({
      each: items,
      key: (item) => item,
      children: (item) => {
        const el = t_element('div', { 'data-value': String(item) }) as HTMLElement;
        el.textContent = `Item ${item}`;
        return el;
      },
    });

    container.appendChild(forElement);

    const originals = Array.from(container.querySelectorAll('[data-value]'));

    // Simulate drag: move item 2 to position 4
    setItems([1, 3, 4, 5, 2]);

    const reordered = Array.from(container.querySelectorAll('[data-value]'));

    // Check order
    expect(reordered.map((el) => el.textContent)).toEqual([
      'Item 1',
      'Item 3',
      'Item 4',
      'Item 5',
      'Item 2',
    ]);

    // Verify same nodes
    expect(reordered[0]).toBe(originals[0]); // 1 stayed
    expect(reordered[1]).toBe(originals[2]); // 3 moved forward
    expect(reordered[2]).toBe(originals[3]); // 4 moved forward
    expect(reordered[3]).toBe(originals[4]); // 5 moved forward
    expect(reordered[4]).toBe(originals[1]); // 2 moved to end
  });

  it('should handle reverse operation', () => {
    const [items, setItems] = createSignal([1, 2, 3]);

    const container = document.createElement('div');
    const forElement = ForRegistry({
      each: items,
      key: (item) => item,
      children: (item) => {
        const el = t_element('span') as HTMLElement; // Use span to avoid container confusion
        el.textContent = String(item);
        return el;
      },
    });

    container.appendChild(forElement);

    const originals = Array.from(container.querySelectorAll('span'));

    // Reverse array
    setItems([3, 2, 1]);

    const reversed = Array.from(container.querySelectorAll('span'));

    expect(reversed[0].textContent).toBe('3');
    expect(reversed[1].textContent).toBe('2');
    expect(reversed[2].textContent).toBe('1');

    // Same nodes, just reordered
    expect(reversed[0]).toBe(originals[2]);
    expect(reversed[1]).toBe(originals[1]);
    expect(reversed[2]).toBe(originals[0]);
  });

  it('should handle add/remove during reorder', () => {
    const [items, setItems] = createSignal([1, 2, 3]);

    const container = document.createElement('div');
    const forElement = ForRegistry({
      each: items,
      key: (item) => item,
      children: (item) => {
        const el = t_element('span', { 'data-item': String(item) }) as HTMLElement;
        el.textContent = String(item);
        return el;
      },
    });

    container.appendChild(forElement);

    const originals = Array.from(container.querySelectorAll('span[data-item]'));

    // Remove item 2, add item 4, reorder
    setItems([3, 1, 4]);

    const updated = Array.from(container.querySelectorAll('span[data-item]'));

    expect(updated).toHaveLength(3);
    expect(updated.map((el) => el.textContent)).toEqual(['3', '1', '4']);

    // Item 3 and 1 should be same nodes
    expect(updated[0]).toBe(originals[2]); // 3 moved to front
    expect(updated[1]).toBe(originals[0]); // 1 moved to middle
    // Item 4 is new node
    expect(updated[2]).not.toBe(originals[1]);
  });

  it('should maintain element identity across multiple operations', () => {
    const [items, setItems] = createSignal([1, 2, 3]);

    const container = document.createElement('div');
    const forElement = ForRegistry({
      each: items,
      key: (item) => item,
      children: (item) => {
        const el = t_element('span', { 'data-track': 'item' }) as HTMLElement;
        el.textContent = String(item);
        // Mark with unique ID to track identity
        (el as any).__itemId = item;
        return el;
      },
    });

    container.appendChild(forElement);

    // Operation 1: Reorder
    setItems([2, 3, 1]);
    let elements = Array.from(container.querySelectorAll('span[data-track="item"]'));
    expect((elements[0] as any).__itemId).toBe(2);
    expect((elements[1] as any).__itemId).toBe(3);
    expect((elements[2] as any).__itemId).toBe(1);

    // Operation 2: Add item
    setItems([2, 3, 1, 4]);
    elements = Array.from(container.querySelectorAll('span[data-track="item"]'));
    expect((elements[0] as any).__itemId).toBe(2);
    expect((elements[1] as any).__itemId).toBe(3);
    expect((elements[2] as any).__itemId).toBe(1);
    expect((elements[3] as any).__itemId).toBe(4);

    // Operation 3: Remove and reorder
    setItems([4, 1, 3]);
    elements = Array.from(container.querySelectorAll('span[data-track="item"]'));
    expect(elements).toHaveLength(3);
    expect((elements[0] as any).__itemId).toBe(4);
    expect((elements[1] as any).__itemId).toBe(1);
    expect((elements[2] as any).__itemId).toBe(3);
  });
});
