/**
 * Client-Side Hydration
 *
 * Rehydration strategy:
 * 1. Restore registry signal state from the server-injected `__PULSAR_STATE__`
 *    or the `state` option (covers `createHydrationScript` + `bootFromState`).
 * 2. Execute the component function to produce a reactive DOM tree.
 *    The signal values set in step 1 pre-seed the reactive graph so the
 *    first render output matches the server HTML.
 * 3. Replace the target element's content with the hydrated tree.
 *    A future streaming-hydration pass will skip DOM replacement entirely
 *    and walk the existing nodes — tracked in TODO(hydration): adopt-nodes.
 */

import { bootFromState } from './hydration';
import type { ComponentFunction, IHydrateOptions } from './ssr.types';
import { extractHydrationState } from './utils/serialize-data';

export const hydrate = function hydrate(
  component: ComponentFunction,
  target: Element | string,
  options: IHydrateOptions = {}
): void {
  // 1. Resolve target element
  const root: Element | null = typeof target === 'string' ? document.querySelector(target) : target;

  if (!root) {
    throw new Error(`[Pulsar] hydrate(): target "${target}" not found in document.`);
  }

  // 2. Restore registry state (signals + HID counter)
  if (options.state) {
    // Caller provided pre-parsed state (e.g. from an island loader)
    (window as any).__INITIAL_STATE__ = options.state;
  }

  const rawState = extractHydrationState();
  if (rawState) {
    bootFromState();
  }

  // 3. Execute component — signals are already at server values so the
  //    reactive tree is identical to what SSR produced.
  const tree = component();

  if (!(tree instanceof HTMLElement) && !(tree instanceof DocumentFragment)) {
    console.error('[Pulsar] hydrate(): component did not return an HTMLElement — cannot hydrate.');
    return;
  }

  // 4. Replace server HTML with the live reactive tree.
  //    TODO(hydration/adopt-nodes): walk root.childNodes and adopt them
  //    into the reactive graph instead of replacing to eliminate the
  //    flash of non-interactive content.
  root.replaceChildren(tree);
};
