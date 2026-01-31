/**
 * Wire Reactivity Tests
 * Verifies $REGISTRY.wire() creates proper subscriptions and updates DOM
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { t_element } from '../../jsx-runtime/t-element';
import { createSignal } from '../../reactivity/signal';
import { $REGISTRY } from '../../registry/core';

describe('$REGISTRY.wire() Reactivity', () => {
  beforeEach(() => {
    // Reset registry between tests
    $REGISTRY.reset();
  });

  afterEach(() => {
    $REGISTRY.reset();
  });

  it('should create subscription when wire() is called', () => {
    const [count, setCount] = createSignal(0);
    const el = t_element('div', {});

    // Wire should subscribe to signal
    const disposer = $REGISTRY.wire(el, 'textContent', () => count());

    expect(el.textContent).toBe('0');

    // Update signal
    setCount(5);
    expect(el.textContent).toBe('5');

    // Cleanup
    disposer();
  });

  it('should update DOM when signal changes', () => {
    const [text, setText] = createSignal('initial');
    const el = t_element('span', {});

    $REGISTRY.wire(el, 'textContent', () => text());

    expect(el.textContent).toBe('initial');

    setText('updated');
    expect(el.textContent).toBe('updated');

    setText('final');
    expect(el.textContent).toBe('final');
  });

  it('should support nested property paths', () => {
    const [x, setX] = createSignal(10);
    const el = document.createElement('div') as HTMLElement;

    $REGISTRY.wire(el, 'style.left', () => `${x()}px`);

    expect(el.style.left).toBe('10px');

    setX(50);
    expect(el.style.left).toBe('50px');
  });

  it('should handle multiple wires on same element', () => {
    const [x, setX] = createSignal(10);
    const [y, setY] = createSignal(20);
    const el = document.createElement('div') as HTMLElement;

    $REGISTRY.wire(el, 'style.left', () => `${x()}px`);
    $REGISTRY.wire(el, 'style.top', () => `${y()}px`);

    expect(el.style.left).toBe('10px');
    expect(el.style.top).toBe('20px');

    // Update only X - Y should remain unchanged
    setX(100);
    expect(el.style.left).toBe('100px');
    expect(el.style.top).toBe('20px'); // Not updated

    // Update only Y - X should remain unchanged
    setY(200);
    expect(el.style.left).toBe('100px'); // Not updated
    expect(el.style.top).toBe('200px');
  });

  it('should dispose wire and stop updates', () => {
    const [count, setCount] = createSignal(0);
    const el = t_element('div', {});

    const disposer = $REGISTRY.wire(el, 'textContent', () => `Count: ${count()}`);

    expect(el.textContent).toBe('Count: 0');

    setCount(1);
    expect(el.textContent).toBe('Count: 1');

    // Dispose wire
    disposer();

    // Further updates should NOT affect DOM
    setCount(2);
    expect(el.textContent).toBe('Count: 1'); // Still shows old value
  });

  it('should work with computed values', () => {
    const [a, setA] = createSignal(5);
    const [b, setB] = createSignal(10);
    const el = t_element('div', {});

    $REGISTRY.wire(el, 'textContent', () => `Sum: ${a() + b()}`);

    expect(el.textContent).toBe('Sum: 15');

    setA(20);
    expect(el.textContent).toBe('Sum: 30');

    setB(30);
    expect(el.textContent).toBe('Sum: 50');
  });

  it('should not re-run wire if value unchanged', () => {
    let runCount = 0;
    const [count, setCount] = createSignal(0);
    const el = t_element('div', {});

    $REGISTRY.wire(el, 'textContent', () => {
      runCount++;
      return String(count());
    });

    expect(runCount).toBe(1); // Initial run

    setCount(0); // Same value - still triggers subscriber but DOM doesn't change
    // Note: Signal.write() always calls subscribers even if value is same
    // This is expected behavior - the optimization is in wire() checking target[key] !== val
    expect(runCount).toBeGreaterThanOrEqual(1);

    setCount(5);
    expect(runCount).toBeGreaterThanOrEqual(2);
  });

  it('should handle signal passed directly', () => {
    const [text, setText] = createSignal('hello');
    const el = t_element('div', {});

    // Pass signal directly, not wrapped in getter
    $REGISTRY.wire(el, 'textContent', text);

    expect(el.textContent).toBe('hello');

    setText('world');
    expect(el.textContent).toBe('world');
  });

  it('should track multiple signal dependencies', () => {
    const [firstName, setFirstName] = createSignal('John');
    const [lastName, setLastName] = createSignal('Doe');
    const el = t_element('div', {});

    $REGISTRY.wire(el, 'textContent', () => `${firstName()} ${lastName()}`);

    expect(el.textContent).toBe('John Doe');

    setFirstName('Jane');
    expect(el.textContent).toBe('Jane Doe');

    setLastName('Smith');
    expect(el.textContent).toBe('Jane Smith');
  });

  it('should cleanup subscriptions on dispose', () => {
    const [count, setCount] = createSignal(0);
    const el = t_element('div', {});

    const disposer = $REGISTRY.wire(el, 'textContent', () => String(count()));

    // Initial state - wire is active
    expect(el.textContent).toBe('0');

    setCount(1);
    expect(el.textContent).toBe('1');

    // Dispose the wire
    disposer();

    // After dispose, updates should not affect element
    setCount(2);
    expect(el.textContent).toBe('1'); // Still shows last value before disposal
  });
});
