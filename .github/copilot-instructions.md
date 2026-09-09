---
applyTo: "**"
---

# Sainik School Project Tracker — Repository Instructions

## Project purpose

Build a small in-house web application to centrally track sanctioned items and their execution progress phase-wise.

The source workbook is:

`source-data/Sainik Phase wise Sheets.xls`

It contains two phase sheets, named similar to:

- `Phase - 1`
- `Phase -2`

The workbook contains item fields similar to:

- Offered Product
- Qty.
- Unit Price (Rs) (inclusive GST)
- Total Price (Rs) (inclusive GST)

The application must import the workbook once into MongoDB and then use the database as the source of truth for tracking updates.

## 📚 Design System Documentation

**All UI work must follow the design system:**

| Document                   | Location                             | Purpose                                                    |
| -------------------------- | ------------------------------------ | ---------------------------------------------------------- |
| **UI_DESIGN_SYSTEM.md**    | `../../UI_DESIGN_SYSTEM.md`          | Complete design system (colors, components, accessibility) |
| **UI_IMPROVEMENT_PLAN.md** | `../../UI_IMPROVEMENT_PLAN.md`       | Strategic improvement plan (6 focus areas, scope guard)    |
| **UI_COLOR_QUICK_REF.md**  | `../../UI_COLOR_QUICK_REF.md`        | Quick reference for Tailwind classes & patterns            |
| **designTokens.ts**        | `frontend/src/utils/designTokens.ts` | **Single source of truth** for all tokens                  |
| **tailwind.config.js**     | `frontend/tailwind.config.js`        | Tailwind theme (mirrors designTokens.ts)                   |

**Golden Rule**: `designTokens.ts` is the single source of truth. Never hardcode colors — use Tailwind classes mapped to tokens or component variants.

## MVP scope

Build only the following features in the first release:

1. One project: Sainik School Project.
2. Two phases imported from the workbook.
3. Dashboard with sanctioned value, item counts, status counts and value-weighted progress.
4. Phase-wise item table.
5. Search and status filtering.
6. Update an item's progress, status, optional quantity fields and remarks.
7. Central MongoDB storage through an Express API.
8. Responsive, professional in-house user interface.

Do not add these features unless explicitly requested:

- Authentication or user roles
- Multiple projects
- File or document uploads
- Approval workflow
- Email, SMS or push notifications
- Vendor management
- PDF or Excel report generation
- Audit history
- Real-time sockets
- Mobile application
- Complex analytics or advanced charts

## Technology stack

Use this stack unless explicitly changed:

### Frontend

- React
- Vite
- TypeScript with strict mode
- Tailwind CSS
- React Router
- Axios
- TanStack Query for server state
- Functional components and React hooks

### Backend

- Node.js 22 or newer
- Express 5
- TypeScript with strict mode
- MongoDB
- Mongoose
- Zod for request validation
- `xlsx` for the one-time legacy `.xls` import
- `tsx` for development
- `tsc` for production builds

### Repository

Use a monorepo layout:

```text
frontend/
backend/
source-data/
docs/
.github/
```

Keep frontend and backend package files separate. A root package may provide convenience scripts, but it must not hide the underlying frontend and backend commands.

## Implementation workflow

Work in small phases. Do not generate the complete project in one uncontrolled change.

Before editing:

1. Read this file.
2. Read the relevant path-specific instruction file.
3. Read `docs/MVP_SCOPE.md`.
4. Read `docs/IMPLEMENTATION_PLAN.md`.
5. Inspect existing code and continue from the current state instead of replacing working code.

For every implementation phase:

1. State the files that will be created or changed.
2. Implement only the current phase.
3. Run lint, type-check and build commands for affected packages.
4. Fix errors before stopping.
5. Update `docs/IMPLEMENTATION_PLAN.md`.
6. Summarize completed work, commands run and the next phase.

Do not ask questions when a safe project decision is already documented. Do not silently change the selected stack.

## Development Environment

**Always use Docker for development** - this ensures consistent environments across team members and matches production.

```bash
# Start full development stack with hot reload
docker-compose -f docker-compose.dev.yml up --build

# Stop the stack
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Rebuild a specific service
docker-compose -f docker-compose.dev.yml build frontend
docker-compose -f docker-compose.dev.yml build backend
```

The development stack includes:
- **Frontend** (Vite + React): http://localhost:5174 with hot module replacement
- **Backend** (Express + TypeScript): http://localhost:5001 with tsx watch mode
- **MongoDB**: localhost:27018 (persisted in docker volume)

Source code is mounted as volumes for instant hot reload - no rebuild needed for code changes.

## General coding standards

