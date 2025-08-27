# QuickCart File Architecture

## Overview
This document describes the reorganized file structure for the QuickCart application, following modern web development best practices with proper separation of concerns.

## Directory Structure

```
QuickCart app/
├── src/                     # Source code directory
│   ├── components/          # Reusable UI components
│   │   ├── navbar.css      # Navigation bar styles
│   │   ├── navbar.js       # Navigation bar functionality
│   │   ├── buttons.css     # Button component styles
│   │   └── cards.css       # Card component styles
│   │
│   ├── layouts/            # Layout-specific styles
│   │   ├── hero.css        # Hero section layout
│   │   └── sections.css    # General section layouts
│   │
│   ├── pages/              # Page-specific code
│   │   └── home.js         # Home page functionality
│   │
│   ├── styles/             # Global styles and design system
│   │   ├── main.css        # Main stylesheet (imports all others)
│   │   ├── variables.css   # CSS custom properties/variables
│   │   └── base.css        # Base styles and reset
│   │
│   └── utils/              # Utility functions and helpers
│       ├── auth.js         # Authentication management
│       ├── cart.js         # Shopping cart functionality
│       └── helpers.js      # General helper functions
│
├── assets/                 # Static assets
│   ├── images/            # Image files
│   ├── icons/             # Icon files
│   └── fonts/             # Custom fonts (if any)
│
├── docs/                  # Documentation
│   └── FILE_STRUCTURE.md  # This file
│
└── README.md              # Project documentation
```

## File Organization Principles

### 1. **Separation of Concerns**
- **Components**: Reusable UI elements with their own CSS and JS
- **Layouts**: Page structure and layout-specific styles
- **Utils**: Business logic and helper functions
- **Styles**: Global design system and base styles

### 2. **Modular Architecture**
- Each component is self-contained with its own styles and functionality
- JavaScript modules use ES6 imports/exports for better dependency management
- CSS is organized by component and layout responsibility

### 3. **Scalability**
- Easy to add new components, pages, or utilities
- Clear naming conventions and folder structure
- Modular CSS architecture prevents style conflicts

## CSS Architecture

### Import Structure (main.css)
```css
/* External dependencies */
@import url('fonts and icons');

/* Base system */
@import 'variables.css';    /* Design tokens */
@import 'base.css';         /* Reset and base styles */

/* Components */
@import '../components/navbar.css';
@import '../components/buttons.css';
@import '../components/cards.css';

/* Layouts */
@import '../layouts/hero.css';
@import '../layouts/sections.css';
```

### Design System (variables.css)
- Color palette with semantic naming
- Typography scale and font weights
- Spacing system using consistent units
- Border radius and shadow definitions
- Transition and animation values

## JavaScript Architecture

### Module System
- ES6 modules with import/export
- Class-based components for better organization
- Utility functions separated by concern
- Page-specific initialization files

### Component Structure
```javascript
// Example: navbar.js
export class Navbar {
    constructor() { /* initialization */ }
    init() { /* setup methods */ }
    setupMobileToggle() { /* specific functionality */ }
    // ... other methods
}
```

## Benefits of This Structure

1. **Maintainability**: Easy to find and modify specific functionality
2. **Reusability**: Components can be easily reused across pages
3. **Scalability**: Simple to add new features without affecting existing code
4. **Performance**: Modular loading and better caching strategies
5. **Developer Experience**: Clear organization improves development speed
6. **Team Collaboration**: Consistent structure helps team members navigate the codebase

## Usage Guidelines

### Adding New Components
1. Create CSS file in `src/components/`
2. Create JS file in `src/components/` (if needed)
3. Import CSS in `src/styles/main.css`
4. Import and use JS module in relevant pages

### Adding New Pages
1. Create JS file in `src/pages/`
2. Import necessary components and utilities
3. Initialize page-specific functionality

### Modifying Styles
1. Use CSS variables from `variables.css` for consistency
2. Add component-specific styles to appropriate component files
3. Use utility classes from `base.css` when possible

## Migration Notes

This structure replaces the previous flat organization where all HTML files were in the root directory with basic `css/` and `js/` folders. The new structure provides better organization, maintainability, and follows modern web development practices.
