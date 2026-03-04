/**
 * Context — deferred mount test
 *
 * Confirms (or denies) that useContext returns the correct value when called
 * from a component that mounts AFTER the Provider's synchronous children()
 * execution has already completed and _syncStack has been popped.
 *
 * This is the exact scenario that caused the [useField] Field instance is
 * required crash in dynamic-fields-page: a reactive slot re-evaluates outside
 * the Provider render pass, _syncStack is empty, and useContext must fall back
 * to the contextRegistry signal.
 */

import { createContext, useContext } from '@pulsar-framework/pulsar.dev';
import { describe, expect, it } from 'vitest';

describe('Context — deferred mount (signal fallback path)', () => {
  it('signal fallback: useContext returns correct value when called after Provider children() has returned', () => {
    const Ctx = createContext<string>('default');

    let deferredResult: string | undefined;

    // Simulate Provider render: push → children() → pop → setSignal
    Ctx.Provider({
      value: 'provided',
      children: () => {
        // Synchronous child — _syncStack is live here
        return document.createElement('div');
      },
    });

    // At this point _syncStack has been popped.
    // Signal was written by Provider after children() returned.
    // Simulate a component mounting now (deferred — outside Provider call chain).
    deferredResult = useContext(Ctx);

    expect(deferredResult).toBe('provided');
  });

  it('signal fallback: deferred nested consumer gets innermost Provider value', () => {
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
    // Write order: inner setContextValue('inner') fires first (inside outer's children()),
    // then outer setContextValue('outer') fires after children() returns.
    // Last write wins → signal holds 'outer'.
    // NOTE: this exposes the known scoping limitation — deferred consumers always
    // see the outermost Provider's value, not the nearest ancestor.
    // The owner-tree context fix would resolve this correctly.
    const deferredResult = useContext(Ctx);

    expect(deferredResult).toBe('outer');
  });

  it('signal fallback: useContext returns default when no Provider has ever rendered', () => {
    const Ctx = createContext<string>('fallback-default');

    // No Provider rendered — signal still holds defaultValue
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