- Use TypeScript for all application files.
- Never use `any`. Use `unknown`, generics, interfaces or type guards.
- Prefer small, focused functions and components.
- Use descriptive names. Avoid abbreviations except common terms such as API, URL and ID.
- Use named exports for reusable modules.
- Keep business logic out of React components and Express route files.
- Avoid duplicate constants, status values and formatting logic.
- Use early returns for invalid or empty conditions.
- Do not leave commented-out code.
- Add comments only when they explain a non-obvious decision.
- Never expose secrets in source code.
- Provide `.env.example` files with placeholder values.
- Validate data on the backend even when the frontend also validates it.

## Shared domain rules

### Item statuses

Use one shared status vocabulary:

```text
not_started
procurement_in_progress
partially_delivered
delivered
installation_in_progress
testing_in_progress
completed
on_hold
```

Display human-friendly labels in the frontend, but send the stable values above through the API.

### Tracking fields

Each imported item contains immutable sanction fields:

- projectId
- phaseId
- productName
- sanctionedQty
- unitPricePaise
- totalPricePaise
- sourceSheetName
- sourceRowNumber
- sourceKey

Each item contains editable tracking fields:

- deliveredQty
- installedQty
- testedQty
- acceptedQty
- progressPercent
- status
- remarks
- updatedAt

Sanction fields must not be editable from the progress form.

Some workbook rows represent services, subscriptions, licences or manpower instead of physical equipment. Therefore:

- quantity tracking fields are optional operational details;
- `progressPercent` and `status` are the universal tracking fields;
- do not force every item through delivery, installation and testing;
- never automatically mark an item completed only because one quantity field is filled.

### Money

Store currency as integer paise:

- `unitPricePaise`
- `totalPricePaise`

Never store or calculate project money using formatted strings.

Display values with:

```ts
new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});
```

### Progress

Store `progressPercent` as an integer from 0 to 100.

Dashboard overall progress must be value-weighted:

```text
sum(item.totalPricePaise × item.progressPercent)
------------------------------------------------
sum(item.totalPricePaise)
```

Return `0` when the total sanctioned value is zero.

Phase progress uses the same calculation restricted to that phase.

### Quantity validation

When quantity details are entered:

- All quantities must be greater than or equal to zero.
- No tracking quantity may exceed sanctioned quantity.
- Accepted quantity may not exceed tested quantity when tested quantity is provided.
- Tested quantity may not exceed installed quantity when installed quantity is provided.
- Installed quantity may not exceed delivered quantity when delivered quantity is provided.

Do not apply sequence validation to fields the user leaves empty.

## Data model

Use three collections:

### Project

- name
- code or sanctionNumber, optional
- description, optional
- status
- timestamps

### Phase

- projectId
- name
- phaseNumber
- sourceSheetName
- timestamps

### Item

- projectId
- phaseId
- sanction fields
- tracking fields
- timestamps

Use Mongoose references but do not overuse `populate`. Prefer aggregation or targeted queries for dashboard summaries.

## Workbook import rules

Create an idempotent backend seed/import script.

- Read `source-data/Sainik Phase wise Sheets.xls`.
- Discover phase sheets by normalized sheet name rather than relying only on exact spaces or hyphens.
- Detect the header row by finding a cell equivalent to `Offered Product`.
- Normalize headers by trimming, collapsing whitespace, lowercasing and removing non-essential punctuation.
- Map Offered Product, Qty, Unit Price and Total Price.
- Skip blank rows.
- Skip total rows such as `Total Value`.
- Skip rows without a product name.
- Skip phase rows whose quantity is blank or not greater than zero.
- Preserve the original product name for display.
- Convert rupees to integer paise using rounding.
- Create a stable `sourceKey` from the normalized sheet name and source row number.
- Upsert by `sourceKey`, making repeated seed runs safe.
- Do not edit or overwrite the original workbook.
- Log imported, updated, skipped and failed row counts.
- Fail clearly when no valid phase sheets or header row are found.

The import is a developer/admin script only. Do not build an Excel upload screen in the MVP.

## API contract

Use a versioned base path:

```text
/api/v1
```

Required endpoints:

```text
GET    /api/v1/health
GET    /api/v1/projects/current
GET    /api/v1/projects/current/dashboard
GET    /api/v1/projects/current/phases
GET    /api/v1/phases/:phaseId/items
GET    /api/v1/items/:itemId
PATCH  /api/v1/items/:itemId/progress
```

The phase item endpoint supports:

```text
search
status
page
limit
sortBy
sortOrder
```

Use this response style:

```json
{
  "success": true,
  "data": {}
}
```

For paginated responses:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

