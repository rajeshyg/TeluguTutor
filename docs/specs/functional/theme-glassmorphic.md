---
title: Theme Glassmorphic Functional Spec
created: 2025-11-29
status: draft
version: 1.0
---

# Theme Glassmorphic Spec

## Description

The glassmorphic theme feature implements a modern, visually appealing design system for TeluguTutor. It provides consistent theming across all components with support for light and dark modes, using glass-like translucent surfaces, subtle gradients, and smooth animations. The theme system uses CSS custom properties for runtime switching and integrates with Tailwind CSS for utility-first styling.

### Purpose
- Create a cohesive, modern visual identity for TeluguTutor
- Support both light and dark mode preferences
- Ensure accessibility while maintaining aesthetic appeal
- Enable easy theme customization and maintenance

## Requirements

### Functional

#### Theme Context
- **F-TG-001**: System SHALL provide ThemeProvider context wrapping the application
- **F-TG-002**: Theme state SHALL include:
  - `isDark`: boolean indicating current mode
  - `toggleDarkMode`: function to switch modes

- **F-TG-003**: System SHALL persist theme preference in localStorage:
  - Key: `theme`
  - Values: `dark` | `light`

- **F-TG-004**: System SHALL respect system preference when no saved preference exists:
  - Use `window.matchMedia('(prefers-color-scheme: dark)')`

- **F-TG-005**: Theme changes SHALL:
  - Toggle `dark` class on `<html>` element
  - Update localStorage immediately
  - Apply without page reload

#### Theme Toggle Component
- **F-TG-006**: ThemeToggle SHALL display:
  - Moon icon in light mode
  - Sun icon in dark mode

- **F-TG-007**: ThemeToggle SHALL be a ghost button with icon-only styling
- **F-TG-008**: ThemeToggle SHALL be accessible via keyboard

#### Color Palette - Light Mode
- **F-TG-009**: Light mode SHALL use these base colors:
  ```css
  --background: 0 0% 100%;           /* white */
  --foreground: 222.2 84% 4.9%;     /* near-black */
  --card: 0 0% 100%;                 /* white */
  --primary: 222.2 47.4% 11.2%;     /* dark blue */
  --secondary: 210 40% 96.1%;       /* light blue-gray */
  --muted: 210 40% 96.1%;           /* light gray */
  --accent: 210 40% 96.1%;          /* light blue-gray */
  --destructive: 0 84.2% 60.2%;     /* red */
  --border: 214.3 31.8% 91.4%;      /* light gray */
  ```

#### Color Palette - Dark Mode  
- **F-TG-010**: Dark mode SHALL use these base colors:
  ```css
  --background: 222.2 84% 4.9%;     /* near-black */
  --foreground: 210 40% 98%;        /* near-white */
  --card: 222.2 84% 4.9%;           /* near-black */
  --primary: 210 40% 98%;           /* near-white */
  --secondary: 217.2 32.6% 17.5%;   /* dark blue-gray */
  --muted: 217.2 32.6% 17.5%;       /* dark gray */
  --accent: 217.2 32.6% 17.5%;      /* dark blue-gray */
  --destructive: 0 62.8% 30.6%;     /* dark red */
  --border: 217.2 32.6% 17.5%;      /* dark gray */
  ```

#### Glassmorphic Design Elements
- **F-TG-011**: Glass surfaces SHALL use:
  - Semi-transparent backgrounds (`bg-white/80`, `bg-slate-800/80`)
  - Backdrop blur effect (`backdrop-blur-sm` to `backdrop-blur-xl`)
  - Subtle borders (`border border-white/20`)
  - Soft shadows (`shadow-lg`, `shadow-xl`)

- **F-TG-012**: Gradient backgrounds SHALL include:
  - Page backgrounds: `from-{color}-50 via-{color}-50 to-{color}-50`
  - Dark mode: `from-slate-900 via-{color}-900/20 to-slate-900`
  - Accent gradients: `from-{color}-500 to-{color}-500`

- **F-TG-013**: Interactive elements SHALL have:
  - Hover states with scale or color change
  - Focus rings for accessibility
  - Smooth transitions (200-300ms)

#### Component Styling Standards
- **F-TG-014**: Cards SHALL use:
  - Rounded corners: `rounded-xl` or `rounded-2xl`
  - Background: solid or glassmorphic depending on context
  - Border: subtle in light mode, visible in dark mode
  - Shadow: `shadow-sm` to `shadow-lg`

- **F-TG-015**: Buttons SHALL follow shadcn/ui variants:
  - Default: primary colors
  - Ghost: transparent with hover state
  - Outline: border only
  - Destructive: red tones

- **F-TG-016**: Typography SHALL use:
  - Font family: Inter (body), Noto Sans Telugu (glyphs)
  - Headings: `font-bold` with appropriate size scaling
  - Body: `text-gray-600 dark:text-gray-300`
  - Muted: `text-gray-500 dark:text-gray-400`

### Non-Functional

#### Performance
- **NF-TG-001**: Theme switch SHALL be instant (<50ms visual change)
- **NF-TG-002**: Backdrop blur SHALL not cause jank on mobile devices
- **NF-TG-003**: CSS custom properties SHALL be used for runtime theming

