# Code Transformation Examples

This document shows how Visual Schema Builder transforms JSX code into direct DOM manipulation.

## Example 1: Static Element

### Input (TSX)
```tsx
const MyComponent = () => {
    return <div className="container">Hello World</div>
}
```

### Output (Generated JavaScript)
```javascript
const MyComponent = () => {
    return (() => {
        const el0 = document.createElement('div')
        el0.className = 'container'
        el0.appendChild(document.createTextNode('Hello World'))
        return el0
    })()
}
```

---

## Example 2: Dynamic Property

### Input (TSX)
```tsx
const Counter = () => {
    const [count, setCount] = useState(0)
    
    return <div className="counter">{count()}</div>
}
```

### Output (Generated JavaScript)
```javascript
const Counter = () => {
    const [count, setCount] = useState(0)
    
    return (() => {
        const el0 = document.createElement('div')
        el0.className = 'counter'
        
        createEffect(() => {
            el0.textContent = count()
        })
        
        return el0
    })()
}
```

---

## Example 3: Event Handler

### Input (TSX)
```tsx
const Button = () => {
    const handleClick = (e) => {
        console.log('Clicked!')
    }
    
    return <button onClick={handleClick}>Click me</button>
}
```

### Output (Generated JavaScript)
```javascript
const Button = () => {
    const handleClick = (e) => {
        console.log('Clicked!')
    }
    
    return (() => {
        const el0 = document.createElement('button')
        el0.appendChild(document.createTextNode('Click me'))
        el0.addEventListener('click', handleClick)
        return el0
    })()
}
```

---

## Example 4: Multiple Dynamic Properties

### Input (TSX)
```tsx
const Input = () => {
    const [value, setValue] = useState('')
    const [isValid, setIsValid] = useState(true)
    
    const className = () => isValid() ? 'valid' : 'invalid'
    
    return <input className={className()} value={value()} />
}
```

### Output (Generated JavaScript)
```javascript
const Input = () => {
    const [value, setValue] = useState('')
    const [isValid, setIsValid] = useState(true)
    
    const className = () => isValid() ? 'valid' : 'invalid'
    
    return (() => {
        const el0 = document.createElement('input')
        
        createEffect(() => {
            el0.className = className()
        })
        
        createEffect(() => {
            el0.value = value()
        })
        
        return el0
    })()
}
```

---

## Example 5: Nested Elements

### Input (TSX)
```tsx
const Card = () => {
    return (
        <div className="card">
            <h2 className="title">Card Title</h2>
            <p className="content">Card content</p>
        </div>
    )
}
```

### Output (Generated JavaScript)
```javascript
const Card = () => {
    return (() => {
        const el0 = document.createElement('div')
        el0.className = 'card'
        
        const el1 = document.createElement('h2')
        el1.className = 'title'
        el1.appendChild(document.createTextNode('Card Title'))
        el0.appendChild(el1)
        
        const el2 = document.createElement('p')
        el2.className = 'content'
        el2.appendChild(document.createTextNode('Card content'))
        el0.appendChild(el2)
        
        return el0
    })()
}
```

---

## Example 6: Ref Usage

### Input (TSX)
```tsx
const FocusableInput = () => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    
    const focus = () => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }
    
    return (
        <div>
            <input ref={inputRef} type="text" />
            <button onClick={focus}>Focus Input</button>
        </div>
    )
}
```

### Output (Generated JavaScript)
```javascript
const FocusableInput = () => {
    const inputRef = useRef(null)
    
    const focus = () => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }
    
    return (() => {
        const el0 = document.createElement('div')
        
        const el1 = document.createElement('input')
        el1.type = 'text'
        
        if (inputRef && typeof inputRef === 'object' && 'current' in inputRef) {
            inputRef.current = el1
        }
        
        el0.appendChild(el1)
        
        const el2 = document.createElement('button')
        el2.appendChild(document.createTextNode('Focus Input'))
        el2.addEventListener('click', focus)
        el0.appendChild(el2)
        
        return el0
    })()
}
```

---

## Example 7: Conditional Rendering

### Input (TSX)
```tsx
const Toggle = () => {
    const [show, setShow] = useState(false)
    
    return (
        <div>
            {show() && <p>Visible content</p>}
            <button onClick={() => setShow(s => !s())}>Toggle</button>
        </div>
    )
}
```

### Output (Generated JavaScript)
```javascript
const Toggle = () => {
    const [show, setShow] = useState(false)
    
    return (() => {
        const el0 = document.createElement('div')
        
        createEffect(() => {
            el0.textContent = show() && (() => {
                const el1 = document.createElement('p')
                el1.appendChild(document.createTextNode('Visible content'))
                return el1
            })()
        })
        
        const el2 = document.createElement('button')
        el2.appendChild(document.createTextNode('Toggle'))
        el2.addEventListener('click', () => setShow(s => !s()))
        el0.appendChild(el2)
        
        return el0
    })()
}
```

---

## Example 8: List Rendering

### Input (TSX)
```tsx
const TodoList = () => {
    const [items, setItems] = useState(['Task 1', 'Task 2', 'Task 3'])
    
    return (
        <ul className="todo-list">
            {items().map(item => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    )
}
```

### Output (Generated JavaScript)
```javascript
const TodoList = () => {
    const [items, setItems] = useState(['Task 1', 'Task 2', 'Task 3'])
    
    return (() => {
        const el0 = document.createElement('ul')
        el0.className = 'todo-list'
        
        createEffect(() => {
            el0.textContent = items().map(item => (() => {
                const el1 = document.createElement('li')
                el1.appendChild(document.createTextNode(item))
                return el1
            })())
        })
        
        return el0
    })()
}
```

---

## Key Transformation Patterns

### 1. Static Properties
- Set directly on element creation
- No reactive wrapper needed

### 2. Dynamic Properties
- Wrapped in `createEffect` for automatic updates
- Dependencies tracked automatically

### 3. Event Handlers
- Attached via `addEventListener`
- No synthetic event wrapping in generated code (handled at runtime)

### 4. Text Content
- Static: `document.createTextNode()`
- Dynamic: Wrapped in `createEffect`

### 5. Children
- Static: Appended immediately
- Dynamic: Generated on demand within effects

### 6. Refs
- Assigned with runtime type check
- Supports both object refs and callback refs

---

## Performance Characteristics

**Static Elements:**
- Created once, no overhead
- Minimal generated code
- Direct DOM manipulation

**Dynamic Elements:**
- Fine-grained reactivity via signals
- Only updated properties re-run
- No virtual DOM diffing
- Efficient memory usage

**Event Handlers:**
- Direct event listeners
- No synthetic event pool
- Automatic cleanup on unmount

---

## Optimization Opportunities

The transformer can detect:
1. Completely static subtrees → generate once
2. Single dynamic property → single effect
3. Multiple independent dynamic properties → separate effects
4. Static children → append without effect
5. Keyed lists → optimize reconciliation (future)
