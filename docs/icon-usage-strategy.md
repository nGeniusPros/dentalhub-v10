# Icon Usage Strategy

This document outlines the standardized approach to icon usage across the Dental Hub application to ensure visual consistency and improve maintainability.

## Core Principles

1. **Consistency**: Use the same icon style and source for similar actions and concepts
2. **Semantic Meaning**: Icons should clearly communicate their purpose
3. **Accessibility**: Icons should include proper text alternatives when used alone
4. **Performance**: Optimize icon delivery method based on usage context

## Implementation

The application uses a combination of:

1. **Lucide React** icons as the primary icon library
2. **Custom SVG icons** from the `/public/svg/` directory for specialized/branded elements

## Icon Component

We've created a unified `Icon` component in `src/components/ui/icon-strategy.tsx` that:

- Provides a consistent API for all icons
- Handles fallbacks if an icon isn't found
- Organizes icons into logical categories

```tsx
import { Icon, NavigationIcons } from '../components/ui/icon-strategy';

// Basic usage
<Icon name="LayoutDashboard" size={24} className="text-navy-default" />

// With categories for better code organization
<Icon name={NavigationIcons.Dashboard} size={24} className="text-navy-default" />
```

## Icon Categories

### Navigation Icons
- LayoutDashboard
- Brain
- FileCheck
- Users
- Calendar

### Chart & Analytics Icons
- BarChart
- trending.svg
- PieChart
- LineChart
- TrendingUp
- TrendingDown

### User Management Icons
- User
- user.svg
- user-info.svg
- UserPlus
- UserMinus
- Users

### Settings & Configuration Icons
- Settings
- edit.svg
- Sliders
- Tool
- Wrench

### Notification Icons
- Bell
- check-circle.svg
- AlertCircle
- AlertTriangle
- Info

### Document Handling Icons
- File
- FileText
- google-docs.svg
- FilePlus
- FileCheck
- Clipboard

### Action Icons
- Plus
- Minus
- X
- Check
- Search
- Filter
- ArrowUp
- ArrowDown
- ArrowLeft
- ArrowRight

### Finance Icons
- DollarSign
- Briefcase
- CreditCard
- Receipt
- Wallet

## Best Practices

1. **Consistent Sizing**:
   - Navigation icons: 24px
   - Button icons: 16-20px
   - Feature icons: 32-48px
   - Use the `size` prop to maintain consistency

2. **Color Usage**:
   - Icon colors should follow the application color system
   - Use the `className` prop with Tailwind classes for consistent coloring
   - Example: `className="text-navy-default hover:text-navy-light"`

3. **Accessibility**:
   - Always provide appropriate alt text when icons are used alone
   - Combine icons with text labels when possible
   - Use `aria-label` when an icon button has no visible text

4. **Icon + Text Combinations**:
   - Maintain consistent spacing between icons and text
   - For left-aligned icons: `<Icon className="mr-2" />`
   - For right-aligned icons: `<Icon className="ml-2" />`

## Icon Showcase

A visual showcase of all available icons is available at the `/icon-strategy` route within the application, providing a quick reference for developers.
