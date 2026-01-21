import { PortalManager } from './portal-manager'
import { IPortalManager } from './portal.types'
import { cleanup } from './prototype/cleanup'
import { getPortals } from './prototype/get-portals'
import { register } from './prototype/register'
import { unregister } from './prototype/unregister'

// Attach prototype methods
PortalManager.prototype.register = register
PortalManager.prototype.unregister = unregister
PortalManager.prototype.getPortals = getPortals
PortalManager.prototype.cleanup = cleanup

/**
 * Global portal manager instance
 */
let instance: IPortalManager | null = null

export function getPortalManager(): IPortalManager {
  if (!instance) {
    instance = new PortalManager()
  }
  return instance
}
