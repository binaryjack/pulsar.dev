import { createSignal } from '../reactivity'
import { For, Show } from './index'

describe('Control Flow Components', () => {
  describe('Show', () => {
    it('should render children when condition is true', () => {
      const child = document.createElement('div')
      child.textContent = 'Visible'
      
      const container = Show({
        when: true,
        children: child
      })
      
      expect(container.children.length).toBe(1)
      expect(container.children[0].textContent).toBe('Visible')
    })
    
    it('should render fallback when condition is false', () => {
      const child = document.createElement('div')
      child.textContent = 'Visible'
      
      const fallback = document.createElement('div')
      fallback.textContent = 'Hidden'
      
      const container = Show({
        when: false,
        children: child,
        fallback
      })
      
      expect(container.children.length).toBe(1)
      expect(container.children[0].textContent).toBe('Hidden')
    })
    
    it('should render nothing when condition is false and no fallback', () => {
      const child = document.createElement('div')
      child.textContent = 'Visible'
      
      const container = Show({
        when: false,
        children: child
      })
      
      expect(container.children.length).toBe(0)
    })
    
    it('should reactively update when signal changes', () => {
      const [isVisible, setIsVisible] = createSignal(true)
      
      const child = document.createElement('div')
      child.textContent = 'Visible'
      
      const fallback = document.createElement('div')
      fallback.textContent = 'Hidden'
      
      const container = Show({
        when: isVisible,
        children: child,
        fallback
      })
      
      expect(container.children[0].textContent).toBe('Visible')
      
      setIsVisible(false)
      expect(container.children[0].textContent).toBe('Hidden')
      
      setIsVisible(true)
      expect(container.children[0].textContent).toBe('Visible')
    })
    
    it('should support function children', () => {
      const container = Show({
        when: true,
        children: () => {
          const el = document.createElement('span')
          el.textContent = 'Dynamic'
          return el
        }
      })
      
      expect(container.children[0].textContent).toBe('Dynamic')
    })
  })
  
  describe('For', () => {
    it('should render array of items', () => {
      const items = ['a', 'b', 'c']
      
      const container = For({
        each: items,
        children: (item) => {
          const el = document.createElement('div')
          el.textContent = item
          return el
        }
      })
      
      expect(container.children.length).toBe(3)
      expect(container.children[0].textContent).toBe('a')
      expect(container.children[1].textContent).toBe('b')
      expect(container.children[2].textContent).toBe('c')
    })
    
    it('should render fallback when array is empty', () => {
      const fallback = document.createElement('div')
      fallback.textContent = 'No items'
      
      const container = For({
        each: [],
        children: () => document.createElement('div'),
        fallback
      })
      
      expect(container.children.length).toBe(1)
      expect(container.children[0].textContent).toBe('No items')
    })
    
    it('should reactively update when array changes', () => {
      const [items, setItems] = createSignal(['a', 'b'])
      
      const container = For({
        each: items,
        children: (item) => {
          const el = document.createElement('div')
          el.textContent = item
          return el
        }
      })
      
      expect(container.children.length).toBe(2)
      
      setItems(['a', 'b', 'c'])
      expect(container.children.length).toBe(3)
      expect(container.children[2].textContent).toBe('c')
      
      setItems(['x'])
      expect(container.children.length).toBe(1)
      expect(container.children[0].textContent).toBe('x')
    })
    
    it('should pass index to children function', () => {
      const items = ['a', 'b', 'c']
      const indices: number[] = []
      
      For({
        each: items,
        children: (item, index) => {
          indices.push(index())
          const el = document.createElement('div')
          el.textContent = `${index()}: ${item}`
          return el
        }
      })
      
      expect(indices).toEqual([0, 1, 2])
    })
    
    it('should use key function for reconciliation', () => {
      interface Item {
        id: number
        name: string
      }
      
      const [items, setItems] = createSignal<Item[]>([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ])
      
      const elementMap = new Map<number, HTMLElement>()
      
      const container = For({
        each: items,
        key: (item) => item.id,
        children: (item) => {
          const el = document.createElement('div')
          el.textContent = item.name
          elementMap.set(item.id, el)
          return el
        }
      })
      
      const aliceElement = elementMap.get(1)
      const bobElement = elementMap.get(2)
      
      expect(container.children.length).toBe(2)
      
      // Swap order
      setItems([
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice' }
      ])
      
      // Elements should be reused, not recreated
      expect(container.children[0]).toBe(bobElement)
      expect(container.children[1]).toBe(aliceElement)
    })
    
    it('should handle complex objects', () => {
      interface Todo {
        id: number
        text: string
        completed: boolean
      }
      
      const todos: Todo[] = [
        { id: 1, text: 'Task 1', completed: false },
        { id: 2, text: 'Task 2', completed: true }
      ]
      
      const container = For({
        each: todos,
        key: (todo) => todo.id,
        children: (todo) => {
          const el = document.createElement('div')
          el.textContent = `${todo.text} - ${todo.completed ? 'Done' : 'Pending'}`
          return el
        }
      })
      
      expect(container.children.length).toBe(2)
      expect(container.children[0].textContent).toBe('Task 1 - Pending')
      expect(container.children[1].textContent).toBe('Task 2 - Done')
    })
  })
  
  describe('Integration', () => {
    it('should work together with nested Show and For', () => {
      const [isVisible, setIsVisible] = createSignal(true)
      const [items, setItems] = createSignal(['a', 'b'])
      
      const container = Show({
        when: isVisible,
        children: For({
          each: items,
          children: (item) => {
            const el = document.createElement('div')
            el.textContent = item
            return el
          }
        }),
        fallback: () => {
          const el = document.createElement('div')
          el.textContent = 'Hidden'
          return el
        }
      })
      
      expect(container.children.length).toBe(1)
      const forContainer = container.children[0] as HTMLElement
      expect(forContainer.children.length).toBe(2)
      
      setIsVisible(false)
      expect(container.children[0].textContent).toBe('Hidden')
      
      setIsVisible(true)
      setItems(['x', 'y', 'z'])
      expect((container.children[0] as HTMLElement).children.length).toBe(3)
    })
  })
})
