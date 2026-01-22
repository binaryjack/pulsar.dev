/**
 * Bootstrap configuration interface
 */

export interface IBootstrapConfig<TProps = unknown> {
    /**
     * Root DOM element selector or element
     */
    root: string | HTMLElement
    
    /**
     * Root component factory function
     */
    component: (props: TProps) => HTMLElement
    
    /**
     * Initial props for the root component
     */
    props: TProps
    
    /**
     * Optional wrapper component (e.g., Context Provider)
     * Receives the rendered component as children
     */
    wrapper?: (props: { children: HTMLElement }) => HTMLElement
    
    /**
     * Error handler for component errors
     */
    onError?: (error: Error) => void
    
    /**
     * Callback after successful mount
     */
    onMount?: (element: HTMLElement) => void
    
    /**
     * Callback before unmount
     */
    onUnmount?: () => void
}
