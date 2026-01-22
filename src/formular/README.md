# useFormular - Pulsar + formular.dev Integration

Signal-based reactive form management for Pulsar Framework with formular.dev.

## Features

✅ **Signal-Based Reactivity** - Automatic UI updates on form changes  
✅ **Built-in Validation** - String rules, custom functions, async validators  
✅ **Type-Safe** - Full TypeScript support with generics  
✅ **Nested Objects** - Deep object and array support  
✅ **Zero Config** - Works out of the box with sensible defaults  
✅ **formular.dev Compatible** - Leverages formular.dev's validation engine  
✅ **41+ Tests** - Comprehensive test coverage

## Installation

```bash
npm install @pulsar-framework/pulsar.dev
```

## Basic Usage

```typescript
import { useFormular } from '@pulsar-framework/pulsar.dev'

const MyForm = () => {
  const form = useFormular({
    initialValues: {
      name: '',
      email: '',
      age: 0
    },
    validators: {
      name: 'required|minLength:3',
      email: 'required|email',
      age: 'required|min:18'
    },
    onSubmit: async (values) => {
      await api.post('/users', values)
    }
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={form.fields.name.value()}
          onInput={(e) => form.fields.name.setValue(e.target.value)}
          onBlur={() => form.fields.name.setTouched(true)}
        />
        {form.fields.name.error() && (
          <span class="error">{form.fields.name.error()}</span>
        )}
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={form.fields.email.value()}
          onInput={(e) => form.fields.email.setValue(e.target.value)}
        />
        {form.fields.email.error() && (
          <span class="error">{form.fields.email.error()}</span>
        )}
      </div>

      <div>
        <label>Age:</label>
        <input
          type="number"
          value={form.fields.age.value()}
          onInput={(e) => form.fields.age.setValue(Number(e.target.value))}
        />
        {form.fields.age.error() && (
          <span class="error">{form.fields.age.error()}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={form.isSubmitting() || !form.isValid()}
      >
        {form.isSubmitting() ? 'Submitting...' : 'Submit'}
      </button>

      {form.error() && (
        <div class="form-error">{form.error()}</div>
      )}
    </form>
  )
}
```

## API Reference

### useFormular(options)

Creates a reactive form with validation and submission handling.

```typescript
function useFormular<T>(options: IFormularOptions<T>): IFormularHook<T>;
```

**Options:**

```typescript
interface IFormularOptions<T> {
  // Initial form values (required)
  initialValues: T;

  // Field validators (optional)
  validators?: ValidatorMap<T>;

  // Custom validator functions (optional)
  customValidators?: CustomValidatorMap;

  // Async validators (optional)
  asyncValidators?: AsyncValidatorMap<T>;

  // Validate on field change (default: false)
  validateOnChange?: boolean;

  // Validate on field blur (default: true)
  validateOnBlur?: boolean;

  // Validate on form mount (default: false)
  validateOnMount?: boolean;

  // Submit handler (optional)
  onSubmit?: (values: T) => void | Promise<void>;

  // Success handler (optional)
  onSuccess?: (response: any, values: T) => void;

  // Error handler (optional)
  onError?: (error: Error) => void;

  // Transform values before submit (optional)
  transformValues?: (values: T) => any;
}
```

**Returns:**

```typescript
interface IFormularHook<T> {
  // Reactive fields
  fields: FormularFields<T>;

  // Form state
  isSubmitting: ISignal<boolean>;
  isValid: ISignal<boolean>;
  isDirty: ISignal<boolean>;
  isTouched: ISignal<boolean>;
  isValidating: ISignal<boolean>;
  error: ISignal<string | null>;
  submitCount: ISignal<number>;

  // Methods
  getValues: () => T;
  setValues: (values: Partial<T>) => void;
  reset: () => void;
  validate: () => Promise<boolean>;
  handleSubmit: (e?: Event) => Promise<void>;
  submit: () => Promise<void>;
  getField: (path: string) => IFormularField | null;
}
```

### Field API

Each field has reactive signals and methods:

```typescript
interface IFormularField<T> {
  // Reactive state
  value: ISignal<T>;
  error: ISignal<string | null>;
  touched: ISignal<boolean>;
  dirty: ISignal<boolean>;
  validating: ISignal<boolean>;

  // Methods
  setValue: (value: T) => void;
  setTouched: (touched: boolean) => void;
  validate: () => Promise<boolean>;
  reset: () => void;
}
```

