# Learning Journey: Building pulsar

This document captures the key insights, challenges, and breakthroughs discovered while building pulsar.

## 1. The JsxExpression Unwrapping Problem

### The Issue
When transforming JSX, TypeScript wraps expressions in `JsxExpression` nodes:

```tsx
<button onClick={handleClick}>Click</button>
//              ^^^^^^^^^^^^^ - Wrapped in JsxExpression
```

### The Discovery
Our transformer was passing the **entire JsxExpression node** instead of extracting the inner expression. This caused:
- `Debug Failure. Unhandled SyntaxKind: JsxExpression`
- Tests passed but real apps failed

### The Fix
Always unwrap JsxExpression nodes:

```typescript
// ❌ WRONG
events.push({
  handler: prop.initializer  // JsxExpression node
})

// ✅ CORRECT  
let handler: ts.Expression | undefined
if (ts.isJsxExpression(prop.initializer)) {
  handler = prop.initializer.expression  // Unwrap!
} else {
  handler = prop.initializer as ts.Expression
}
```

**Lesson:** JSX expressions are containers - always extract `.expression` property.

---

## 2. Component Detection Pattern

### The Challenge
Distinguishing between HTML elements and components:

```tsx
<div />      // HTML element
<Counter />  // Component (should be function call)
```

### The Solution
Components start with uppercase:

```typescript
function isComponentTag(tagName: string): boolean {
  return tagName.length > 0 && tagName[0] === tagName[0].toUpperCase()
}

// Also handle property access:
<AppContext.Provider />  // Get "Provider" from PropertyAccessExpression
```

**Lesson:** Case matters! Use TypeScript's `isPropertyAccessExpression` for dotted components.

---

## 3. Children as Expressions Need Text Nodes

### The Bug
```tsx
<div>{count()}</div>
```

Generated invalid code:
```typescript
el.appendChild(count())  // ❌ Can't append number/string
```

### The Fix
Wrap primitive expressions in text nodes:

```typescript
// For static expressions
parent.appendChild(
  document.createTextNode(String(expr))
)

// For dynamic expressions
createEffect(() => {
  parent.textContent = String(expr())
})
```

**Lesson:** Expressions can return primitives - always convert to text nodes.

---

## 4. Hyphenated Attributes Need setAttribute

### The Problem
```tsx
<div aria-label="test" />
```

Generated invalid JavaScript:
```typescript
el.aria-label = "test"  // ❌ Syntax error: unexpected token
```

### The Solution
Detect hyphens and use `setAttribute`:

```typescript
const needsSetAttribute = 
  prop.name.includes('-') || 
  prop.name.startsWith('aria') ||
  prop.name.startsWith('data')

if (needsSetAttribute) {
  el.setAttribute(prop.name, value)
} else {
  el[prop.name] = value
}
```

**Lesson:** DOM attributes ≠ JavaScript properties. Use `setAttribute` for special cases.

---

## 5. Visitor Pattern Depth

### The Issue
Tests passed but real components failed because JSX inside function bodies wasn't transformed.

### The Root Cause
`ts.visitEachChild()` visits direct children but **not nested scopes** (function bodies, arrow functions).

### Working Solution
The transformer must be a **complete visitor** that recursively visits ALL node types:

```typescript
const visitor: ts.Visitor = (node: ts.Node): ts.VisitResult<ts.Node> => {
  // Transform JSX
  if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
    return transformJSX(node)
  }
  
  // CRITICAL: Visit all children recursively
  return ts.visitEachChild(node, visitor, context)
}
```

**Lesson:** TypeScript's visitor pattern requires explicit recursion - don't rely on automatic traversal.

---

## 6. Test Environment vs Real Environment

### The Trap
Tests can pass while real apps fail because:

1. **Test code is simpler** - less nesting, fewer edge cases
2. **Test setup differs** - different TypeScript compilation flow
3. **Vite plugin vs test runner** - different AST processing

### The Breakthrough
Added **diagnostic logging** in the Vite plugin:

```typescript
// Check for remaining JSX nodes after transformation
const checker = (node: ts.Node): ts.Node => {
  if (ts.isJsxExpression(node)) {
    console.error('Found untransformed JSX at line:', getLine(node))
  }
  return ts.visitEachChild(node, checker, undefined)
}
```

**Lesson:** Tests are necessary but not sufficient. Always validate in the real runtime environment.

---

## 7. Type Safety in Prototype Methods

### The Problem
Using `IElementGenerator` when accessing `this.context`:

```typescript
export const generateComponentCall = function(
  this: IElementGenerator,  // ❌ Wrong interface
  componentIR: any
) {
  this.context.jsxVisitor  // ❌ Error: Property 'context' doesn't exist
}
```

### The Solution
Use `IElementGeneratorInternal` which exposes internal properties:

```typescript
export const generateComponentCall = function(
  this: IElementGeneratorInternal,  // ✅ Has context property
  componentIR: any
) {
  this.context.jsxVisitor  // ✅ Works!
}
```

**Lesson:** Public interfaces hide internals. Prototype methods need internal interfaces with `context`, `varCounter`, etc.

---

## 8. Signal Granularity vs Object Updates

### The Insight
React developers often do:

