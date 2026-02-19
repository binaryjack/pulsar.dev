/**
 * Catcher Component — DEPRECATED
 *
 * The sibling Tryer+Catcher pattern is architecturally broken: the global
 * error-boundary stack is always empty by the time Catcher renders synchronously.
 *
 * Use the `fallback` prop on Tryer instead:
 *   <Tryer fallback={(error, reset) => <div>...</div>}>
 *     <RiskyComponent />
 *   </Tryer>
 */

import { ICatcherProps } from './error-boundary.types';

export function Catcher(_props: ICatcherProps = {}): HTMLElement {
  console.warn(
    '[Pulsar] <Catcher> is deprecated and no longer functional. ' +
      'Use the fallback prop on <Tryer> instead: ' +
      '<Tryer fallback={(error, reset) => ...}>children</Tryer>'
  );
  const container = document.createElement('div');
  container.setAttribute('data-catcher', 'true');
  container.style.display = 'none';
  return container;
}

/** @deprecated No-op. Remove calls to this function. */
export function updateCatcher(_container: HTMLElement): void {
  // intentionally empty
}
