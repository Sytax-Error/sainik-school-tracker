---
name: "Sainik Tracker Frontend"
description: "React, TypeScript and UI conventions for the Sainik School project tracker frontend."
applyTo: "frontend/**/*.{ts,tsx,css}"
---

# Frontend Instructions

Apply the repository-wide instructions in `../copilot-instructions.md`.

## 📚 Design System Reference

**Required reading for all UI work:**

| Document                  | Location                       | Purpose                               |
| ------------------------- | ------------------------------ | ------------------------------------- |
| **UI_DESIGN_SYSTEM.md**   | `../../UI_DESIGN_SYSTEM.md`    | Complete design system specifications |
| **UI_COLOR_QUICK_REF.md** | `../../UI_COLOR_QUICK_REF.md`  | Quick Tailwind class reference        |
| **designTokens.ts**       | `../src/utils/designTokens.ts` | Single source of truth for tokens     |

**Rule**: Never hardcode colors. Use design tokens via Tailwind classes or component variants.

## Architecture

Use this feature-oriented structure:

```text
frontend/src/
├── api/
├── app/
├── components/
│   └── ui/
├── features/
│   ├── dashboard/
│   └── items/
├── layouts/
├── pages/
├── routes/
├── styles/
├── types/
└── utils/
```

Keep API calls in `api` or feature service modules. Do not call Axios directly inside presentational components.

Use TanStack Query for:

- Fetching dashboard data
- Fetching phases
- Fetching and filtering items
- Loading a single item
- Updating progress
- Invalidating affected dashboard and item queries after updates

Do not introduce Redux for the MVP.

## TypeScript and React

- Use functional components.
- Use named component exports.
- Define props with interfaces or explicit types.
- Avoid `React.FC` unless children typing is specifically needed.
- Never use `any`.
- Do not store derived API values in component state.
- Use controlled forms.
- Keep hooks unconditional and at the top level.
- Extract reusable behavior into custom hooks only when it is used more than once or materially simplifies a component.
- Use route parameters as strings and validate their presence before making requests.
- Handle aborting or stale requests through TanStack Query rather than manual flags.

## API client

Create one configured Axios client.

- Base URL comes from `VITE_API_BASE_URL`.
- Default development value is `http://localhost:5000/api/v1`.
- Set a reasonable timeout.
- Convert backend errors into one consistent frontend error shape.
- Do not add authentication interceptors in the MVP.

Keep API response types explicit and aligned with the backend contract.

## UI components

Create small reusable primitives before building pages:

- `Button`
- `Card`
- `Input`
- `Select`
- `Modal`
- `StatusBadge`
- `ProgressBar`
- `TableState`
- `Spinner`

Do not create a large generic component library. Build only components needed by the MVP.

## Dashboard

The dashboard must display:

- Total sanctioned value
- Phase 1 sanctioned value and progress
- Phase 2 sanctioned value and progress
- Total item count
- Not started count
- In-progress count
- Completed count
- On-hold count
- Overall value-weighted progress

Prefer cards, progress bars and concise status breakdowns. Do not add decorative charts unless explicitly requested.

## Phase item table

Required columns:

- Product
- Sanctioned quantity
- Unit price
- Total price
- Progress
- Status
- Last updated
- Action

Optional quantity details can be shown in the update modal rather than making the table too wide.

Table behavior:

- Search by product name
- Filter by status
- Server-side pagination
- Server-side sorting for supported fields
- Sticky header when practical
- Loading skeleton
- Empty state
- Error retry state
- Clear active filters button

Use query parameters or local filter state consistently. Debounce search input before sending API requests.

## Progress update form

The item name, sanctioned quantity and sanction value are read-only.

Editable fields:

- progressPercent
- status
- deliveredQty
- installedQty
- testedQty
- acceptedQty
- remarks

Quantity fields may be blank because not all items are physical products.

Frontend validation:

- Progress is an integer from 0 to 100.
- Quantities are non-negative when provided.
- Show backend validation messages near the relevant field when possible.
- Do not duplicate complex sequence rules differently from the backend.

After a successful update:

1. Close the modal.
2. Show a success message.
3. Invalidate item, phase list and dashboard queries.
4. Preserve current search, filters and pagination.

## Styling

- Use the color tokens defined in the repository instructions.
- Define shared CSS variables in `frontend/src/styles/theme.css`.
- Use Tailwind utilities consistently.
- Use `clsx` only when conditional classes become difficult to read.
- Avoid inline style objects except for truly dynamic numeric values.
- Use one spacing, radius and typography system.
- Do not use gradients or excessive shadows.
- Do not use animations beyond small transitions for modal, button and focus states.

## Formatting

Create shared utilities:

```text
formatCurrencyFromPaise
formatDate
formatPercentage
getStatusLabel
getStatusTone
```

Use `en-IN` and INR formatting. Do not format money separately in individual components.

## Accessibility

- Every input must have a visible label.
- Buttons must have meaningful text or an accessible name.
- The modal must support Escape to close and focus management.
- Do not communicate status using color alone.
- Maintain visible keyboard focus.
- Use semantic table markup.

## Error and state handling

Every API-driven page must intentionally handle:

- Initial loading
- Background refetch
- Empty data
- Recoverable API error
- Invalid route ID
- Mutation in progress
- Mutation failure
- Mutation success

Never render an empty blank screen while data is loading or unavailable.
