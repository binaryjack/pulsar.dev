/**
 * Server-Side Rendering (SSR) Utilities
 * Dump and boot registry state for hydration
 */

import { $REGISTRY } from '../registry/core/index.js';

/**
 * Serialize registry state to JSON
 * Called on the server to capture initial state
 *
 * Output format:
 * {
 *   signals: { sig_0: value1, sig_1: value2, ... },
 *   components: ['app:TodoList', 'app:TodoItem', ...],
 *   hid: 42
 * }
 */
export function dumpState(): string {
  const state = $REGISTRY.dump();
  return JSON.stringify(state);
}

/**
 * Generate hydration script tag
 * Injects __INITIAL_STATE__ into the HTML
 *
 * Usage on server:
 * ```ts
 * const html = renderToString(App);
 * const state = dumpState();
 * const script = getHydrationScript(state);
 * res.send(`${html}${script}`);
 * ```
 */
export function getHydrationScript(state: string): string {
  return `<script>window.__INITIAL_STATE__ = ${state};</script>`;
}

/**
 * Boot registry from hydrated state
 * Called on the client before mounting the app
 *
 * Usage on client:
 * ```ts
 * import { bootFromState } from 'pulsar.dev/ssr';
 *
 * // Boot registry with server state
 * bootFromState();
 *
 * // Mount app
 * document.body.appendChild(App());
 * ```
 */
export function bootFromState(): void {
  const initialState = (window as any).__INITIAL_STATE__;
  if (!initialState) {
    console.warn('[Pulsar SSR] No initial state found. Skipping hydration.');
    return;
  }

  $REGISTRY.boot(initialState);
  console.log('[Pulsar SSR] Registry hydrated from server state.');
}

/**
 * Type definition for window.__INITIAL_STATE__
 */
declare global {
  interface Window {
    __INITIAL_STATE__?: {
      signals: Record<string, any>;
      components: string[];
      hid: number;
    };
  }
}
