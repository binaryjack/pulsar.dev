/**
 * Async Utilities
 * Utilities for waiting and testing async behavior
 */

import type { IWaitForOptions } from './testing.types';

/**
 * Waits for a condition to be true
 */
export async function waitFor(
  callback: () => boolean | void,
  options: IWaitForOptions = {}
): Promise<void> {
  const { timeout = 1000, interval = 50, onTimeout } = options;
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const check = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed > timeout) {
        const error = new Error(`Timeout waiting for condition after ${timeout}ms`);
        if (onTimeout) {
          onTimeout(error);
        }
        reject(error);
        return;
      }

      try {
        const result = callback();
        if (result !== false) {
          resolve();
        } else {
          setTimeout(check, interval);
        }
      } catch (error) {
        setTimeout(check, interval);
      }
    };

    check();
  });
}

/**
 * Waits for an element to appear in the DOM
 */
export async function waitForElement(
  callback: () => HTMLElement | null,
  options?: IWaitForOptions
): Promise<HTMLElement> {
  let element: HTMLElement | null = null;

  await waitFor(() => {
    element = callback();
    return element !== null;
  }, options);

  return element!;
}

/**
 * Waits for an element to disappear from the DOM
 */
export async function waitForElementToBeRemoved(
  callback: () => HTMLElement | null,
  options?: IWaitForOptions
): Promise<void> {
  await waitFor(() => {
    const element = callback();
    return element === null;
  }, options);
}

/**
 * Waits for a specific amount of time
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Flushes all pending promises and timers
 */
export async function flush(): Promise<void> {
  await wait(0);
}

/**
 * Acts on updates (flushes microtasks)
 */
export async function act(callback: () => void | Promise<void>): Promise<void> {
  await callback();
  await flush();
}

/**
 * Waits for the next tick
 */
export function nextTick(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

/**
 * Waits for a state update to complete
 */
export async function waitForStateUpdate(): Promise<void> {
  await nextTick();
  await flush();
}
