import { IApplicationInternal } from '../application-internal.interface'

/**
 * Unmount the application from the DOM
 */
export const unmount = function<TProps>(this: IApplicationInternal<TProps>): void {
    if (!this._isMounted) {
        console.warn('[Bootstrap] Application not mounted')
        return
    }
    
    try {
        // Call onUnmount callback
        if (this.config.onUnmount) {
            this.config.onUnmount()
        }
        
        // Clear DOM
        if (this._rootElement && this._componentElement) {
            this._rootElement.removeChild(this._componentElement)
        }
        
        this._componentElement = null
        this._isMounted = false
        
        console.log('[Bootstrap] Application unmounted')
    } catch (error) {
        console.error('[Bootstrap] Unmount failed:', error)
    }
}
