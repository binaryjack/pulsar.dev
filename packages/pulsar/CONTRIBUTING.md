# Pulsar Framework

A modern, standalone reactive framework for building web applications.

## Project Structure

```
pulsar/
├── src/                    # Source code
│   ├── bootstrap/          # Application bootstrap
│   ├── hooks/              # React-like hooks
│   ├── reactivity/         # Signal-based reactivity
│   ├── router/             # Routing system
│   ├── di/                 # Dependency injection
│   ├── error-boundary/     # Error handling
│   ├── control-flow/       # Control flow components
│   ├── lifecycle/          # Lifecycle management
│   ├── portal/             # Portal system
│   ├── resource/           # Resource management
│   ├── events/             # Event system
│   ├── context/            # Context API
│   ├── dev/                # Development utilities
│   └── docs/               # Documentation
├── index.ts                # Main entry point
├── package.json            # Package configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── vitest.config.ts        # Vitest test configuration
├── eslint.config.js        # ESLint configuration
├── .prettierrc             # Prettier configuration
├── .editorconfig           # Editor configuration
└── README.md               # This file

```

## Installation

```bash
# Install dependencies
pnpm install

# Build the framework
pnpm build

# Run in development mode
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## Development

### Building

The framework uses Vite for building. The build outputs ES modules to the `dist/` directory with full TypeScript declarations.

### Testing

Uses Vitest for unit testing with coverage support.

### Code Quality

- **ESLint**: Configured with TypeScript support
- **Prettier**: Enforces consistent code formatting
- **TypeScript**: Strict mode enabled for type safety

## Scripts

- `pnpm dev` - Build in watch mode
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm test:ui` - Run tests with UI
- `pnpm lint` - Lint code
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code
- `pnpm format:check` - Check code formatting
- `pnpm typecheck` - Type check without emitting

## License

MIT
