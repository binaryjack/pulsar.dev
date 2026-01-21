/**
 * ApplicationRoot unmount method
 */

import { IApplicationRootInternal } from '../../application-root-internal.interface'

export const unmount = function(this: IApplicationRootInternal): void {
    if (!this._isMounted) {
        console.warn('[ApplicationRoot] Not mounted')
        return
    }
    
    try {
        // Call onUnmount callback
        if (this.onUnmount) {
            this.onUnmount()
        }
        
        // Clear root element
        this.rootElement.innerHTML = ''
        
        this._mountedComponent = null
        this._isMounted = false
        
        console.log('[ApplicationRoot] Component unmounted successfully')
    } catch (error) {
        const err = error as Error
        console.error('[ApplicationRoot] Unmount failed:', err)
        
        if (this.onError) {
            this.onError(err)
        }
    }
}
