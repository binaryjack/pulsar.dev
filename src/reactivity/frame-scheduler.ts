/**
 * Frame Scheduler — opt-in rAF throttling for high-frequency event handlers.
 *
 * # Why this exists
 * Pulsar signal writes are synchronous: every `set*(newVal)` immediately runs
 * all subscribed effects.  When a `pointermove` / `mousemove` handler calls
 * `setX(e.clientX)` it can fire 200–500 times per second.  Each write
 * triggers DOM updates synchronously, wasting paint budget on frames the
 * browser will never render.
 *
 * # What this does NOT do
 * `scheduleFrame` does NOT touch `createEffect`, `batch`, `wire`, or any
 * existing signal primitive.  It is a pure opt-in layer: only code that
 * explicitly calls `scheduleFrame` is affected.  All existing synchronous
 * semantics are entirely preserved.
 *
 * # Typical usage — drag handler
 * ```ts
 * el.addEventListener('pointermove', (e) => {
 *   scheduleFrame(
 *     () => { setX(e.clientX); setY(e.clientY); },
 *     'drag:xy'          // ← dedup key: only the last position per frame wins
 *   );
 * });
 * ```
 *
 * # Testing
 * In vitest / jest environments call `flushFrames()` to run all pending
 * callbacks synchronously without waiting for an animation frame.
 */

/** Callback type accepted by scheduleFrame. */
export type FrameCallback = () => void;

/**
 * Deduplication key type.
 * When two `scheduleFrame` calls share the same key within one frame, only
 * the **last** callback survives — earlier intermediate positions are dropped.
 */
export type FrameKey = string | symbol;

// ---------------------------------------------------------------------------
// Internal state (module-level singletons)
// ---------------------------------------------------------------------------

/** Named (deduped) callbacks — last writer wins per key. */
const _pending = new Map<FrameKey, FrameCallback>();

/** Anonymous callbacks — all run once, in insertion order. */
const _anonymous: FrameCallback[] = [];

/** Active rAF handle, or null when no frame is scheduled. */
let _rafId: number | null = null;

// ---------------------------------------------------------------------------
// Internal flush
// ---------------------------------------------------------------------------

function flush(): void {
  _rafId = null;

  // Snapshot both queues before running, so callbacks that call scheduleFrame
  // themselves go into the NEXT frame rather than the current one.
  const namedFns = Array.from(_pending.values());
  _pending.clear();

  const anonFns = _anonymous.splice(0);

  for (const fn of namedFns) {
    try {
      fn();
    } catch (err) {
      console.error('[FRAME SCHEDULER] Named callback threw an error:', err);
    }
  }

  for (const fn of anonFns) {
    try {
      fn();
    } catch (err) {
      console.error('[FRAME SCHEDULER] Anonymous callback threw an error:', err);
    }
  }
}

function requestFlush(): void {
  if (_rafId !== null) return; // frame already scheduled

  if (typeof requestAnimationFrame === 'function') {
    _rafId = requestAnimationFrame(flush);
  } else {
    // SSR / Node.js without jsdom — flush synchronously via microtask so
    // multiple scheduleFrame calls in the same tick are still batched.
    _rafId = 0; // sentinel: prevents duplicate scheduling
    Promise.resolve().then(() => {
      if (_rafId === 0) flush(); // only run if not cancelled by clearFrames()
    });
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Schedule `fn` to execute in the next animation frame.
 *
 * @param fn  - Callback to run.
 * @param key - Optional deduplication key.  When provided, only the **last**
 *              call with the same key within a single frame is executed.
 *              Use this for position updates, scroll positions, or any value
 *              where only the final state of the frame matters.
 *
 * When `requestAnimationFrame` is unavailable (SSR / Node.js without jsdom)
 * the callback runs **synchronously** instead and this function returns
 * immediately.  This keeps unit tests that don't fake timers simple.
 *
 * @example
 * // Always use a key for drag/scroll signals
 * el.addEventListener('pointermove', (e) => {
 *   scheduleFrame(() => { setX(e.clientX); setY(e.clientY); }, 'drag:xy');
 * });
 */
export function scheduleFrame(fn: FrameCallback, key?: FrameKey): void {
  if (typeof requestAnimationFrame !== 'function') {
    // No rAF — run synchronously (SSR / Node.js fallback)
    fn();
    return;
  }

  if (key !== undefined) {
    // Overwrite any previous callback registered for this key this frame.
    _pending.set(key, fn);
  } else {
    _anonymous.push(fn);
  }

  requestFlush();
}

/**
 * Cancel a previously scheduled **named** callback.
 * Has no effect if the key was never scheduled or has already run.
 *
 * @param key - The deduplication key passed to `scheduleFrame`.
 */
export function cancelFrame(key: FrameKey): void {
  _pending.delete(key);
}

/**
 * Flush all pending frame callbacks **immediately** without waiting for an
 * animation frame.
 *
 * Primary use case: unit / integration tests that need to assert the result
 * of scheduled updates synchronously.
 *
 * @example
 * scheduleFrame(() => setX(100), 'drag:x');
 * flushFrames();
 * expect(xSignal()).toBe(100); // ✅ already ran
 */
export function flushFrames(): void {
  if (_rafId !== null) {
    if (typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(_rafId);
    }
    _rafId = null;
  }
  flush();
}

/**
 * Cancel all pending callbacks and the pending rAF without running them.
 *
 * Useful for component unmount or global teardown in tests.
 */
export function clearFrames(): void {
  if (_rafId !== null) {
    if (typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(_rafId);
    }
    _rafId = null;
  }
  _pending.clear();
  _anonymous.length = 0;
}
