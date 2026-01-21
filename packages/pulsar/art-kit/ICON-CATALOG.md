# Pulsar Art Kit - Icon Catalog

Complete icon set for the Pulsar framework with consistent blue gradient theme (#4ac7ee → #263b96).

## 📦 Categories

### Branding (3)

- `pulsar-logo.svg` - Full logo with text
- `pulsar-icon.svg` - Icon only
- `pulsar-logo-name.svg` - Horizontal logo with name

### Feature Icons (6)

- `icon-dom.svg` - Direct DOM manipulation
- `icon-reactivity.svg` - Fine-grained reactivity
- `icon-hooks.svg` - React-compatible hooks
- `icon-flow.svg` - Control flow
- `icon-styles.svg` - Styling system
- `icon-typescript.svg` - TypeScript support

### App Icons (12)

- `icon-home.svg` - Home/dashboard
- `icon-settings.svg` - Settings/configuration
- `icon-search.svg` - Search functionality
- `icon-notification.svg` - Notifications/alerts
- `icon-user.svg` - User profile/account
- `icon-menu.svg` - Navigation menu
- `icon-close.svg` - Close/dismiss
- `icon-edit.svg` - Edit/modify
- `icon-delete.svg` - Delete/remove
- `icon-save.svg` - Save/persist
- `icon-refresh.svg` - Refresh/reload
- `icon-more.svg` - More options

### Marketing & Analytics (8)

- `icon-chart.svg` - Bar chart/analytics
- `icon-trending-up.svg` - Growth/trending
- `icon-target.svg` - Goals/objectives
- `icon-megaphone.svg` - Marketing/announcements
- `icon-star.svg` - Rating/favorite
- `icon-share.svg` - Share/distribute
- `icon-heart.svg` - Like/favorite
- `icon-thumbs-up.svg` - Approve/like

### Form Elements (9)

- `icon-input.svg` - Text input field
- `icon-checkbox-checked.svg` - Checked checkbox
- `icon-checkbox-unchecked.svg` - Unchecked checkbox
- `icon-radio-selected.svg` - Selected radio button
- `icon-radio-unselected.svg` - Unselected radio button
- `icon-dropdown.svg` - Dropdown/select
- `icon-calendar.svg` - Date picker
- `icon-upload.svg` - File upload
- `icon-download.svg` - File download

### Architecture & Infrastructure (8)

- `icon-database.svg` - Database/storage
- `icon-server.svg` - Server/backend
- `icon-cloud.svg` - Cloud services
- `icon-api.svg` - API/endpoints
- `icon-workflow.svg` - Workflow/process
- `icon-pipeline.svg` - CI/CD pipeline
- `icon-component.svg` - Component architecture
- `icon-module.svg` - Module/package

### Code Specifics (8)

- `icon-function.svg` - Function/method
- `icon-class.svg` - Class/OOP
- `icon-variable.svg` - Variable/state
- `icon-import.svg` - Import statement
- `icon-export.svg` - Export statement
- `icon-git-branch.svg` - Git branching
- `icon-git-commit.svg` - Git commit
- `icon-terminal.svg` - Terminal/CLI

### Technology Stack (7)

- `icon-javascript.svg` - JavaScript
- `icon-react.svg` - React
- `icon-vue.svg` - Vue.js
- `icon-angular.svg` - Angular
- `icon-node.svg` - Node.js
- `icon-vite.svg` - Vite
- `icon-webpack.svg` - Webpack

### Status Indicators (5)

- `icon-success.svg` - Success/complete (✅ replacement)
- `icon-error.svg` - Error/failure (❌ replacement)
- `icon-warning.svg` - Warning/caution (🟡 replacement)
- `icon-info.svg` - Information
- `icon-pending.svg` - Pending/in-progress (⏳ replacement)

## 🎨 Design System

All icons follow Pulsar's design principles:

- **Gradient**: Linear gradient from #4ac7ee (cyan) to #263b96 (deep blue)
- **Stroke Width**: Consistent 6-8px for main elements
- **View Box**: 200x200 for scalability
- **Corner Radius**: 6-8px for rounded elements
- **Opacity**: 0.2-0.7 for fills to maintain clarity

## 📖 Usage

### In HTML

```html
<img
  src="./packages/pulsar/art-kit/SVG/icon-reactivity.svg"
  width="48"
  height="48"
  alt="Reactivity"
/>
```

### In TSX/JSX

```tsx
import ReactivityIcon from './packages/pulsar/art-kit/SVG/icon-reactivity.svg';

function Feature() {
  return <img src={ReactivityIcon} alt="Fine-grained reactivity" />;
}
```

### As Component Icon

```tsx
// Use in component libraries
<Icon name="reactivity" size={24} />
```

## 🔧 Customization

Each SVG uses gradients defined in `<defs>` with unique IDs, allowing easy color customization:

```svg
<linearGradient id="customGradient" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" style="stop-color:#your-color" />
  <stop offset="100%" style="stop-color:#your-color" />
</linearGradient>
```

## 📁 File Naming Convention

- **Branding**: `pulsar-{variant}.svg`
- **Features**: `icon-{feature}.svg`
- **General**: `icon-{name}.svg`
- **States**: `icon-{element}-{state}.svg`

## 🚀 VS Code Integration

To use the Pulsar icon for `.tsx` files in VS Code:

1. Install a file icon theme extension (e.g., Material Icon Theme)
2. Configure in `.vscode/settings.json`:

```json
{
  "material-icon-theme.files.associations": {
    "*.pulsar.tsx": "../../packages/pulsar/art-kit/SVG/pulsar-icon"
  }
}
```

## 📊 Total Icons

**66 icons** across 9 categories, providing comprehensive visual language for Pulsar-based applications.
