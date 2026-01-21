import { IApplicationInternal } from '../application-internal.interface'

/**
 * Update the application with new props
 */
export const update = function<TProps>(this: IApplicationInternal<TProps>, props: TProps): void {
    if (!this._isMounted) {
        throw new Error('Cannot update unmounted application')
    }
    
    this.config.props = props
    this.unmount()
    this.mount()
}
