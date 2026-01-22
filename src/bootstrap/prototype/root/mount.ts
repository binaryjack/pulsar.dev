/**
 * ApplicationRoot mount method
 */

import { IApplicationRootInternal } from '../../application-root-internal.interface'

export const mount = function(this: IApplicationRootInternal, component: HTMLElement): void {
    if (this._isMounted) {
        console.warn('[ApplicationRoot] Already mounted, unmounting first')
        this.unmount()
    }
    
    try {
        // Clear root element
        this.rootElement.innerHTML = ''
        
        // Mount component
        this.rootElement.appendChild(component)
        
        this._mountedComponent = component
        this._isMounted = true
        
        // Call onMount callback
        if (this.onMount) {
            this.onMount(component)
        }
        
        console.log('[ApplicationRoot] Component mounted successfully')
    } catch (error) {
        const err = error as Error
        console.error('[ApplicationRoot] Mount failed:', err)
        
        if (this.onError) {
            this.onError(err)
        } else {
            throw err
        }
    }
}