#### User Experience
- **NF-TG-004**: Theme SHALL persist across sessions
- **NF-TG-005**: Initial render SHALL not flash wrong theme
- **NF-TG-006**: Transitions between theme states SHALL be smooth

#### Accessibility
- **NF-TG-007**: Color contrast ratios SHALL meet WCAG 2.1 AA:
  - Normal text: 4.5:1 minimum
  - Large text: 3:1 minimum
  - Interactive elements: 3:1 minimum

- **NF-TG-008**: Dark mode SHALL not be pure black (use `slate-900`)
- **NF-TG-009**: Focus states SHALL be visible in both modes

## Data Model

### Theme Context Interface
```typescript
interface ThemeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
}
```

### Theme Storage
```typescript
// localStorage key: 'theme'
type ThemeValue = 'dark' | 'light';
```

## Components

### Context Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `ThemeProvider` | `src/contexts/ThemeContext.tsx` | Provides theme state to app |
| `useTheme` | `src/contexts/ThemeContext.tsx` | Hook to access theme state |

### UI Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `ThemeToggle` | `src/components/ThemeToggle.jsx` | Toggle button for theme switch |

### shadcn/ui Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `Button` | `src/components/ui/button.jsx` | Styled buttons with variants |
| `Card` | `src/components/ui/card.jsx` | Container component |
| `Tabs` | `src/components/ui/tabs.jsx` | Tab navigation |

## CSS Architecture

### Tailwind Configuration
```javascript
// tailwind.config.js
export default {
  darkMode: 'class',  // Use class-based dark mode
  theme: {
    extend: {
      colors: {
        // CSS variable references
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... etc
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
};
```

### CSS Custom Properties
```css
/* src/index.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --radius: 0.5rem;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

### Glassmorphic Utilities
```css
/* Recommended utility classes */
.glass {
  @apply bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm;
}

.glass-strong {
  @apply bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl;
}

.gradient-bg {
  @apply bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 
         dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900;
}
```

## User Flows

### Primary: Toggle Theme
1. User views page in current theme
2. User clicks ThemeToggle button
3. System toggles `dark` class on `<html>`
4. System saves preference to localStorage
5. All components instantly reflect new theme

### Secondary: Initial Load with Saved Preference
1. App initializes ThemeProvider
2. System checks localStorage for saved theme
3. If found, apply saved preference
4. If not found, check system preference
5. Apply determined theme before first render

### Tertiary: System Preference Change
1. User changes OS theme preference
2. On next app load, system detects new preference
3. If no saved preference, use system preference
4. Theme applied accordingly

## Visual Design Guidelines

### Page Backgrounds
- Light: Gradient from purple/pink/blue at low opacity
- Dark: Slate with subtle colored overlays

### Card Styling
```jsx
// Light mode
className="bg-white border border-gray-100 shadow-sm rounded-xl"

// Dark mode (automatic via Tailwind)
className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm rounded-xl"

// Glassmorphic
className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-xl"
```

### Button States
```jsx
// Primary
className="bg-primary text-primary-foreground hover:bg-primary/90"

// Ghost
className="hover:bg-accent hover:text-accent-foreground"

// Dark mode aware
className="dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
```

### Status Colors
| Status | Light Mode | Dark Mode |
|--------|------------|-----------|
| Success | green-500/600 | green-400/500 |
| Warning | yellow-500/600 | yellow-400/500 |
| Error | red-500/600 | red-400/500 |
| Info | blue-500/600 | blue-400/500 |

## Testing Strategy

### Unit Tests
- ThemeProvider initial state from localStorage
- ThemeProvider initial state from system preference
- toggleDarkMode function behavior
- Theme persistence to localStorage

### E2E Tests
- Theme toggle changes visual appearance
- Theme persists after page reload
- System preference respected when no saved preference
- All pages render correctly in both themes
- Focus states visible in both themes

### Visual Regression Tests
- Screenshot comparison for light mode
- Screenshot comparison for dark mode
- Component states in both themes

## Migration Checklist

### Components to Update
- [ ] Layout.jsx - use theme context
- [ ] ThemeToggle.jsx - integrate with ThemeContext
- [ ] Home.jsx - dark mode classes
- [ ] Learn.jsx - dark mode classes
- [ ] Progress.jsx - dark mode classes
- [ ] MicroPractice.jsx - dark mode classes
- [ ] All puzzle components - dark mode support
- [ ] All UI components - theme variable usage

### Refactoring Steps
1. Integrate ThemeProvider in main.jsx
2. Replace ThemeToggle local state with useTheme hook
3. Audit all hardcoded colors in components
4. Replace with theme-aware alternatives
5. Test both modes thoroughly

## Dependencies

- Tailwind CSS 3.x with dark mode support
- React Context API
- localStorage for persistence
- CSS custom properties (browser support: 95%+)

## Open Questions

1. Should there be additional theme variants (e.g., high contrast)?
2. Should glassmorphic effects be optional for performance?
3. Should theme toggle include system preference option?
4. Should animation intensity be theme-specific?

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-29 | Initial draft based on existing implementation |
