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
    }).toThrow() // Just check that it throws, error message may vary by environment
  })

  // JSX Integration Tests (Array Children)
  describe('JSX Integration - Array Children', () => {
    it('should handle single child in array (JSX transformer output)', () => {
      const target = document.createElement('div')
      target.id = 'portal-root'
      document.body.appendChild(target)

      const child = document.createElement('div')
      child.textContent = 'Single child in array'
      child.className = 'jsx-child'

      // Simulate JSX transformer: <Portal><div>...</div></Portal>
      Portal({
        mount: '#portal-root',
        children: [child]  // Array with single element
      })

      const found = target.querySelector('.jsx-child')
      expect(found).toBe(child)
      expect(found?.textContent).toBe('Single child in array')
    })

    it('should handle multiple children in array (JSX transformer output)', () => {
      const target = document.createElement('div')
      document.body.appendChild(target)

      const child1 = document.createElement('div')
      child1.textContent = 'Child 1'
      child1.className = 'child-1'

      const child2 = document.createElement('span')
      child2.textContent = 'Child 2'
      child2.className = 'child-2'

      const child3 = document.createElement('p')
      child3.textContent = 'Child 3'
      child3.className = 'child-3'

      // Simulate JSX transformer: <Portal><div/><span/><p/></Portal>
      Portal({
        mount: target,
        children: [child1, child2, child3]
      })

      expect(target.querySelector('.child-1')).toBe(child1)
      expect(target.querySelector('.child-2')).toBe(child2)
      expect(target.querySelector('.child-3')).toBe(child3)

      // Should be wrapped in display:contents div
      const wrapper = target.children[0] as HTMLElement
      expect(wrapper.style.display).toBe('contents')
      expect(wrapper.getAttribute('data-portal-wrapper')).toBe('true')
      expect(wrapper.children.length).toBe(3)
    })

    it('should handle empty array children', () => {
      const target = document.createElement('div')
      document.body.appendChild(target)

      // Empty array from conditional JSX
      const wrapper = Portal({
        mount: target,
        children: []
      })

      // Should return empty wrapper
      expect(wrapper.style.display).toBe('none')
      expect(target.children.length).toBe(0)
    })

    it('should handle null/undefined children', () => {
      const target = document.createElement('div')
      document.body.appendChild(target)

      Portal({
        mount: target,
        children: null as any
      })

      expect(target.children.length).toBe(0)

      Portal({
        mount: target,
        children: undefined as any
      })

      expect(target.children.length).toBe(0)
    })

    it('should handle array with null/undefined elements', () => {
      const target = document.createElement('div')
      document.body.appendChild(target)

      const child = document.createElement('div')
      child.textContent = 'Valid child'
      child.className = 'valid-child'

      // Array with mixed null/undefined (from conditional JSX)
      Portal({
        mount: target,
        children: [null, child, undefined, false, true]
      })

      // Should only render valid child (but may be in wrapper)
      const found = target.querySelector('.valid-child')
      expect(found).toBe(child)
      expect(target.textContent?.trim()).toBe('Valid child')
    })

    it('should handle text/number children in array', () => {
      const target = document.createElement('div')
      document.body.appendChild(target)

      // Text and numbers from JSX
      Portal({
        mount: target,
        children: ['Hello', 42, 'World']
      })

      const spans = target.querySelectorAll('span')
      expect(spans.length).toBe(3)
      expect(spans[0].textContent).toBe('Hello')
      expect(spans[1].textContent).toBe('42')
      expect(spans[2].textContent).toBe('World')
    })

    it('should handle nested arrays (flattening)', () => {
      const target = document.createElement('div')
      document.body.appendChild(target)

      const child1 = document.createElement('div')
      child1.textContent = 'Child 1'

      const child2 = document.createElement('div')
      child2.textContent = 'Child 2'

      // Nested array structure
      Portal({
        mount: target,
        children: [[child1], child2]
      })

      expect(target.textContent).toContain('Child 1')
      expect(target.textContent).toContain('Child 2')
    })

    it('should handle function returning array', () => {
      const target = document.createElement('div')
      document.body.appendChild(target)

      const child1 = document.createElement('div')
      child1.className = 'func-child-1'

      const child2 = document.createElement('div')
      child2.className = 'func-child-2'

      // Function that returns array
      Portal({
        mount: target,
        children: () => [child1, child2]
      })

      expect(target.querySelector('.func-child-1')).toBe(child1)
      expect(target.querySelector('.func-child-2')).toBe(child2)
    })

    it('should handle mixed element types in array', () => {
      const target = document.createElement('div')
      document.body.appendChild(target)

      const div = document.createElement('div')
      div.textContent = 'Div'
      div.className = 'test-div'

      const span = document.createElement('span')
      span.textContent = 'Span'
      span.className = 'test-span'

      // Mixed HTML elements, text, and numbers
      Portal({
        mount: target,
        children: [div, 'Text', 123, span, null]
      })

      expect(target.querySelector('.test-div')?.textContent).toBe('Div')
      expect(target.querySelector('.test-span')?.textContent).toBe('Span')
      expect(target.textContent).toContain('Text')
      expect(target.textContent).toContain('123')
    })
  })
})
