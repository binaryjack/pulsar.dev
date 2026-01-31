import type { INodeWatcher } from '../node-watcher.types';

/**
 * Dispose the watcher and stop observing
 */
export const dispose = function (this: INodeWatcher): void {
  if (this.observer) {
    this.observer.disconnect();
    (this as any).observer = null;
  }
};
