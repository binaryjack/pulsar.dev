import { IPortalManager, IPortalState } from '../portal.types'

/**
 * Cleanup all portals
 */
export const cleanup = function(
  this: IPortalManager & { _portals: Set<IPortalState> }
): void {
  this._portals.forEach(portal => {
    if (portal.cleanup) {
      portal.cleanup()
    }
  })
  this._portals.clear()
}
