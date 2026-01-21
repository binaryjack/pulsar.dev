import { useEffect } from './use-effect'
import { useMemo } from './use-memo'
import { useRef } from './use-ref'
import { useState } from './use-state'

describe('Hooks System', () => {
    describe('useState', () => {
        it('should create state with initial value', () => {
            const [count, setCount] = useState(0)
            expect(count()).toBe(0)
        })
        
        it('should update state', () => {
            const [count, setCount] = useState(0)
            setCount(5)
            expect(count()).toBe(5)
        })
    })
    
    describe('useEffect', () => {
        it('should execute effect', () => {
            let executed = false
            
            const dispose = useEffect(() => {
                executed = true
            })
            
            expect(executed).toBe(true)
            dispose()
        })
        
        it('should return cleanup function', () => {
            let cleaned = false
            
            const dispose = useEffect(() => {
                return () => {
                    cleaned = true
                }
            })
            
            dispose()
            expect(cleaned).toBe(true)
        })
    })
    
    describe('useMemo', () => {
        it('should create memoized value', () => {
            const [count, _] = useState(5)
            const doubled = useMemo(() => count() * 2)
            
            expect(doubled()).toBe(10)
        })
    })
    
    describe('useRef', () => {
        it('should create mutable ref', () => {
            const ref = useRef(0)
            expect(ref.current).toBe(0)
            
            ref.current = 5
            expect(ref.current).toBe(5)
        })
    })
})