## Validation Rules

### Built-in Rules

```typescript
const form = useFormular({
  initialValues: {
    /* ... */
  },
  validators: {
    name: 'required', // Required field
    email: 'required|email', // Required email
    age: 'required|min:18|max:65', // Number range
    password: 'required|minLength:8', // Min length
    username: 'required|maxLength:20', // Max length
    url: 'pattern:^https?://', // Regex pattern
  },
});
```

**Available Rules:**

- `required` - Field must have a value
- `email` - Valid email format
- `min:n` - Minimum numeric value
- `max:n` - Maximum numeric value
- `minLength:n` - Minimum string length
- `maxLength:n` - Maximum string length
- `pattern:regex` - Custom regex pattern

### Custom Validators

```typescript
const form = useFormular({
  initialValues: { password: '' },
  validators: {
    password: (value: string) => {
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const isLong = value.length >= 8;

      if (!hasUpper || !hasLower || !hasNumber || !isLong) {
        return 'Password must contain uppercase, lowercase, number, and be 8+ characters';
      }
      return null;
    },
  },
});
```

### Named Custom Validators

```typescript
const form = useFormular({
  initialValues: { password: '' },
  validators: {
    password: 'strongPassword',
  },
  customValidators: {
    strongPassword: (value: string) => {
      // ... validation logic
      return value.length >= 8 ? null : 'Too weak';
    },
  },
});
```

### Async Validators

```typescript
const form = useFormular({
  initialValues: { username: '' },
  asyncValidators: {
    username: async (value) => {
      const response = await fetch(`/api/check-username/${value}`);
      const { available } = await response.json();
      return available ? null : 'Username already taken';
    },
  },
});
```

### Multiple Validators

Combine validators with pipe (`|`):

```typescript
validators: {
  email: 'required|email',
  age: 'required|min:18|max:100',
  username: 'required|minLength:3|maxLength:20'
}
```

Or use an array:

```typescript
validators: {
  password: ['required', 'minLength:8', (value) => (/[A-Z]/.test(value) ? null : 'Need uppercase')];
}
```

## Nested Objects

```typescript
const form = useFormular({
  initialValues: {
    user: {
      profile: {
        name: '',
        age: 0,
      },
      settings: {
        theme: 'light',
      },
    },
  },
  validators: {
    user: {
      profile: {
        name: 'required|minLength:3',
        age: 'required|min:18',
      },
    },
  },
});

// Access nested fields
form.fields.user.profile.name.setValue('John');
form.fields.user.settings.theme.setValue('dark');

// Or by path
const nameField = form.getField('user.profile.name');
```

## Arrays

```typescript
const form = useFormular({
  initialValues: {
    items: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ],
  },
});

// Access array
const items = form.fields.items.value();

// Update array
form.fields.items.setValue([...items, { id: 3, name: 'Item 3' }]);
```

## Form Submission

### Basic Submit

```typescript
const form = useFormular({
  initialValues: { name: '' },
  onSubmit: async (values) => {
    const response = await api.post('/users', values);
    console.log('Created:', response);
  },
});
```

### With Success/Error Handlers

```typescript
const form = useFormular({
  initialValues: { name: '' },
  onSubmit: async (values) => {
    return await api.post('/users', values);
  },
  onSuccess: (response, values) => {
    console.log('Success!', response);
    toast.success('User created');
    navigate('/users');
  },
  onError: (error) => {
    console.error('Error:', error);
    toast.error(error.message);
  },
});
```

### Transform Values

```typescript
const form = useFormular({
  initialValues: {
    firstName: '',
    lastName: '',
  },
  transformValues: (values) => ({
    fullName: `${values.firstName} ${values.lastName}`,
  }),
  onSubmit: async (transformed) => {
    // transformed = { fullName: 'John Doe' }
    await api.post('/users', transformed);
  },
});
```

## Advanced Examples

### Login Form

