# Quick Color Reference Card

## 📚 Related Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| **UI_DESIGN_SYSTEM.md** | Complete design system with detailed specifications | `./UI_DESIGN_SYSTEM.md` |
| **UI_IMPROVEMENT_PLAN.md** | Strategic improvement plan (6 focus areas) | `./UI_IMPROVEMENT_PLAN.md` |
| **frontend/src/utils/designTokens.ts** | Source of truth for all tokens | `./frontend/src/utils/designTokens.ts` |
| **frontend/tailwind.config.js** | Tailwind theme config | `./frontend/tailwind.config.js` |

---

## Most Used Tailwind Classes

### Backgrounds
```tsx
bg-surface-page        // Page bg (#f7f8fa)
bg-surface-primary     // Card bg (#ffffff)
bg-surface-secondary   // Hover bg (#f8fafc)
bg-surface-tertiary    // Input bg (#f1f5f9)
bg-primary-50          // Selected row (#eef4fa)
bg-primary-100         // Light accent (#d9e7f3)
```

### Text
```tsx
text-text-primary      // Main text (#101828)
text-text-secondary    // Labels/desc (#667085)
text-text-tertiary     // Placeholder (#98a2b3)
text-primary-600       // Links/primary (#1f3a5f)
text-white             // On dark bg
```

### Borders
```tsx
border-surface-border  // Default (#e5e7eb)
border-surface-divider // Subtle (#e2e8f0)
border-primary-200     // Primary accent
```

### Status Colors (Use Components Instead!)
```tsx
// Badge variants
<Badge variant="neutral" />  // NOT_STARTED
<Badge variant="info" />     // IN_PROGRESS
<Badge variant="success" />  // COMPLETED
<Badge variant="warning" />  // ON_HOLD
<Badge variant="danger" />   // CANCELLED

// Progress bars
<TableProgressBar variant="default" />   // NOT_STARTED
<TableProgressBar variant="info" />      // IN_PROGRESS
<TableProgressBar variant="success" />   // COMPLETED
<TableProgressBar variant="warning" />   // ON_HOLD
<TableProgressBar variant="danger" />    // CANCELLED

// Status badge (auto-maps)
<StatusBadge status={item.status} />
```

### Buttons
```tsx
<Button variant="primary" />    // Main actions
<Button variant="secondary" />  // Secondary actions
<Button variant="outline" />    // Subtle actions
<Button variant="ghost" />      // Minimal actions
<Button variant="danger" />     // Destructive actions
```

### Cards
```tsx
<Card variant="default" />   // Standard (border + shadow)
<Card variant="outlined" />  // Border only
<Card variant="elevated" />  // Shadow only (floating)
```

### Focus Rings (Automatic)
```tsx
// All interactive elements get:
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-offset-2
focus-visible:ring-primary-500  // Primary color ring
```

---

## Status → Color Mapping

| Status | Badge | Progress | Text Color |
|--------|-------|----------|------------|
| NOT_STARTED | `neutral` (gray) | `default` (blue) | `text-secondary` |
| IN_PROGRESS | `info` (blue) | `info` (blue) | `semantic-info-dark` |
| COMPLETED | `success` (green) | `success` (green) | `semantic-success-dark` |
| ON_HOLD | `warning` (amber) | `warning` (amber) | `semantic-warning-dark` |
| CANCELLED | `danger` (red) | `danger` (red) | `semantic-danger-dark` |

---

## Spacing Quick Ref

| Class | Value | Use For |
|-------|-------|---------|
| `p-4` / `gap-4` | 16px | Card padding, gaps |
| `p-6` | 24px | Section padding |
| `space-y-6` | 24px | Vertical stack |
| `space-y-8` | 32px | Section gaps |
| `gap-2` | 8px | Inline gaps |
| `gap-3` | 12px | Form gaps |

---

## Border Radius

| Class | Value | Use For |
|-------|-------|---------|
| `rounded` / `rounded-md` | 8px | Cards, inputs, buttons |
| `rounded-lg` | 12px | Large cards, modals |
| `rounded-full` | 9999px | Badges, pills, avatars |

---

## Shadows

| Class | Use For |
|-------|---------|
| `shadow-card` | Default cards |
| `shadow-cardHover` | Hover elevation |
| `shadow-dropdown` | Dropdowns, popovers |
| `shadow-modal` | Modals, drawers |

---

## Common Patterns

### Page Layout
```tsx
<div className="min-h-screen bg-surface-page">
  <header className="bg-surface-primary border-b border-surface-border sticky top-0 z-sticky">
    {/* Header content */}
  </header>
  <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
    {/* Page content */}
  </main>
</div>
```

### Card with Header
```tsx
<Card variant="default" padding="md">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Table Container
```tsx
<div className="overflow-x-auto rounded-lg border border-surface-border bg-surface-primary">
  <table className="w-full text-sm">
    <thead className="bg-surface-secondary border-b border-surface-divider">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
          Column
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-surface-divider">
      {/* Rows */}
    </tbody>
  </table>
</div>
```

### Form Input
```tsx
<Input
  className="bg-surface-primary border-surface-border
             focus:border-primary-500 focus:ring-primary-500
             disabled:bg-surface-tertiary"
  placeholder="Placeholder text"
/>
```

### Empty State
```tsx
<EmptyState
  title="No items found"
  description="Get started by creating your first item."
  action={{ label: "Create Item", onClick: handleCreate }}
/>
```

### Error Display
```tsx
// Inline (forms)
<InlineError message="This field is required" />

// Card (section errors)
<ErrorDisplay
  variant="card"
  title="Failed to load"
  message="Please try again later"
  onRetry={handleRetry}
/>

// Page (full page errors)
<ErrorDisplay
  variant="page"
  title="Something went wrong"
  message="We couldn't load the dashboard"
  onRetry={handleRetry}
/>
```

---

## Don't Do This ❌

```tsx
// Hardcoded colors
<div className="bg-white text-gray-900 border-gray-200" />
<div style={{ backgroundColor: '#3f76b3' }} />
className="bg-green-500 text-white"  // For success
className="bg-red-500 text-white"    // For danger
className="bg-blue-500"              // For in-progress

// Removing focus styles
className="focus:outline-none"  // Without replacement

// Color-only status
<span className="text-green-600">Completed</span>
```

---

## Do This ✅

```tsx
// Design tokens via Tailwind
<div className="bg-surface-primary text-text-primary border-surface-border" />

// Semantic components
<Badge variant="success">Completed</Badge>
<StatusBadge status="COMPLETED" />
<TableProgressBar variant="success" value={100} />

// Proper focus
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"

// Status with label + color
<StatusBadge status="COMPLETED" showLabel />
```

---

## File Locations

| File | Purpose |
|------|---------|
| `frontend/src/utils/designTokens.ts` | Color tokens, status mapping, utilities |
| `frontend/tailwind.config.js` | Tailwind theme extension |
| `frontend/src/styles/index.css` | Global styles, base layer |
| `frontend/src/components/ui/primitives/` | Reusable UI components |
| `UI_DESIGN_SYSTEM.md` | Full documentation |

---

*Keep this card handy while developing!*