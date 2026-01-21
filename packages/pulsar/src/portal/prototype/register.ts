import { IPortalManager, IPortalState } from '../portal.types'

/**
 * Register a portal
 */
export const register = function(
  this: IPortalManager & { _portals: Set<IPortalState> },
  portal: IPortalState
): void {
  this._portals.add(portal)
}
