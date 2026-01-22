import { ILifecycleManager, LifecycleManager } from './lifecycle-manager'

describe('Lifecycle System', () => {
    let manager: ILifecycleManager
    let element: HTMLElement
    
    beforeEach(() => {
        manager = new (LifecycleManager as unknown as new () => ILifecycleManager)()
        element = document.createElement('div')
    })
    
    describe('LifecycleManager', () => {
        it('should register mount callback', () => {
            let mounted = false
            
            manager.onMount(element, () => {
                mounted = true
            })
            
            expect(mounted).toBe(false)
            manager.runMount(element)
            expect(mounted).toBe(true)
        })
        
        it('should register cleanup callback from mount', () => {
            let cleaned = false
            
            manager.onMount(element, () => {
                return () => {
                    cleaned = true
                }
            })
            
            manager.runMount(element)
            expect(cleaned).toBe(false)
            
            manager.runCleanup(element)
            expect(cleaned).toBe(true)
        })
        
        it('should register explicit cleanup callback', () => {
            let cleaned = false
            
            manager.onCleanup(element, () => {
                cleaned = true
            })
            
            manager.runCleanup(element)
            expect(cleaned).toBe(true)
        })
        
        it('should register update callback', () => {
            let updated = false
            
            manager.onUpdate(element, () => {
                updated = true
            })
            
            manager.runUpdate(element)
            expect(updated).toBe(true)
        })
        
        it('should run multiple mount callbacks', () => {
            let count = 0
            
            manager.onMount(element, () => { count++ })
            manager.onMount(element, () => { count++ })
            manager.onMount(element, () => { count++ })
            
            manager.runMount(element)
            expect(count).toBe(3)
        })
        
        it('should clear all callbacks on cleanup', () => {
            let mountCount = 0
            let cleanupCount = 0
            
            manager.onMount(element, () => { mountCount++ })
            manager.onCleanup(element, () => { cleanupCount++ })
            
            manager.runMount(element)
            manager.runCleanup(element)
            
            expect(mountCount).toBe(1)
            expect(cleanupCount).toBe(1)
            
            // Running again should do nothing
            manager.runMount(element)
            manager.runCleanup(element)
            
            expect(mountCount).toBe(1)
            expect(cleanupCount).toBe(1)
        })
    })
})
