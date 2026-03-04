/**
 * Context — deferred mount test
 *
 * Confirms that useContext returns the correct value when called from a
 * component that mounts AFTER the Provider's synchronous children() execution
 * has already completed and _syncStack has been popped.
 *
 * This is the exact scenario that caused the [useField] Field instance is
 * required crash in dynamic-fields-page: a reactive slot re-evaluates outside
 * the Provider render pass, _syncStack is empty, and useContext must fall back
 * to the plain mutable ref written BEFORE children().
 *
 * Why a plain ref instead of a reactive signal:
 *   insert.ts sets $REGISTRY._currentEffect before calling accessor(). Any
 *   signal read inside becomes a tracked dependency. A signal-based fallback
 *   would cause every reactive slot that calls useContext to re-evaluate on
 *   every context value change — wrong semantics. Context is a static carrier.
 */

import { createContext, useContext } from '@pulsar-framework/pulsar.dev'
import { describe, expect, it } from 'vitest'

describe('Context — deferred mount (plain ref fallback path)', () => {
  it('ref fallback: useContext returns correct value when called after Provider children() has returned', () => {
    const Ctx = createContext<string>('default');

    let deferredResult: string | undefined;

    // Simulate Provider render: ref.current = value → push → children() → pop
    Ctx.Provider({
      value: 'provided',
      children: () => {
        // Synchronous child — _syncStack is live here
        return document.createElement('div');
      },
    });

    // At this point _syncStack has been popped.
    // ref.current was written BEFORE children() so it holds 'provided'.
    // Simulate a component mounting now (deferred — outside Provider call chain).
    deferredResult = useContext(Ctx);

    expect(deferredResult).toBe('provided');
  });

  it('ref fallback: deferred nested consumer gets innermost Provider value', () => {
    const Ctx = createContext<string>('default');

    // Render outer Provider
    Ctx.Provider({
      value: 'outer',
      children: () => {
        // Render inner Provider
        Ctx.Provider({
          value: 'inner',
          children: () => document.createElement('div'),
        });
        return document.createElement('div');
      },
    });

    // After both Providers have fully rendered, _syncStack is empty.
    // Write order (ref-before-children):
    //   1. Outer: ref.current = 'outer'
    //   2. Inner (inside outer's children()): ref.current = 'inner'
    // Inner writes LAST → ref holds 'inner'.
    // This is correct: nearest enclosing ancestor wins for deferred consumers.
    const deferredResult = useContext(Ctx);

    expect(deferredResult).toBe('inner');
  });

  it('ref fallback: useContext returns default when no Provider has ever rendered', () => {
    const Ctx = createContext<string>('fallback-default');

    // No Provider rendered — ref still holds defaultValue
    const result = useContext(Ctx);

    expect(result).toBe('fallback-default');
  });

  it('sync stack path: useContext returns correct value synchronously inside children()', () => {
    const Ctx = createContext<string>('default');

    let syncResult: string | undefined;

    Ctx.Provider({
      value: 'sync-provided',
      children: () => {
        // _syncStack is live here
        syncResult = useContext(Ctx);
        return document.createElement('div');
      },
    });

    expect(syncResult).toBe('sync-provided');
  });
});
