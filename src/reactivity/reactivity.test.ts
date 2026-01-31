import { afterEach, beforeEach } from 'vitest';
import { $REGISTRY } from '../registry/core';
import { createEffect } from './effect/create-effect';
import { createMemo } from './memo/create-memo';
import { createSignal } from './signal';

describe('Reactivity System', () => {
  beforeEach(() => {
    $REGISTRY.reset();
  });

  afterEach(() => {
    $REGISTRY.reset();
  });

  describe('Signal', () => {
    it('should create a signal with initial value', () => {
      const [count, setCount] = createSignal(0);
      expect(count()).toBe(0);
    });

    it('should update signal value', () => {
      const [count, setCount] = createSignal(0);
      setCount(5);
      expect(count()).toBe(5);
    });

    it('should update signal with function', () => {
      const [count, setCount] = createSignal(0);
      setCount((prev) => prev + 1);
      expect(count()).toBe(1);
    });

    it('should notify subscribers on change', () => {
      const [count, setCount] = createSignal(0);
      let notified = false;

      const dispose = createEffect(() => {
        count(); // Read to subscribe
        notified = true;
      });

      notified = false;
      setCount(1);
      expect(notified).toBe(true);

      dispose();
    });
  });

  describe('Effect', () => {
    it('should execute immediately', () => {
      let executed = false;

      const dispose = createEffect(() => {
        executed = true;
      });

      expect(executed).toBe(true);
      dispose();
    });

    it('should track signal dependencies', () => {
      const [count, setCount] = createSignal(0);
      let effectCount = 0;

      const dispose = createEffect(() => {
        count(); // Read to track
        effectCount++;
      });

      expect(effectCount).toBe(1);

      setCount(1);
      expect(effectCount).toBe(2);

      setCount(2);
      expect(effectCount).toBe(3);

      dispose();
    });

    it('should run cleanup function', () => {
      let cleaned = false;

      const dispose = createEffect(() => {
        return () => {
          cleaned = true;
        };
      });

      expect(cleaned).toBe(false);
      dispose();
      expect(cleaned).toBe(true);
    });
  });

  describe('Memo', () => {
    it('should compute value lazily', () => {
      const [count, setCount] = createSignal(0);
      let computeCount = 0;

      const doubled = createMemo(() => {
        computeCount++;
        return count() * 2;
      });

      expect(computeCount).toBe(0); // Not computed yet

      expect(doubled()).toBe(0);
      expect(computeCount).toBe(1);

      // Reading again should not recompute
      expect(doubled()).toBe(0);
      expect(computeCount).toBe(1);
    });

    it('should recompute when dependencies change', () => {
      const [count, setCount] = createSignal(5);
      let computeCount = 0;

      const doubled = createMemo(() => {
        computeCount++;
        return count() * 2;
      });

      expect(doubled()).toBe(10);
      expect(computeCount).toBe(1);

      setCount(10);
      expect(doubled()).toBe(20);
      expect(computeCount).toBe(2);
    });
  });

  describe('Integration', () => {
    it('should support complex reactive flows', () => {
      const [count, setCount] = createSignal(1);
      const [multiplier, setMultiplier] = createSignal(2);

      const result = createMemo(() => count() * multiplier());

      let effectRuns = 0;
      const dispose = createEffect(() => {
        result(); // Track
        effectRuns++;
      });

      expect(result()).toBe(2);
      expect(effectRuns).toBe(1);

      setCount(3);
      expect(result()).toBe(6);
      expect(effectRuns).toBe(2);

      setMultiplier(4);
      expect(result()).toBe(12);
      expect(effectRuns).toBe(3);

      dispose();
    });
  });
});