```typescript
const LoginForm = () => {
  const form = useFormular({
    initialValues: {
      email: '',
      password: '',
      remember: false
    },
    validators: {
      email: 'required|email',
      password: 'required|minLength:8'
    },
    onSubmit: async (values) => {
      const response = await auth.login(values)
      return response
    },
    onSuccess: (response) => {
      localStorage.setItem('token', response.token)
      navigate('/dashboard')
    },
    onError: (error) => {
      toast.error('Invalid credentials')
    }
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        type="email"
        value={form.fields.email.value()}
        onInput={(e) => form.fields.email.setValue(e.target.value)}
        placeholder="Email"
      />
      {form.fields.email.error() && (
        <span>{form.fields.email.error()}</span>
      )}

      <input
        type="password"
        value={form.fields.password.value()}
        onInput={(e) => form.fields.password.setValue(e.target.value)}
        placeholder="Password"
      />

      <label>
        <input
          type="checkbox"
          checked={form.fields.remember.value()}
          onChange={(e) => form.fields.remember.setValue(e.target.checked)}
        />
        Remember me
      </label>

      <button type="submit" disabled={form.isSubmitting()}>
        {form.isSubmitting() ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

### Registration Form

```typescript
const RegisterForm = () => {
  const form = useFormular({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validators: {
      username: 'required|minLength:3|maxLength:20',
      email: 'required|email',
      password: 'required|minLength:8',
      confirmPassword: (value, values) => {
        return value === values.password
          ? null
          : 'Passwords do not match'
      }
    },
    asyncValidators: {
      username: async (value) => {
        const response = await api.checkUsername(value)
        return response.available ? null : 'Username taken'
      },
      email: async (value) => {
        const response = await api.checkEmail(value)
        return response.available ? null : 'Email already registered'
      }
    },
    onSubmit: async (values) => {
      await api.register(values)
    },
    onSuccess: () => {
      toast.success('Registration successful!')
      navigate('/login')
    }
  })

  return (
    <form onSubmit={form.handleSubmit}>
      {/* Form fields... */}
    </form>
  )
}
```

## Migration from Vanilla formular.dev

**Before (vanilla formular.dev):**

```typescript
import { createForm } from '@formular-framework/formular.dev';

const form = createForm({
  initialValues: { name: '' },
});

// Imperative updates
form.fields.name.value = 'John';
console.log(form.fields.name.value);
```

**After (Pulsar):**

```typescript
import { useFormular } from '@pulsar-framework/pulsar.dev';

const form = useFormular({
  initialValues: { name: '' },
});

// Signal-based (reactive)
form.fields.name.setValue('John');
console.log(form.fields.name.value()); // Call signal getter
```

**Key Differences:**

1. **Values are signals**: Use `.value()` to get, `.setValue()` to set
2. **Automatic reactivity**: UI updates automatically when values change
3. **Hook-based**: Use inside Pulsar components
4. **All state is reactive**: `isSubmitting()`, `isValid()`, `error()`, etc.

## Best Practices

### 1. Validate on Blur

```typescript
<input
  value={form.fields.email.value()}
  onInput={(e) => form.fields.email.setValue(e.target.value)}
  onBlur={() => form.fields.email.validate()}
/>
```

### 2. Disable Submit While Submitting

```typescript
<button
  type="submit"
  disabled={form.isSubmitting() || !form.isValid()}
>
  {form.isSubmitting() ? 'Submitting...' : 'Submit'}
</button>
```

### 3. Show Errors Only After Touch

```typescript
{form.fields.email.touched() && form.fields.email.error() && (
  <span class="error">{form.fields.email.error()}</span>
)}
```

### 4. Reset Form After Success

```typescript
onSuccess: () => {
  form.reset();
  toast.success('Form submitted!');
};
```

## TypeScript Support

Full type safety with generics:

```typescript
interface UserForm {
  name: string;
  email: string;
  age: number;
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

const form = useFormular<UserForm>({
  initialValues: {
    name: '',
    email: '',
    age: 0,
    settings: {
      theme: 'light',
      notifications: true,
    },
  },
});

// TypeScript knows the types!
form.fields.name.value(); // string
form.fields.age.value(); // number
form.fields.settings.theme.value(); // 'light' | 'dark'
```

## Performance

- **Zero re-renders**: Only affected UI updates when signals change
- **Lazy validation**: Validates only when needed
- **Optimized updates**: Uses Pulsar's `batch()` for multiple changes
- **No dependencies**: Leverages Pulsar's built-in reactivity

## Testing

41+ test cases covering:

- ✅ Initialization
- ✅ Field updates
- ✅ Validation (sync & async)
- ✅ Form submission
- ✅ Nested objects
- ✅ Arrays
- ✅ Error handling
- ✅ Edge cases

## License

MIT
