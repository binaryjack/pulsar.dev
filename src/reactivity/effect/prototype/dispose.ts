import { IEffect } from '../effect.types'

/**
 * Disposes the effect and unsubscribes from all dependencies
 */
export const dispose = function(this: IEffect): void {
    this.cleanup()
    
    // Unsubscribe from all signal dependencies
    this.dependencies.forEach(signal => {
        if ('unsubscribe' in signal && typeof signal.unsubscribe === 'function') {
            signal.unsubscribe(this.execute.bind(this))
        }
    })
    
    this.dependencies.clear()
}
