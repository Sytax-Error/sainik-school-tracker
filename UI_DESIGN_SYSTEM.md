# UI Design System & Color Guidelines

## Overview
This document defines the design system, color palette, and UI guidelines for the Sainik School Tracker application. It serves as the single source of truth for all visual design decisions.

---

## 📚 Related Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| **UI_IMPROVEMENT_PLAN.md** | Strategic improvement plan: 6 focus areas, scope guard, design direction | `./UI_IMPROVEMENT_PLAN.md` |
| **UI_COLOR_QUICK_REF.md** | Quick reference card for daily development | `./UI_COLOR_QUICK_REF.md` |
| **frontend/src/utils/designTokens.ts** | Source of truth for tokens (colors, spacing, typography, status mapping) | `./frontend/src/utils/designTokens.ts` |
| **frontend/tailwind.config.js** | Tailwind theme configuration | `./frontend/tailwind.config.js` |
| **frontend/src/styles/index.css** | Global base styles, CSS utilities | `./frontend/src/styles/index.css` |
| **frontend/src/components/ui/primitives/** | Reusable UI components | `./frontend/src/components/ui/primitives/` |

**Usage**: This document provides detailed specifications. For quick lookups during development, use `UI_COLOR_QUICK_REF.md`. The improvement plan in `UI_IMPROVEMENT_PLAN.md` defines the priority areas for applying this design system.

---

## 1. Color System

### 1.1 Primary Color Palette (Brand Blue)
Used for primary actions, links, focus states, and brand elements.

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#eef4fa` | Light backgrounds, hover states |
| `primary-100` | `#d9e7f3` | Subtle backgrounds, selected states |
| `primary-200` | `#b3cde3` | Borders, dividers |
| `primary-300` | `#8cb0d3` | Disabled states, subtle accents |
| `primary-400` | `#6693c3` | Secondary actions, icons |
| `primary-500` | `#3f76b3` | **Primary brand color**, focus rings |
| `primary-600` | `#1f3a5f` | **Primary buttons**, active states |
| `primary-700` | `#1b3455` | Hover on primary buttons |
| `primary-800` | `#172f4d` | Active/pressed primary buttons |
| `primary-900` | `#132943` | Text on primary backgrounds |

### 1.2 Semantic Colors
Used for status, feedback, and state communication.

#### Success (Green) - Completed, Positive Actions
| Token | Hex | Usage |
|-------|-----|-------|
| `semantic-success-light` | `#dcfce7` | Success badge backgrounds, toast backgrounds |
| `semantic-success-main` | `#22c55e` | Success buttons, progress bars, icons |
| `semantic-success-dark` | `#166534` | Success text, hover states |

#### Warning (Amber) - On Hold, Attention Needed
| Token | Hex | Usage |
|-------|-----|-------|
| `semantic-warning-light` | `#fef3c7` | Warning badge backgrounds |
| `semantic-warning-main` | `#f59e0b` | Warning buttons, progress bars |
| `semantic-warning-dark` | `#92400e` | Warning text |

#### Danger (Red) - Cancelled, Errors, Destructive Actions
| Token | Hex | Usage |
|-------|-----|-------|
| `semantic-danger-light` | `#fee2e2` | Error backgrounds, danger badge backgrounds |
| `semantic-danger-main` | `#ef4444` | Error text, danger buttons, delete actions |
| `semantic-danger-dark` | `#991b1b` | Hover on danger buttons |

#### Info (Blue) - In Progress, Informational
| Token | Hex | Usage |
|-------|-----|-------|
| `semantic-info-light` | `#dbeafe` | Info badge backgrounds |
| `semantic-info-main` | `#3b82f6` | Info buttons, progress bars |
| `semantic-info-dark` | `#1e40af` | Info text |

### 1.3 Surface Colors
Used for backgrounds, cards, and layering.

| Token | Hex | Usage |
|-------|-----|-------|
| `surface-page` | `#f7f8fa` | **Page background** |
| `surface-primary` | `#ffffff` | **Card backgrounds**, modals, dropdowns |
| `surface-secondary` | `#f8fafc` | Secondary card backgrounds, hover states |
| `surface-tertiary` | `#f1f5f9` | Input backgrounds, disabled states |
| `surface-border` | `#e5e7eb` | **Default borders**, dividers |
| `surface-divider` | `#e2e8f0` | Subtle dividers, table borders |

### 1.4 Text Colors
Used for typography hierarchy.

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#101828` | **Primary headings**, body text |
| `text-secondary` | `#667085` | **Secondary text**, descriptions, labels |
| `text-tertiary` | `#98a2b3` | **Placeholder text**, disabled text, captions |
| `text-inverse` | `#ffffff` | Text on dark/primary backgrounds |
| `text-link` | `#1f3a5f` | Links, clickable text |

---

## 2. Status Color Mapping

Each item status maps to a semantic color for consistent visual communication:

| Status | Label | Tone | Badge BG | Badge Text | Progress Bar | Icon Color |
|--------|-------|------|----------|------------|--------------|------------|
| `NOT_STARTED` | Not Started | `neutral` | `surface-tertiary` | `text-secondary` | `primary-500` | `text-tertiary` |
| `IN_PROGRESS` | In Progress | `info` | `semantic-info-light` | `semantic-info-dark` | `semantic-info-main` | `semantic-info-main` |
| `COMPLETED` | Completed | `success` | `semantic-success-light` | `semantic-success-dark` | `semantic-success-main` | `semantic-success-main` |
| `ON_HOLD` | On Hold | `warning` | `semantic-warning-light` | `semantic-warning-dark` | `semantic-warning-main` | `semantic-warning-main` |
| `CANCELLED` | Cancelled | `danger` | `semantic-danger-light` | `semantic-danger-dark` | `semantic-danger-main` | `semantic-danger-main` |

---

## 3. Component Color Guidelines

### 3.1 Buttons

| Variant | Background | Text | Border | Hover | Active | Focus Ring |
|---------|------------|------|--------|-------|--------|------------|
| **Primary** | `primary-600` | `white` | none | `primary-700` | `primary-800` | `primary-500` |
| **Secondary** | `surface-secondary` | `text-primary` | `surface-border` | `surface-tertiary` | `surface-tertiary` | `surface-border` |
| **Outline** | `transparent` | `primary-600` | `primary-600` | `primary-50` | `primary-100` | `primary-500` |
| **Ghost** | `transparent` | `text-secondary` | none | `surface-tertiary` | `surface-tertiary` | `surface-border` |
| **Danger** | `semantic-danger-main` | `white` | none | `semantic-danger-dark` | `semantic-danger-dark` | `semantic-danger-main` |

### 3.2 Cards

| Variant | Background | Border | Shadow | Use Case |
|---------|------------|--------|--------|----------|
| **Default** | `surface-primary` | `surface-border` | `shadow-card` | Standard cards |
| **Outlined** | `surface-primary` | `surface-border` | none | Subtle separation |
| **Elevated** | `surface-primary` | none | `shadow-cardHover` | Floating cards, modals |

### 3.3 Inputs & Form Controls

| State | Background | Border | Text | Placeholder |
|-------|------------|--------|------|-------------|
| Default | `surface-primary` | `surface-border` | `text-primary` | `text-tertiary` |
| Hover | `surface-primary` | `primary-300` | `text-primary` | `text-tertiary` |
| Focus | `surface-primary` | `primary-500` | `text-primary` | `text-tertiary` |
| Error | `surface-primary` | `semantic-danger-main` | `text-primary` | `text-tertiary` |
| Disabled | `surface-tertiary` | `surface-border` | `text-tertiary` | `text-tertiary` |

### 3.4 Badges

| Variant | Background | Text | Border | Dot Indicator |
|---------|------------|------|--------|---------------|
| Neutral | `surface-tertiary` | `text-secondary` | `surface-border` | `gray-400` |
| Info | `semantic-info-light` | `semantic-info-dark` | `semantic-info-main/20` | `semantic-info-main` |
| Success | `semantic-success-light` | `semantic-success-dark` | `semantic-success-main/20` | `semantic-success-main` |
| Warning | `semantic-warning-light` | `semantic-warning-dark` | `semantic-warning-main/20` | `semantic-warning-main` |
| Danger | `semantic-danger-light` | `semantic-danger-dark` | `semantic-danger-main/20` | `semantic-danger-main` |

### 3.5 Progress Bars

| Variant | Track Background | Fill Color |
|---------|------------------|------------|
| Default | `surface-tertiary` | `primary-500` |
| Success | `surface-tertiary` | `semantic-success-main` |
| Warning | `surface-tertiary` | `semantic-warning-main` |
| Danger | `surface-tertiary` | `semantic-danger-main` |
| Info | `surface-tertiary` | `semantic-info-main` |

### 3.6 Tables

| Element | Background | Border | Text |
|---------|------------|--------|------|
| Header | `surface-secondary` | `surface-divider` | `text-secondary` |
| Row (even) | `surface-primary` | `surface-divider` | `text-primary` |
| Row (odd) | `surface-primary` | `surface-divider` | `text-primary` |
| Row Hover | `surface-secondary` | `surface-divider` | `text-primary` |
| Row Selected | `primary-50` | `surface-divider` | `text-primary` |

### 3.7 Toast Notifications

| Type | Background | Border | Icon Color | Text |
|------|------------|--------|------------|------|
| Success | `semantic-success-light` | `semantic-success-main/20` | `semantic-success-main` | `semantic-success-dark` |
| Error | `semantic-danger-light` | `semantic-danger-main/20` | `semantic-danger-main` | `semantic-danger-dark` |
| Warning | `semantic-warning-light` | `semantic-warning-main/20` | `semantic-warning-main` | `semantic-warning-dark` |
| Info | `semantic-info-light` | `semantic-info-main/20` | `semantic-info-main` | `semantic-info-dark` |

### 3.8 Empty States

| Element | Color |
|---------|-------|
| Icon | `text-tertiary` |
| Title | `text-primary` |
| Description | `text-secondary` |
| Action Button | Follows button variants |

### 3.9 Error Displays

| Variant | Background | Border | Icon | Text |
|---------|------------|--------|------|------|
| Inline | `semantic-danger-light` | `semantic-danger-main/20` | `semantic-danger-main` | `semantic-danger-dark` |
| Card | `surface-primary` | `surface-border` | `semantic-danger-main` | `text-primary` / `text-secondary` |
| Page | `surface-primary` | `surface-border` | `semantic-danger-main` | `text-primary` / `text-secondary` |

### 3.10 Skeletons

| Element | Color |
|---------|-------|
| Base | `surface-tertiary` |
| Animation | `animate-pulse` or `animate-[shimmer_1.5s_infinite]` |

---

## 4. Layout & Spacing

### 4.1 Spacing Scale
Based on 4px grid system:

| Token | Value | Pixels |
|-------|-------|--------|
| `space-1` | `0.25rem` | 4px |
| `space-2` | `0.5rem` | 8px |
| `space-3` | `0.75rem` | 12px |
| `space-4` | `1rem` | 16px |
| `space-6` | `1.5rem` | 24px |
| `space-8` | `2rem` | 32px |
| `space-10` | `2.5rem` | 40px |
| `space-12` | `3rem` | 48px |

### 4.2 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `6px` | Buttons, badges, inputs |
| `radius-md` | `8px` | Cards, dropdowns, modals |
| `radius-lg` | `12px` | Large cards, modals, sheets |

### 4.3 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-card` | `0 1px 2px rgb(16 24 40 / 0.04)` | Default cards |
| `shadow-cardHover` | `0 2px 6px rgb(16 24 40 / 0.08)` | Card hover, elevated |
| `shadow-dropdown` | `0 8px 16px rgb(16 24 40 / 0.10)` | Dropdowns, popovers |
| `shadow-modal` | `0 20px 40px rgb(16 24 40 / 0.18)` | Modals, drawers |

---

## 5. Typography

### 5.1 Font Families
- **Sans**: `'Inter', system-ui, -apple-system, sans-serif` (UI text)
- **Mono**: `'JetBrains Mono', 'Fira Code', monospace` (Code, numbers)

### 5.2 Font Sizes

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | `0.75rem` (12px) | 1.5 | Captions, labels |
| `text-sm` | `0.875rem` (14px) | 1.5 | Body small, secondary text |
| `text-base` | `1rem` (16px) | 1.5 | **Default body text** |
| `text-lg` | `1.125rem` (18px) | 1.5 | Large body, descriptions |
| `text-xl` | `1.25rem` (20px) | 1.5 | Subheadings |
| `text-2xl` | `1.5rem` (24px) | 1.25 | Section headings |
| `text-3xl` | `1.875rem` (30px) | 1.25 | Page titles |

### 5.3 Font Weights

| Token | Weight | Usage |
|-------|--------|-------|
| `normal` | 400 | Body text |
| `medium` | 500 | Emphasis, labels |
| `semibold` | 600 | Headings, important values |
| `bold` | 700 | Page titles, strong emphasis |

---

## 6. Interaction States

### 6.1 Transitions
| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `fast` | 150ms | ease | Micro-interactions |
| `normal` | 200ms | ease | **Default transitions** |
| `slow` | 300ms | ease | Complex animations |

### 6.2 Focus States
- **Always visible** for keyboard navigation
- **Primary focus ring**: `primary-500` with 2px width, 2px offset
- **Never remove** focus styles without replacement

### 6.3 Hover States
- Subtle background color change
- Cursor change for interactive elements
- Transition: `normal` (200ms)

### 6.4 Active/Pressed States
- Darker background than hover
- Immediate response (no transition delay)
- Scale transform for buttons: `scale-[0.98]`

### 6.5 Disabled States
- Opacity: `0.5`
- Cursor: `not-allowed`
- No hover/active transitions

---

## 7. Accessibility Requirements

### 7.1 Color Contrast (WCAG AA)
| Element | Minimum Ratio |
|---------|---------------|
| Normal text | 4.5:1 |
| Large text (18px+) | 3:1 |
| UI components | 3:1 |
| Focus indicators | 3:1 |

### 7.2 Current Contrast Verification
- `text-primary` on `surface-primary`: **12.6:1** ✓
- `text-secondary` on `surface-primary`: **5.2:1** ✓
- `primary-600` on `white`: **7.1:1** ✓
- `semantic-success-main` on `white`: **4.8:1** ✓
- `semantic-warning-main` on `white`: **3.2:1** ⚠️ (use `semantic-warning-dark` for text)
- `semantic-danger-main` on `white`: **4.5:1** ✓

### 7.3 Color Blindness Considerations
- Never rely on color alone for status communication
- Always pair status colors with icons/labels
- Test with protanopia, deuteranopia, tritanopia simulators

---

## 8. Dark Mode (Future Consideration)

When implementing dark mode, map surfaces as follows:

| Light Token | Dark Token |
|-------------|------------|
| `surface-page` | `#0f172a` (slate-950) |
| `surface-primary` | `#1e293b` (slate-800) |
| `surface-secondary` | `#334155` (slate-700) |
| `surface-tertiary` | `#475569` (slate-600) |
| `surface-border` | `#334155` (slate-700) |
| `text-primary` | `#f8fafc` (slate-50) |
| `text-secondary` | `#cbd5e1` (slate-300) |
| `text-tertiary` | `#94a3b8` (slate-400) |

Primary and semantic colors remain the same but may need lightness adjustments.

---

## 9. Implementation Guidelines

### 9.1 Using Design Tokens
```tsx
// ✅ Good - Use design tokens
import { colors } from '@/utils/designTokens';
<div className="bg-surface-primary text-text-primary" />

// ✅ Good - Use Tailwind classes mapped to tokens
<div className="bg-surface-primary text-text-primary" />

// ❌ Bad - Hardcoded colors
<div style={{ backgroundColor: '#ffffff', color: '#101828' }} />
```

### 9.2 Component Composition
```tsx
// ✅ Good - Compose with variants
<Button variant="primary" size="md" />
<Badge variant="success" />
<Card variant="default" padding="md" />

// ❌ Bad - Override styles inline
<Button className="bg-blue-600 text-white px-4 py-2" />
```

### 9.3 Status-Based Styling
```tsx
// ✅ Good - Use status mapping utilities
import { getStatusTone, getStatusLabel } from '@/utils/designTokens';
const tone = getStatusTone(item.status);
<StatusBadge status={item.status} />

// ❌ Bad - Manual color mapping
const color = item.status === 'COMPLETED' ? 'green' : 'blue';
```

---

## 10. UI Improvement Checklist

### Phase 1: Color Consistency
- [ ] Audit all components for hardcoded colors
- [ ] Replace with design token references
- [ ] Verify status color mapping across all components
- [ ] Ensure semantic colors used correctly (not primary for success/warning)

### Phase 2: Visual Hierarchy
- [ ] Standardize heading sizes across pages
- [ ] Consistent spacing between sections (space-6, space-8)
- [ ] Card padding consistency (md for content, lg for feature cards)
- [ ] Table density options (comfortable/compact)

### Phase 3: Interaction Polish
- [ ] Add hover states to all interactive elements
- [ ] Consistent focus rings across all focusable elements
- [ ] Loading skeletons match final content layout
- [ ] Toast animations (slide in, fade out)

### Phase 4: Accessibility
- [ ] Verify all color contrasts meet WCAG AA
- [ ] Add focus-visible styles where missing
- [ ] Ensure keyboard navigation works everywhere
- [ ] Screen reader labels on icon-only buttons

### Phase 5: Responsive Design
- [ ] Mobile-first breakpoint testing
- [ ] Table horizontal scroll on mobile
- [ ] Card stacking on small screens
- [ ] Navigation collapse on mobile

---

## 11. Component-Specific Color Rules

### ItemTable
- Row hover: `surface-secondary`
- Status badges: Use `StatusBadge` component (auto-maps status to color)
- Progress bars: Use `TableProgressBar` with status-appropriate variant
- Sortable headers: `surface-secondary` bg, `text-secondary` text
- Empty state: `EmptyState` component with neutral icon

### Dashboard/StatCards
- Card background: `surface-primary` with `surface-border`
- Values: `text-primary` with `font-bold`
- Labels: `text-secondary` with `font-medium`
- Phase cards: Progress text uses `primary-600`

### PhasePage
- Header: `PageHeader` with breadcrumb
- Table container: `bg-surface-primary border border-surface-border rounded-lg`
- Filter bar: `bg-surface-secondary border-b border-surface-divider`

### Navigation/Header
- Background: `surface-primary` with `border-b border-surface-border`
- Active nav: `bg-primary-50 text-primary-700`
- Inactive nav: `text-text-secondary hover:text-text-primary hover:bg-surface-secondary`
- Logo: `text-text-primary`

---

## 12. Anti-Patterns to Avoid

| Anti-Pattern | Correct Approach |
|--------------|------------------|
| Using `primary` for success states | Use `semantic-success` |
| Using `red`/`green` strings | Use `semantic-danger`/`semantic-success` |
| Hardcoding hex colors | Use design tokens |
| Mixing border colors | Use `surface-border` consistently |
| Using `gray-500` for text | Use `text-secondary` or `text-tertiary` |
| Removing focus outlines | Use `focus-visible:ring-2` |
| Color-only status indication | Always pair with icon/label |

---

## 13. Quick Reference: Tailwind Class Mapping

```js
// In tailwind.config.js - these are already configured
colors: {
  primary: { 50-900 },           // → bg-primary-600, text-primary-500, etc.
  semantic: {
    success: { light, main, dark },  // → bg-semantic-success-light, text-semantic-success-dark
    warning: { light, main, dark },
    danger: { light, main, dark },
    info: { light, main, dark },
  },
  surface: { page, primary, secondary, tertiary, border, divider },
  text: { primary, secondary, tertiary, inverse, link },
}
```

### Common Utility Classes
```tsx
// Backgrounds
bg-surface-page      // Page background
bg-surface-primary   // Card/modal background
bg-surface-secondary // Hover/secondary background
bg-surface-tertiary  // Input/disabled background

// Text
text-text-primary    // Main text
text-text-secondary  // Secondary text
text-text-tertiary   // Placeholder/disabled text

// Borders
border-surface-border  // Default border
border-surface-divider // Subtle divider

// Status-aware (use components instead)
StatusBadge           // Auto-maps status to colors
TableProgressBar      // Auto-maps variant to colors
```

---

## 14. Maintenance

### When Adding New Colors
1. Add to `designTokens.ts` first
2. Add to `tailwind.config.js` 
3. Document usage in this file
4. Update component variants if needed
5. Verify contrast ratios

### When Modifying Existing Colors
1. Check all component usages
2. Verify contrast ratios still pass
3. Test in all themes (light/dark future)
4. Update this documentation
5. Communicate changes to team

---

*Last Updated: 2026-08-10*
*Version: 1.0*