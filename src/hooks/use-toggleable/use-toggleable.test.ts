import { useToggleable } from './use-toggleable'

describe('useToggleable', () => {
    it('should initialize with default state "idle"', () => {
        const toggle = useToggleable()
        expect(toggle.state()).toBe('idle')
        expect(toggle.isIdle()).toBe(true)
        expect(toggle.isOpen()).toBe(false)
        expect(toggle.isClosed()).toBe(false)
    })
    
    it('should initialize with provided state', () => {
        const toggle = useToggleable('open')
        expect(toggle.state()).toBe('open')
        expect(toggle.isOpen()).toBe(true)
    })
    
    it('should open', () => {
        const toggle = useToggleable('closed')
        toggle.open()
        expect(toggle.state()).toBe('open')
        expect(toggle.isOpen()).toBe(true)
    })
    
    it('should close', () => {
        const toggle = useToggleable('open')
        toggle.close()
        expect(toggle.state()).toBe('closed')
        expect(toggle.isClosed()).toBe(true)
    })
    
    it('should reset to idle', () => {
        const toggle = useToggleable('open')
        toggle.reset()
        expect(toggle.state()).toBe('idle')
        expect(toggle.isIdle()).toBe(true)
    })
    
    it('should toggle from open to closed', () => {
        const toggle = useToggleable('open')
        toggle.toggle()
        expect(toggle.state()).toBe('closed')
    })
    
    it('should toggle from closed to open', () => {
        const toggle = useToggleable('closed')
        toggle.toggle()
        expect(toggle.state()).toBe('open')
    })
    
    it('should toggle from idle to open', () => {
        const toggle = useToggleable('idle')
        toggle.toggle()
        expect(toggle.state()).toBe('open')
    })
    
    it('should set state directly', () => {
        const toggle = useToggleable()
        toggle.setState('open')
        expect(toggle.state()).toBe('open')
        
        toggle.setState('closed')
        expect(toggle.state()).toBe('closed')
        
        toggle.setState('idle')
        expect(toggle.state()).toBe('idle')
    })
    
    it('should handle multiple sequential operations', () => {
        const toggle = useToggleable()
        
        toggle.open()
        expect(toggle.isOpen()).toBe(true)
        
        toggle.close()
        expect(toggle.isClosed()).toBe(true)
        
        toggle.toggle()
        expect(toggle.isOpen()).toBe(true)
        
        toggle.reset()
        expect(toggle.isIdle()).toBe(true)
    })
    
    it('should have correct state check methods', () => {
        const toggle = useToggleable()
        
        toggle.setState('open')
        expect(toggle.isOpen()).toBe(true)
        expect(toggle.isClosed()).toBe(false)
        expect(toggle.isIdle()).toBe(false)
        
        toggle.setState('closed')
        expect(toggle.isOpen()).toBe(false)
        expect(toggle.isClosed()).toBe(true)
        expect(toggle.isIdle()).toBe(false)
        
        toggle.setState('idle')
        expect(toggle.isOpen()).toBe(false)
        expect(toggle.isClosed()).toBe(false)
        expect(toggle.isIdle()).toBe(true)
    })
})
