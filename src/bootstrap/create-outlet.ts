import { Outlet } from './outlet'
import { IOutlet } from './outlet.interface'
import { clear } from './prototype/outlet/clear'
import { render } from './prototype/outlet/render'

// Attach prototype methods
Outlet.prototype.render = render
Outlet.prototype.clear = clear

/**
 * Create an outlet for a specific element
 */
export function createOutlet(selector: string | HTMLElement): IOutlet {
    const element = typeof selector === 'string' 
        ? document.querySelector(selector) as HTMLElement
        : selector
    
    if (!element) {
        throw new Error(`Outlet element not found: ${selector}`)
    }
    
    return new Outlet(element) as unknown as IOutlet
}
