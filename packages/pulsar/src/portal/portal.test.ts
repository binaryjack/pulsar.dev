import { Portal, cleanupPortals, getPortalManager } from './index'

describe('Portal', () => {
  beforeEach(() => {
    // Clean up any existing portals
    cleanupPortals()
    
    // Clear body
    document.body.innerHTML = ''
  })
  
  afterEach(() => {
    cleanupPortals()
  })
  
  it('should render content to document.body by default', () => {
    const content = document.createElement('div')
    content.textContent = 'Portal content'
    content.className = 'portal-content'
    
    Portal({
      children: content
    })
    
    const found = document.body.querySelector('.portal-content')
    expect(found).toBe(content)
    expect(found?.textContent).toBe('Portal content')
  })
  
  it('should render to specified container by selector', () => {
    const target = document.createElement('div')
    target.id = 'portal-root'
    document.body.appendChild(target)
    
    const content = document.createElement('div')
    content.textContent = 'Portal content'
    
    Portal({
      mount: '#portal-root',
      children: content
    })
    
    expect(target.contains(content)).toBe(true)
    expect(target.children.length).toBe(1)
  })
  
  it('should render to specified HTMLElement', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    
    const content = document.createElement('div')
    content.textContent = 'Portal content'
    
    Portal({
      mount: target,
      children: content
    })
    
    expect(target.contains(content)).toBe(true)
  })
  
  it('should support function children', () => {
    const target = document.createElement('div')
    target.id = 'portal-root'
    document.body.appendChild(target)
    
    Portal({
      mount: '#portal-root',
      children: () => {
        const el = document.createElement('span')
        el.textContent = 'Dynamic content'
        return el
      }
    })
    
    expect(target.children.length).toBe(1)
    expect(target.children[0].textContent).toBe('Dynamic content')
  })
  
  it('should register portal with manager', () => {
    const content = document.createElement('div')
    
    Portal({
      children: content
    })
    
    const manager = getPortalManager()
    const portals = manager.getPortals()
    
    expect(portals.length).toBe(1)
    expect(portals[0].content).toBe(content)
  })
  
  it('should cleanup portal manually', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    
    const content = document.createElement('div')
    content.textContent = 'Portal content'
    
    const wrapper = Portal({
      mount: target,
      children: content
    }) as any
    
    const parent = document.createElement('div')
    parent.appendChild(wrapper)
    document.body.appendChild(parent)
    
    expect(target.contains(content)).toBe(true)
    
    // Manual cleanup
    if (wrapper.__portalCleanup) {
      wrapper.__portalCleanup()
    }
    
    expect(target.contains(content)).toBe(false)
  })
  
  it('should handle multiple portals', () => {
    const target1 = document.createElement('div')
    const target2 = document.createElement('div')
    document.body.appendChild(target1)
    document.body.appendChild(target2)
    
    const content1 = document.createElement('div')
    content1.textContent = 'Portal 1'
    
    const content2 = document.createElement('div')
    content2.textContent = 'Portal 2'
    
    Portal({ mount: target1, children: content1 })
    Portal({ mount: target2, children: content2 })
    
    expect(target1.contains(content1)).toBe(true)
    expect(target2.contains(content2)).toBe(true)
    
    const manager = getPortalManager()
    expect(manager.getPortals().length).toBe(2)
  })
  
  it('should cleanup all portals', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    
    const content1 = document.createElement('div')
    const content2 = document.createElement('div')
    
    Portal({ mount: target, children: content1 })
    Portal({ mount: target, children: content2 })
    
    expect(target.children.length).toBe(2)
    
    cleanupPortals()
    
    expect(target.children.length).toBe(0)
    
    const manager = getPortalManager()
    expect(manager.getPortals().length).toBe(0)
  })
  
  it('should throw error for invalid mount target', () => {
    expect(() => {
      Portal({
        mount: '#non-existent',
        children: document.createElement('div')
      })
    }).toThrow('Portal mount target "#non-existent" not found')
  })
})
