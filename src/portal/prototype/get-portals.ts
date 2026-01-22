import { IPortalManager, IPortalState } from '../portal.types'

/**
 * Get all active portals
 */
export const getPortals = function(
  this: IPortalManager & { _portals: Set<IPortalState> }
): ReadonlyArray<IPortalState> {
  return Array.from(this._portals)
}
