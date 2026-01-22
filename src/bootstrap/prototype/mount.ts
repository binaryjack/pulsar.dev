import { IApplicationInternal } from '../application-internal.interface'

/**
 * Mount the application to the DOM
 */
export const mount = function<TProps>(this: IApplicationInternal<TProps>): void {
    if (this._isMounted) {
        console.warn('[Bootstrap] Application already mounted')
        return
    }
    
    try {
        // Resolve root element
        if (typeof this.config.root === 'string') {
            const element = document.querySelector(this.config.root)
            if (!element) {
                throw new Error(`Root element not found: ${this.config.root}`)
            }
            this._rootElement = element as HTMLElement
        } else {
            this._rootElement = this.config.root
        }
        
        // Create component
        this._componentElement = this.config.component(this.config.props)
        
        // Wrap with wrapper component if provided
        let elementToMount = this._componentElement
        if (this.config.wrapper) {
            elementToMount = this.config.wrapper({
                children: this._componentElement
            })
        }
        
        // Mount to DOM
        this._rootElement.innerHTML = ''
        this._rootElement.appendChild(elementToMount)
        
        this._isMounted = true
        
        // Call onMount callback
        if (this.config.onMount) {
            this.config.onMount(this._componentElement)
        }
        
        console.log('[Bootstrap] Application mounted successfully')
    } catch (error) {
        const err = error as Error
        console.error('[Bootstrap] Mount failed:', err)
        if (this.config.onError) {
            this.config.onError(err)
        } else {
            throw err
        }
    }
}
