import { IPortalManager, IPortalState } from './portal.types'

/**
 * Portal manager constructor
 * Tracks active portals for cleanup
 */
export const PortalManager = function(this: IPortalManager) {
  Object.defineProperty(this, '_portals', {
    value: new Set<IPortalState>(),
    writable: false,
    enumerable: false
  })
} as unknown as { new (): IPortalManager & { _portals: Set<IPortalState> } }
