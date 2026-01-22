# Making TSX Files Use Pulsar Icon in VS Code

There are several approaches to associate Pulsar's icon with `.tsx` files:

## Option 1: File Icon Theme Extension (Recommended)

### Using Material Icon Theme

1. **Install Extension**:

   ```
   ext install PKief.material-icon-theme
   ```

2. **Configure Custom Associations** in `.vscode/settings.json`:
   ```json
   {
     "workbench.iconTheme": "material-icon-theme",
     "material-icon-theme.files.associations": {
       "*.pulsar.tsx": "../../packages/pulsar/art-kit/SVG/pulsar-icon",
       "*.tsx": "../../packages/pulsar/art-kit/SVG/pulsar-icon"
     }
   }
   ```

### Using VSCode Icons

1. **Install Extension**:

   ```
   ext install vscode-icons-team.vscode-icons
   ```

2. **Configure**:
   ```json
   {
     "workbench.iconTheme": "vscode-icons",
     "vsicons.associations.files": [
       {
         "icon": "pulsar",
         "extensions": ["pulsar.tsx"],
         "format": "svg"
       }
     ]
   }
   ```

## Option 2: Create Custom Icon Theme Extension

For complete control, create a VS Code extension:

### 1. Create Extension Structure

```
pulsar-file-icons/
├── package.json
├── icons/
│   └── pulsar-icon.svg (copy from art-kit)
└── fileicons/
    └── pulsar-icon-theme.json
```

### 2. package.json

```json
{
  "name": "pulsar-file-icons",
  "displayName": "Pulsar File Icons",
  "description": "File icons for Pulsar framework files",
  "version": "0.1.0",
  "engines": {
    "vscode": "^1.80.0"
  },
  "contributes": {
    "iconThemes": [
      {
        "id": "pulsar-icons",
        "label": "Pulsar Icons",
        "path": "./fileicons/pulsar-icon-theme.json"
      }
    ]
  }
}
```

### 3. pulsar-icon-theme.json

```json
{
  "iconDefinitions": {
    "pulsar-tsx": {
      "iconPath": "../icons/pulsar-icon.svg"
    }
  },
  "fileExtensions": {
    "tsx": "pulsar-tsx"
  },
  "fileNames": {
    "*.pulsar.tsx": "pulsar-tsx"
  }
}
```

### 4. Install & Activate

```bash
cd pulsar-file-icons
vsce package
code --install-extension pulsar-file-icons-0.1.0.vsix
```

## Option 3: Naming Convention (Simplest)

Use a naming convention and configure icon theme to recognize it:

**File Naming**:

- `MyComponent.pulsar.tsx` - Will use Pulsar icon
- `MyComponent.tsx` - Will use default TSX icon

**Configuration**:

```json
{
  "material-icon-theme.files.associations": {
    "*.pulsar.tsx": "pulsar"
  }
}
```

## Option 4: Workspace-Specific Icons

For this monorepo specifically, configure per-folder:

```json
{
  "material-icon-theme.folders.associations": {
    "pulsar": "pulsar-icon",
    "packages/pulsar": "pulsar-icon"
  },
  "material-icon-theme.files.associations": {
    "*.tsx": "pulsar" // All .tsx in workspace
  }
}
```

## Recommended Approach

**For Development**: Use Option 1 (Material Icon Theme) with custom file associations.

**For Distribution**: Create Option 2 (Custom Extension) and publish to VS Code Marketplace.

**For Team**: Use Option 3 (Naming Convention) - `*.pulsar.tsx` for framework components.

## Current Setup

This workspace has been configured with Option 1:

- `.vscode/extensions.json` recommends Material Icon Theme
- `.vscode/settings.json` contains custom file associations

To activate:

1. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Type "File Icon Theme"
3. Select "Material Icon Theme"

Your `.tsx` files in Pulsar packages will now show the Pulsar icon! 🎨