```typescript
const [user, setUser] = useState({ name: 'Bob', age: 30 })
```

In pulsar, this creates **coarse-grained reactivity**:

```tsx
<h1>{user().name}</h1>  // Re-renders when age changes too ❌
```

### The Better Pattern
Split into separate signals:

```typescript
const [name, setName] = useState('Bob')
const [age, setAge] = useState(30)

<h1>{name()}</h1>  // Only updates when name changes ✅
```

**Lesson:** Fine-grained reactivity requires fine-grained state. One signal per reactive value.

---

## 9. Component Execution Model

### React's Model
```typescript
function Counter({ count }) {
  // Runs on EVERY state change
  console.log('Component running')
  return <div>{count}</div>
}
```

### pulsar's Model
```typescript
export const Counter = ({ count }) => {
  // Runs ONCE on mount
  console.log('Component running')
  return <div>{count()}</div>
  // Future updates: only the text node changes
}
```

**Key differences:**
1. Components are **constructors**, not render functions
2. They run **once** and return a DOM element
3. Reactivity happens in **effects**, not component re-execution
4. Props are accessed once during construction

**Lesson:** Mental shift from "component = render function" to "component = element factory".

---

## 10. The Power of Batching (Not Yet Implemented)

### The Problem
Multiple state updates trigger multiple effect executions:

```typescript
setCount(1)
setName('Bob')
setAge(30)
// Triggers 3+ DOM updates immediately
```

### The Solution (Coming)
Batch updates together:

```typescript
batch(() => {
  setCount(1)
  setName('Bob')
  setAge(30)
})
// Triggers 1 batched DOM update
```

**Lesson:** Even with fine-grained reactivity, batching prevents unnecessary intermediate renders.

---

## 11. TypeScript Compilation Strategy

### Vite Plugin Discovery
Initially used `program.emit()` which failed. Switched to `ts.transform()` + `printer.printFile()`:

```typescript
// ❌ WRONG - emits with JSX still present
program.emit(undefined, writeFile, undefined, false, {
  before: [transformerFactory]
})

// ✅ CORRECT - transforms then prints
const result = ts.transform(sourceFile, [transformerFactory])
const printer = ts.createPrinter()
const output = printer.printFile(result.transformed[0])
```

**Lesson:** `emit()` runs through full compilation pipeline. For transformers, use `transform()` directly.

---

## 12. Fragment Implementation

### JSX Fragments
```tsx
<><Counter /><Home /></>
```

### Implementation Approach
Use `DocumentFragment`:

```typescript
if (ts.isJsxFragment(node)) {
  return {
    type: 'fragment',
    children: analyzeChildren(node.children)
  }
}

// Generator:
const fragment = document.createDocumentFragment()
children.forEach(child => fragment.appendChild(child))
return fragment
```

**Lesson:** DocumentFragment is perfect for grouping without wrapper elements.

---

## Key Architectural Insights

### 1. Signals Are Subscriptions
Signals aren't just values - they're **pub/sub systems**:
- Reading = subscribing
- Writing = publishing
- Effects = subscribers

### 2. Direct DOM = Less Abstraction
No virtual DOM means:
- **Pro:** Simpler mental model, better performance
- **Con:** More responsibility on framework user (can't rely on reconciliation magic)

### 3. Compile-Time > Runtime
Moving work to compile-time:
- Smaller runtime bundle
- Faster execution
- Better tree-shaking
- Type errors caught earlier

### 4. TypeScript AST is Powerful but Complex
- Must understand node types deeply
- Visitor pattern requires careful recursion
- Type guards are essential
- Testing must cover all contexts

---

## Common Pitfalls to Avoid

1. **Forgetting `()` on signals** - `count` vs `count()`
2. **Using object state** - Splits into separate signals
3. **Assuming component re-runs** - They don't!
4. **Not unwrapping JsxExpression** - Check for wrappers
5. **Shallow visitor traversal** - Visit ALL node types
6. **Testing only simple cases** - Real apps have complexity

---

## What We'd Do Differently

1. **Start with batching** - Should have been in from day 1
2. **More diagnostic tools** - Built-in debugging helpers
3. **Keyed reconciliation earlier** - Lists are common
4. **Better error messages** - Guide users to solutions
5. **DevTools from start** - Visibility is crucial

---

## The Path Forward

### Immediate Priorities
1. ✅ Batch updates - Prevent excessive re-renders
2. ✅ Show/For components - Control flow primitives
3. ✅ Dev warnings - Better DX
4. ✅ Portal - Escape hatches

### Next Phase
5. ⏳ Keyed reconciliation - Efficient lists
6. ⏳ Resource/async - Data fetching
7. ⏳ Store system - Global state
8. ⏳ Error boundaries - Resilience

---

## Conclusion

Building pulsar taught us that **fine-grained reactivity** requires:
- Deep understanding of TypeScript AST
- Careful distinction between compile-time and runtime
- Signal-based thinking over component-based thinking
- Direct DOM manipulation with automatic tracking

The result is a framework that's:
- **Fast** - No VDOM overhead
- **Small** - Minimal runtime
- **Type-safe** - Full TypeScript support
- **Familiar** - React-like API

Next step: Make it production-ready with batching, control flow, and better DX.
