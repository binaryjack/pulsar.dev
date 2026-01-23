/**
 * Client-Side Hydration
 */

import type { ComponentFunction, IHydrateOptions } from './ssr.types';
import { extractHydrationState } from './utils/serialize-data';

/**
 * Hydrate a server-rendered component
 * Attaches event listeners and reactivity to existing DOM
 */
export const hydrate = function hydrate(
  component: ComponentFunction,
  target: Element | string,
  options: IHydrateOptions = {}
): void {
  // Extract serialized state
  const state = options.state || extractHydrationState();

  // TODO: In a full implementation, we would:
  // 1. Walk the existing DOM tree
  // 2. Match it with the virtual tree
  // 3. Attach event listeners without replacing DOM
  // 4. Initialize signals with server values

  // For now, use mount() which will work but replaces the DOM
  // This is a simplified implementation
  // TODO: Implement proper hydration - mount(component, target);
  console.warn('[Pulsar SSR] Hydration not fully implemented, use createApp().mount() instead');

  // If we have state, we could restore it here
  if (state) {
    console.log('[Pulsar SSR] Hydration state loaded:', state);
  }
};