For errors:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": []
}
```

Use appropriate HTTP status codes and centralized error handling.

## UI and design direction

Create a professional, compact, data-first admin interface suitable for an internal office application.

Use these design tokens consistently:

```text
Primary/navy:      #1F3A5F
Primary dark:      #14273F
Accent/green:      #2F855A
Warning/amber:     #D97706
Danger/red:        #DC2626
Page background:   #F5F7FA
Surface:           #FFFFFF
Main text:         #172033
Muted text:        #667085
Border:            #E4E7EC
```

Design rules:

- Use a light theme in the MVP.
- Use a left sidebar and top header on desktop.
- Use generous but not excessive spacing.
- Use 8px-based spacing and consistent border radii.
- Avoid gradients, glassmorphism, decorative illustrations and excessive animation.
- Use status badges with consistent semantic colors.
- Use clear loading, empty, error and success states.
- Keep the phase item table readable and dense.
- Use a modal or side panel for progress updates.
- Make the layout usable on tablet and mobile, but optimize first for desktop office use.
- Ensure keyboard accessibility, visible focus states and labelled form controls.

## Frontend pages

Required routes:

```text
/
  Redirect to /dashboard

/dashboard
/phases/:phaseId
```

Required UI areas:

- App shell with sidebar and header
- Dashboard summary cards
- Phase progress section
- Recent/attention-needed item section
- Phase item table
- Search and status filters
- Item progress update modal
- Confirmation and API error feedback

Do not add a login page in the MVP.

## Validation commands

After changes, use the scripts defined in each package. The intended commands are:

```bash
npm run lint
npm run typecheck
npm run build
```

For local development (using Docker - preferred):

```bash
docker-compose -f docker-compose.dev.yml up --build
```

This starts the full development stack with hot reload:
- Frontend: http://localhost:5174
- Backend API: http://localhost:5001
- MongoDB: localhost:27018

For local development (without Docker):

```bash
npm run dev
```

For the backend workbook import:

```bash
npm run seed
```

Do not claim a command passed unless it was actually run successfully.

## Logging System

The backend includes a comprehensive logging system using **Winston** with **daily log rotation**.

### Log Files (persisted via Docker volume `./backend/logs:/app/logs`)

| File | Retention | Purpose |
|------|-----------|---------|
| `application-YYYY-MM-DD.log` | 30 days | All application logs (debug, info, warn, error) |
| `error-YYYY-MM-DD.log` | 30 days | Errors only |
| `audit-YYYY-MM-DD.log` | 90 days | **Record change audit trail** (progress updates, status changes) |

### Logger Usage

```typescript
import { logger } from "../utils/logger.js";

// Business operations
logger.trackOperation("get_dashboard", { projectCode: "SAINIK", totalItems: 102 });

// Record changes (audit trail) - automatically goes to audit log
logger.trackRecordChange("Item", itemId, "progress_update", {
  progressPercent: 25,
  status: "IN_PROGRESS",
  deliveredQty: 1,
  remarks: "Partial delivery received",
});

// API requests (auto-logged by requestLogger middleware)
logger.trackApiRequest("GET", "/dashboard", 200, 5);

// Errors
logger.error("Failed to update item", { itemId }, error);
```

### Key Features

- **Structured JSON** in production, pretty-printed in development
- **Automatic API request logging** via `requestLogger` middleware
- **Audit trail** for all record modifications (trackRecordChange)
- **ESLint compliant** (uses console.warn/error only)
- **Docker volume persistence** — logs survive container restarts

### Accessing Logs

```bash
# On host (with volume mount)
cat backend/logs/application-2026-08-24.log
cat backend/logs/audit-2026-08-24.log

# Inside container
docker exec sainik-tracker-backend-dev cat /app/logs/audit-2026-08-24.log
```

# Modern Premium UI Redesign Rules

When a task requests a modern, stylish, premium, or complete UI redesign, do NOT perform a CSS-only update.

Before making changes, inspect the existing component structure and determine whether the current JSX/layout contributes to the outdated appearance.

You are allowed to:

- Restructure JSX
- Reorganize layouts
- Extract reusable UI components
- Replace generic card structures
- Create different layouts for different types of information
- Improve information hierarchy
- Introduce meaningful icons
- Add visual progress indicators
- Improve dashboard composition
- Redesign tables, filters, cards, navigation, and page layouts

You must preserve:

- Existing API calls
- API response handling
- State management
- Event handlers
- Business logic
- Calculations
- Search functionality
- Filters
- Pagination
- CRUD operations
- Form validation
- Routing

## Redesign Validation Rule

A UI redesign is NOT successful if the final result is essentially the same component structure with only:

- Different colors
- Different borders
- Different border radius
- Different shadows
- Different spacing
- Colored top borders
- Minor CSS changes

The redesign must demonstrate meaningful changes in:

- Component composition
- Layout structure
- Visual hierarchy
- Information grouping
- Data presentation
- User interaction presentation

Do not make every section look like the same white rectangular card.

Different UI components must have different visual purposes.

For example:

- KPI cards must look like metric components
- Progress information must use visual progress indicators
- Phase summaries must communicate project health
- Tables must look like professional data workspaces
- Filters must look like a compact control toolbar
- Navigation must feel like part of a modern application shell

Always preserve functionality while redesigning presentation.
