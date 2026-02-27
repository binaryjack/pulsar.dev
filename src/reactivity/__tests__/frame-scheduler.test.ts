/**
 * Unit Tests — Frame Scheduler
 *
 * Covers:
 *   scheduleFrame()  — anonymous callbacks, named (dedup) callbacks
 *   cancelFrame()    — removes a named callback before it runs
 *   flushFrames()    — synchronous flush for tests
 *   clearFrames()    — discard all pending without running
 *   error isolation  — one failing callback must not kill the rest
 *   re-entrancy      — callbacks that call scheduleFrame go to next frame
 *   SSR fallback     — synchronous execution when rAF is unavailable
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cancelFrame, clearFrames, flushFrames, scheduleFrame } from '../frame-scheduler';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

describe('Frame Scheduler', () => {
  afterEach(() => {
    clearFrames();
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // Basic scheduling — synchronous flush
  // -------------------------------------------------------------------------

  describe('scheduleFrame() + flushFrames()', () => {
    it('runs an anonymous callback when flushed', () => {
      let ran = false;
      scheduleFrame(() => {
        ran = true;
      });
      expect(ran).toBe(false); // not yet

      flushFrames();
      expect(ran).toBe(true);
    });

    it('runs all anonymous callbacks in insertion order', () => {
      const order: number[] = [];
      scheduleFrame(() => order.push(1));
      scheduleFrame(() => order.push(2));
      scheduleFrame(() => order.push(3));

      flushFrames();
      expect(order).toEqual([1, 2, 3]);
    });

    it('does not run callbacks twice after a single flush', () => {
      let count = 0;
      scheduleFrame(() => count++);

      flushFrames();
      flushFrames(); // second flush: queue is empty

      expect(count).toBe(1);
    });

    it('runs callbacks again after a new scheduleFrame call', () => {
      let count = 0;
      scheduleFrame(() => count++);
      flushFrames();

      scheduleFrame(() => count++);
      flushFrames();

      expect(count).toBe(2);
    });
  });

  // -------------------------------------------------------------------------
  // Named (dedup) callbacks
  // -------------------------------------------------------------------------

  describe('named deduplication', () => {
    it('runs a named callback when flushed', () => {
      let value = 0;
      scheduleFrame(() => {
        value = 42;
      }, 'set-value');

      flushFrames();
      expect(value).toBe(42);
    });

    it('only runs the LAST callback for a given key within one frame', () => {
      const results: number[] = [];
      scheduleFrame(() => results.push(1), 'key');
      scheduleFrame(() => results.push(2), 'key');
      scheduleFrame(() => results.push(3), 'key');

      flushFrames();
      // Only the last one (3) should have run
      expect(results).toEqual([3]);
    });

    it('runs different keys independently', () => {
      let a = 0;
      let b = 0;
      scheduleFrame(() => (a = 1), 'key-a');
      scheduleFrame(() => (b = 1), 'key-b');

      flushFrames();
      expect(a).toBe(1);
      expect(b).toBe(1);
    });

    it('symbol keys work the same as string keys', () => {
      const KEY = Symbol('myKey');
      const results: number[] = [];
      scheduleFrame(() => results.push(1), KEY);
      scheduleFrame(() => results.push(2), KEY);

      flushFrames();
      expect(results).toEqual([2]);
    });

    it('runs named callbacks before anonymous callbacks', () => {
      const order: string[] = [];
      scheduleFrame(() => order.push('anon'));
      scheduleFrame(() => order.push('named'), 'key');

      flushFrames();
      // named callbacks (from the Map) are flushed first
      expect(order[0]).toBe('named');
      expect(order[1]).toBe('anon');
    });
  });

  // -------------------------------------------------------------------------
  // cancelFrame
  // -------------------------------------------------------------------------

  describe('cancelFrame()', () => {
    it('prevents a named callback from running', () => {
      let ran = false;
      scheduleFrame(() => {
        ran = true;
      }, 'cancel-me');
      cancelFrame('cancel-me');

      flushFrames();
      expect(ran).toBe(false);
    });

    it('does not affect other keys', () => {
      let a = false;
      let b = false;
      scheduleFrame(() => (a = true), 'key-a');
      scheduleFrame(() => (b = true), 'key-b');

      cancelFrame('key-a');
      flushFrames();

      expect(a).toBe(false);
      expect(b).toBe(true);
    });

    it('is a no-op when the key was never scheduled', () => {
      expect(() => cancelFrame('nonexistent')).not.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // clearFrames
  // -------------------------------------------------------------------------

  describe('clearFrames()', () => {
    it('discards all pending callbacks without running them', () => {
      let ran = false;
      scheduleFrame(() => {
        ran = true;
      });
      scheduleFrame(() => {
        ran = true;
      }, 'named');

      clearFrames();
      flushFrames(); // should be a no-op now

      expect(ran).toBe(false);
    });

    it('is safe to call when nothing is pending', () => {
      expect(() => clearFrames()).not.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // Error isolation
  // -------------------------------------------------------------------------

  describe('error isolation', () => {
    it('continues running remaining callbacks after one throws', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      let secondRan = false;
      scheduleFrame(() => {
        throw new Error('intentional test error');
      });
      scheduleFrame(() => {
        secondRan = true;
      });

      flushFrames();
      expect(secondRan).toBe(true);
      expect(consoleSpy).toHaveBeenCalledOnce();
    });

    it('logs a descriptive error message on anonymous callback failure', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      scheduleFrame(() => {
        throw new Error('boom');
      });
      flushFrames();

      expect(consoleSpy).toHaveBeenCalledWith(
        '[FRAME SCHEDULER] Anonymous callback threw an error:',
        expect.any(Error)
      );
    });

    it('logs a descriptive error message on named callback failure', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      scheduleFrame(() => {
        throw new Error('named boom');
      }, 'error-key');
      flushFrames();

      expect(consoleSpy).toHaveBeenCalledWith(
        '[FRAME SCHEDULER] Named callback threw an error:',
        expect.any(Error)
      );
    });
  });

  // -------------------------------------------------------------------------
  // Re-entrancy — callbacks that schedule more work
  // -------------------------------------------------------------------------

  describe('re-entrancy', () => {
    it('callbacks that call scheduleFrame defer to the next flush', () => {
      const log: number[] = [];

      scheduleFrame(() => {
        log.push(1);
        // Schedule from inside a callback — should NOT run in this flush
        scheduleFrame(() => log.push(2));
      });

      flushFrames();
      expect(log).toEqual([1]); // only frame 1 ran

      flushFrames();
      expect(log).toEqual([1, 2]); // frame 2 ran after explicit second flush
    });
  });

  // -------------------------------------------------------------------------
  // SSR / no-rAF fallback
  // -------------------------------------------------------------------------

  describe('SSR fallback (no requestAnimationFrame)', () => {
    it('runs the callback synchronously when rAF is unavailable', () => {
      // Temporarily remove rAF
      const originalRaf = (globalThis as any).requestAnimationFrame;
      delete (globalThis as any).requestAnimationFrame;

      let ran = false;
      scheduleFrame(() => {
        ran = true;
      });

      // Should have run synchronously — no flush needed
      expect(ran).toBe(true);

      // Restore
      (globalThis as any).requestAnimationFrame = originalRaf;
    });
  });

  // -------------------------------------------------------------------------
  // Integration — realistic drag handler simulation
  // -------------------------------------------------------------------------

  describe('drag handler simulation', () => {
    it('coalesces 10 rapid position updates to a single callback per frame', () => {
      let finalX = 0;
      let callCount = 0;

      // Simulate 10 mousemove events before the next frame
      for (let i = 1; i <= 10; i++) {
        const capturedX = i * 10;
        scheduleFrame(() => {
          callCount++;
          finalX = capturedX;
        }, 'drag:x');
      }

      flushFrames();

      // Only the last callback ran
      expect(callCount).toBe(1);
      expect(finalX).toBe(100); // last position: 10 * 10
    });
  });
});
