# formular.dev Integration Plan

## Overview

Create a signal-based Pulsar hook for formular.dev that provides reactive form state management using Pulsar's reactivity system.

## Objectives

- Integrate formular.dev with Pulsar's signal system
- Provide `useFormular()` hook with automatic reactivity
- Zero configuration for simple use cases
- Full formular.dev API compatibility

## Architecture

### Core Hook: `useFormular()`

```typescript
function useFormular<TModel>(options: IFormularOptions<TModel>): IFormularHook<TModel>;
```

**Features:**

- Signal-based field values
- Automatic validation on change
- Form submission handling
- Error state management
- Dirty/touched/pristine tracking

### Integration Points

1. **Reactivity**
   - Wrap formular.dev field values in signals
   - Auto-update UI when values change
   - Batch updates for performance

2. **Validation**
   - Trigger validation on field blur
   - Real-time validation option
   - Async validation support

3. **Submission**
   - Handle form submission
   - Prevent default behavior
   - Loading state management

## File Structure

```
packages/pulsar.dev/src/formular/
├── use-formular.ts          # Main hook implementation
├── formular.types.ts        # TypeScript interfaces
├── formular-context.ts      # Form context for nested components
├── utils/
│   ├── signal-adapter.ts    # Signal wrapper for formular.dev
│   └── validation-helpers.ts # Validation utilities
├── __tests__/
│   └── use-formular.test.ts # Comprehensive tests
└── index.ts                  # Public exports
```

## Implementation Steps

### Phase 1: Core Hook (Day 1)

1. Create `use-formular.ts` with basic integration
2. Wrap field values in signals
3. Handle form creation and initialization
4. Basic change handlers

### Phase 2: Validation & State (Day 2)

1. Validation trigger logic
2. Error state signals
3. Dirty/touched/pristine signals
4. Form-level validation

### Phase 3: Advanced Features (Day 3)

1. Form context for nested components
2. Field arrays support
3. Dynamic fields
4. Custom validators integration

### Phase 4: Testing & Documentation (Day 4-5)

1. Comprehensive test suite
2. Usage examples
3. API documentation
4. Migration guide from vanilla formular.dev

## API Design

### Basic Usage

```typescript
import { useFormular } from '@pulsar-framework/pulsar.dev/formular'

const MyForm = () => {
  const form = useFormular({
    initialValues: {
      name: '',
      email: '',
      age: 0
    },
    validators: {
      email: 'email',
      age: 'number|min:18'
    },
    onSubmit: async (values) => {
      await api.post('/users', values)
    }
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        type="text"
        value={form.fields.name.value()}
        onInput={(e) => form.fields.name.setValue(e.target.value)}
      />
      {form.fields.name.error() && (
        <span class="error">{form.fields.name.error()}</span>
      )}

      <button type="submit" disabled={form.isSubmitting()}>
        {form.isSubmitting() ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

### Advanced Usage

```typescript
const form = useFormular({
  initialValues: {
    /* ... */
  },
  validators: {
    /* ... */
  },

  // Real-time validation
  validateOnChange: true,
  validateOnBlur: true,

  // Custom validators
  customValidators: {
    strongPassword: (value) => {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
    },
  },

  // Async validation
  asyncValidators: {
    email: async (value) => {
      const exists = await api.checkEmail(value);
      return !exists || 'Email already taken';
    },
  },

  // Submit handling
  onSubmit: async (values) => {
    /* ... */
  },
  onSuccess: (response) => {
    /* ... */
  },
  onError: (error) => {
    /* ... */
  },
});
```

### Field Arrays

```typescript
const form = useFormular({
  initialValues: {
    items: [{ name: '', quantity: 0 }],
  },
});

// Add item
form.fields.items.push({ name: '', quantity: 0 });

// Remove item
form.fields.items.remove(index);

// Update item
form.fields.items[0].name.setValue('Item 1');
```

## Success Criteria

1. **Reactivity**: All form state changes trigger UI updates
2. **Performance**: No performance degradation vs vanilla formular.dev
3. **Type Safety**: Full TypeScript support with generics
4. **Tests**: 30+ test cases covering all features
5. **Documentation**: Complete API docs with examples
6. **Zero Breaking Changes**: Drop-in replacement for formular.dev

## Timeline

- **Day 1**: Core hook + basic reactivity (4-6 hours)
- **Day 2**: Validation + state management (4-6 hours)
- **Day 3**: Advanced features (4-6 hours)
- **Day 4**: Testing (4-6 hours)
- **Day 5**: Documentation + examples (2-4 hours)

**Total**: 18-28 hours over 5 days

## Dependencies

- `@formular-framework/formular.dev` (existing package)
- Pulsar signals (`createSignal`, `createEffect`)
- No additional dependencies

## Testing Strategy

1. **Unit Tests**: Hook behavior, signal updates, validation
2. **Integration Tests**: Form submission, async validation
3. **Performance Tests**: Large forms, rapid updates
4. **Type Tests**: Generic type inference, autocomplete

## Migration Path

Users can migrate from vanilla formular.dev with minimal changes:

**Before (vanilla):**

```typescript
const form = createForm({
  /* ... */
});
form.fields.name.value = 'John';
```

**After (Pulsar):**

```typescript
const form = useFormular({
  /* ... */
});
form.fields.name.setValue('John'); // Signal setter
const name = form.fields.name.value(); // Signal getter
```

## Next Steps

1. Implement core `useFormular()` hook
2. Create signal adapter utilities
3. Write comprehensive tests
4. Document API and examples
5. Create example app demonstrating integration
