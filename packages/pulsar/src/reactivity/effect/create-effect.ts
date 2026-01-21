import { Effect } from './effect'
import { IEffect } from './effect.types'

/**
 * Factory function to create and run an effect
 * Returns a dispose function
 */
export function createEffect(fn: () => void | (() => void)): () => void {
    const effect = new (Effect as unknown as new (fn: () => void | (() => void)) => IEffect)(fn)
    effect.execute()
    
    return () => effect.dispose()
}
