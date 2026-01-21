import { createEffect } from '../effect'
import { batch, isBatching } from '../index'
import { createSignal } from '../signal'

describe('Batch System', () => {
  describe('batch()', () => {
    it('should batch multiple signal writes', () => {
      const [count, setCount] = createSignal(0)
      const [name, setName] = createSignal('Alice')
      
      let effectRuns = 0
      createEffect(() => {
        count()
        name()
        effectRuns++
      })
      
      // Initial run
      expect(effectRuns).toBe(1)
      
      // Batch multiple updates
      batch(() => {
        setCount(1)
        setName('Bob')
        setCount(2)
      })
      
      // Should run only once after batch
      expect(effectRuns).toBe(2)
      expect(count()).toBe(2)
      expect(name()).toBe('Bob')
    })
    
    it('should handle nested batches', () => {
      const [count, setCount] = createSignal(0)
      
      let effectRuns = 0
      createEffect(() => {
        count()
        effectRuns++
      })
      
      expect(effectRuns).toBe(1)
      
      batch(() => {
        setCount(1)
        
        batch(() => {
          setCount(2)
          setCount(3)
        })
        
        setCount(4)
      })
      
      // Should run only once after all batches complete
      expect(effectRuns).toBe(2)
      expect(count()).toBe(4)
    })
    
    it('should handle errors without breaking batch', () => {
      const [count, setCount] = createSignal(0)
      
      let effectRuns = 0
      createEffect(() => {
        count()
        effectRuns++
      })
      
      expect(effectRuns).toBe(1)
      
      expect(() => {
        batch(() => {
          setCount(1)
          throw new Error('Test error')
        })
      }).toThrow('Test error')
      
      // Effect should still run despite error
      expect(effectRuns).toBe(2)
      expect(count()).toBe(1)
    })
    
    it('should deduplicate effect executions', () => {
      const [a, setA] = createSignal(0)
      const [b, setB] = createSignal(0)
      
      let effectRuns = 0
      createEffect(() => {
        a()
        b()
        effectRuns++
      })
      
      expect(effectRuns).toBe(1)
      
      batch(() => {
        setA(1)
        setB(1)
        setA(2)
        setB(2)
      })
      
      // Should run only once, not 4 times
      expect(effectRuns).toBe(2)
    })
    
    it('should not batch when not in batch context', () => {
      const [count, setCount] = createSignal(0)
      
      let effectRuns = 0
      createEffect(() => {
        count()
        effectRuns++
      })
      
      expect(effectRuns).toBe(1)
      
      // Without batch, each update runs effect
      setCount(1)
      expect(effectRuns).toBe(2)
      
      setCount(2)
      expect(effectRuns).toBe(3)
      
      setCount(3)
      expect(effectRuns).toBe(4)
    })
  })
  
  describe('isBatching()', () => {
    it('should return false by default', () => {
      expect(isBatching()).toBe(false)
    })
    
    it('should return true inside batch', () => {
      let insideBatch = false
      
      batch(() => {
        insideBatch = isBatching()
      })
      
      expect(insideBatch).toBe(true)
      expect(isBatching()).toBe(false)
    })
    
    it('should return true in nested batches', () => {
      let outerBatch = false
      let innerBatch = false
      
      batch(() => {
        outerBatch = isBatching()
        
        batch(() => {
          innerBatch = isBatching()
        })
      })
      
      expect(outerBatch).toBe(true)
      expect(innerBatch).toBe(true)
      expect(isBatching()).toBe(false)
    })
  })
  
  describe('Performance', () => {
    it('should significantly reduce effect executions', () => {
      const signals = Array.from({ length: 100 }, () => createSignal(0))
      
      let effectRuns = 0
      createEffect(() => {
        signals.forEach(([get]) => get())
        effectRuns++
      })
      
      expect(effectRuns).toBe(1)
      
      // Without batch: 100 effect runs
      const startWithout = effectRuns
      signals.forEach(([_, set]) => set(1))
      const withoutBatch = effectRuns - startWithout
      
      // Reset
      signals.forEach(([_, set]) => set(0))
      effectRuns = 0
      
      // With batch: 1 effect run
      const startWith = effectRuns
      batch(() => {
        signals.forEach(([_, set]) => set(1))
      })
      const withBatch = effectRuns - startWith
      
      expect(withBatch).toBe(1)
      expect(withoutBatch).toBe(100)
      expect(withBatch).toBeLessThan(withoutBatch)
    })
  })
  
  describe('Edge Cases', () => {
    it('should handle empty batch', () => {
      expect(() => {
        batch(() => {
          // Nothing
        })
      }).not.toThrow()
    })
    
    it('should handle batch with only reads', () => {
      const [count] = createSignal(0)
      
      let value = 0
      batch(() => {
        value = count()
      })
      
      expect(value).toBe(0)
    })
    
    it('should handle recursive batches', () => {
      const [count, setCount] = createSignal(0)
      
      let effectRuns = 0
      createEffect(() => {
        count()
        effectRuns++
      })
      
      expect(effectRuns).toBe(1)
      
      batch(() => {
        setCount(1)
        
        batch(() => {
          setCount(2)
          
          batch(() => {
            setCount(3)
          })
        })
      })
      
      expect(effectRuns).toBe(2)
      expect(count()).toBe(3)
    })
  })
})
