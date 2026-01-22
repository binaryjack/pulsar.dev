import { IPortalManager, IPortalState } from '../portal.types'

/**
 * Unregister a portal
 */
export const unregister = function(
  this: IPortalManager & { _portals: Set<IPortalState> },
  portal: IPortalState
): void {
  this._portals.delete(portal)
}
