import { EventDelegator, IEventDelegator } from './event-delegator'
import { ISyntheticEvent } from './synthetic-event'

describe('Event System', () => {
    let delegator: IEventDelegator
    let element: HTMLElement
    
    beforeEach(() => {
        delegator = new (EventDelegator as unknown as new () => IEventDelegator)()
        element = document.createElement('div')
    })
    
    describe('EventDelegator', () => {
        it('should add event listener', () => {
            let clicked = false
            
            delegator.addEventListener(element, 'click', () => {
                clicked = true
            })
            
            element.click()
            expect(clicked).toBe(true)
        })
        
        it('should return cleanup function', () => {
            let clicked = false
            
            const cleanup = delegator.addEventListener(element, 'click', () => {
                clicked = true
            })
            
            cleanup()
            element.click()
            expect(clicked).toBe(false)
        })
        
        it('should remove event listener', () => {
            let clicked = false
            
            delegator.addEventListener(element, 'click', () => {
                clicked = true
            })
            
            delegator.removeEventListener(element, 'click')
            element.click()
            expect(clicked).toBe(false)
        })
        
        it('should check if listener exists', () => {
            delegator.addEventListener(element, 'click', () => {})
            
            expect(delegator.hasListener(element, 'click')).toBe(true)
            expect(delegator.hasListener(element, 'hover')).toBe(false)
        })
        
        it('should remove all listeners', () => {
            let clickCount = 0
            let hoverCount = 0
            
            delegator.addEventListener(element, 'click', () => clickCount++)
            delegator.addEventListener(element, 'mouseenter', () => hoverCount++)
            
            delegator.removeAllListeners(element)
            
            element.click()
            element.dispatchEvent(new Event('mouseenter'))
            
            expect(clickCount).toBe(0)
            expect(hoverCount).toBe(0)
        })
    })
    
    describe('SyntheticEvent', () => {
        it('should wrap native event', () => {
            let syntheticEvent: ISyntheticEvent<EventTarget> | null = null
            
            delegator.addEventListener(element, 'click', (e) => {
                syntheticEvent = e
            })
            
            element.click()
            
            expect(syntheticEvent).toBeDefined()
            expect(syntheticEvent.type).toBe('click')
            expect(syntheticEvent.nativeEvent).toBeDefined()
        })
        
        it('should prevent default', () => {
            let prevented = false
            
            delegator.addEventListener(element, 'click', (e) => {
                e.preventDefault()
                prevented = e.isDefaultPrevented()
            })
            
            element.click()
            expect(prevented).toBe(true)
        })
        
        it('should stop propagation', () => {
            let parentClicked = false
            const parent = document.createElement('div')
            parent.appendChild(element)
            
            delegator.addEventListener(element, 'click', (e) => {
                e.stopPropagation()
            })
            
            delegator.addEventListener(parent, 'click', () => {
                parentClicked = true
            })
            
            element.click()
            expect(parentClicked).toBe(false)
        })
    })
})
