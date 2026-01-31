import type { INodeWatcher } from '../node-watcher.types';

/**
 * Initialize the MutationObserver to watch for removed nodes
 * Should be called once on framework boot
 */
export const init = function (this: INodeWatcher): void {
  // Don't initialize twice
  if (this.observer) return;

  // Don't initialize in SSR environment
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
    return;
  }

  // Create MutationObserver
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((node) => {
        this.cleanup(node);
      });
    });
  });

  // Observe the entire document
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Store observer reference
  (this as any).observer = observer;
};
