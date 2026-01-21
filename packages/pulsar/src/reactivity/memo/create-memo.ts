import { Memo } from './memo'
import { IMemo } from './memo.types'

/**
 * Factory function to create a memoized computed value
 * Returns a function that reads the current value
 */
export function createMemo<T>(computeFn: () => T): () => T {
    const memo = new (Memo as unknown as new (computeFn: () => T) => IMemo<T>)(computeFn)
    
    return () => memo.read()
}
